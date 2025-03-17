package com.ke.serv.service;

import com.ke.serv.entity.EventEntity;
import com.ke.serv.entity.FileEntity;
import com.ke.serv.entity.UserEntity;
import com.ke.serv.entity.EventEntity.BoardCategory;
import com.ke.serv.repository.BoardRepository;
import com.ke.serv.repository.FileRepository;
import com.ke.serv.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.NoSuchFileException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.nio.charset.StandardCharsets;
import java.math.BigInteger;


@Service
@RequiredArgsConstructor
@Slf4j
//@Transactional // 클래스 레벨 대신 메서드 레벨로 변경
public class BoardService {

    private final BoardRepository boardRepository;
    private final UserRepository userRepository;
    private final FileRepository fileRepository;

    @Value("${file.upload.path}")
    private String uploadPath;


    @Transactional(readOnly = true)
    public Page<EventEntity> getBoardList(BoardCategory category, Pageable pageable, String searchType, String searchTerm) {
        Page<EventEntity> boardPage;

        if (StringUtils.hasText(searchTerm)) {
            String keyword = searchTerm.trim();

            if ("제목내용".equals(searchType)) {
                boardPage = boardRepository.findByCategoryAndSubjectContainingIgnoreCaseOrContentContainingIgnoreCase(
                        category, keyword, keyword, pageable);
            } else if ("제목만".equals(searchType)) {
                boardPage = boardRepository.findByCategoryAndSubjectContainingIgnoreCase(
                        category, keyword, pageable);
            } else if ("작성자".equals(searchType)) {
                boardPage = boardRepository.findByCategoryAndUser_UsernameContainingIgnoreCase(
                        category, keyword, pageable);
            } else {
                boardPage = boardRepository.findByCategory(category, pageable);
            }
        } else {
            boardPage = boardRepository.findByCategory(category, pageable);
        }

        System.out.println(boardPage);
        boardPage.forEach(event -> {
            UserEntity user = event.getUser();
            if (user != null) {
                userRepository.findByUserid(user.getUserid());
            }

            List<FileEntity> files = fileRepository.findByEvent(event);
            /*
            files.forEach(file -> {
                String fileUrl = "/uploads/" + file.getFileName().substring(0, file.getFileName().indexOf("_")) + "/" + file.getFileName();

                file.setFileUrl(fileUrl);
            });
            */
            event.setFiles(files);
        });

        return boardPage;
    }

    @Transactional
    public void saveEvent(Integer eventId, String title, String content, String startDate, String endDate,
                          MultipartFile thumbnail, List<MultipartFile> contentImageFiles, String userId, BoardCategory category, String password,
                          HttpServletRequest request) throws IOException {

        UserEntity user = userRepository.findByUserid(userId);
        if (user == null) {
            throw new IllegalArgumentException("Invalid user ID: " + userId);
        }

        EventEntity event;
        List<FileEntity> existingFiles = new ArrayList<>();

        if (eventId != null) {
            Optional<EventEntity> existingEventOptional = boardRepository.findById(eventId);
            if (existingEventOptional.isPresent()) {
                event = existingEventOptional.get();
                event.setModifiedDate(LocalDateTime.now());
                existingFiles = event.getFiles();
                event.getFiles().clear();

                if (thumbnail != null && !thumbnail.isEmpty()) {
                    FileEntity oldThumbnail = existingFiles.stream()
                            .filter(file -> file.getContentType() != null && file.getContentType().startsWith("image/"))
                            .findFirst().orElse(null);

                    if (oldThumbnail != null) {
                        fileRepository.delete(oldThumbnail);
                    }
                }


            } else {
                throw new IllegalArgumentException("Event not found with ID: " + eventId);
            }
        } else {
            event = new EventEntity();
        }

        event.setSubject(title);
        event.setContent(content);
        event.setCategory(category);
        event.setUser(user);
        if (category == BoardCategory.INQUIRY && password != null && !password.isEmpty()) {
            event.setPassword(hashPassword(password)); // SHA-256 hash
        } else {
            event.setPassword(null);
        }


        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm");
        if (startDate != null && !startDate.isEmpty()) {
            event.setStartDate(LocalDateTime.parse(startDate, formatter));
        }
        if (endDate != null && !endDate.isEmpty()) {
            event.setEndDate(LocalDateTime.parse(endDate, formatter));
        }

        List<FileEntity> newFiles = new ArrayList<>();

        EventEntity new_e = boardRepository.save(event);

        if (thumbnail != null && !thumbnail.isEmpty()) {
            FileEntity thumbnailFile = saveUploadedFile(thumbnail, new_e, new_e.getId(), request);
            newFiles.add(thumbnailFile);
        } else if (eventId != null) {
            FileEntity oldThumbnail = existingFiles.stream()
                    .filter(file -> file.getContentType() != null && file.getContentType().startsWith("image/"))
                    .findFirst().orElse(null);
            if(oldThumbnail != null){
                newFiles.add(oldThumbnail);
            }
        }


        if (contentImageFiles != null && !contentImageFiles.isEmpty()) {
            for (MultipartFile file : contentImageFiles) {
                if (!file.isEmpty()) {
                    FileEntity fileEntity = saveUploadedFile(file, new_e, new_e.getId(), request);
                    newFiles.add(fileEntity);
                }
            }
        }
    }


    private FileEntity saveUploadedFile(MultipartFile file, EventEntity event, int boardId, HttpServletRequest request) throws IOException {
        String originalFilename = file.getOriginalFilename();
        String userFolder = "Board/UserId";
        String fileName = boardId + "_" + System.currentTimeMillis() + "_" + originalFilename;
        String fileExt = originalFilename.substring(originalFilename.lastIndexOf(".") + 1);
        long fileSize = file.getSize();


//        Path filePath = Paths.get(uploadPath, String.valueOf(boardId), fileName);
        Path filePath = Paths.get(request.getServletContext().getRealPath("/uploads/board"), String.valueOf(boardId), fileName);
        System.out.println(boardId+"!!!!!");


        Files.createDirectories(filePath.getParent());

        Files.write(filePath, file.getBytes());

        String fileUrl = "/uploads/board/" + boardId + "/" + fileName;
        System.out.println(fileUrl+"!#!#");

        FileEntity fileEntity = new FileEntity();
        fileEntity.setFileName(fileName);
        fileEntity.setFileExt(fileExt);
        fileEntity.setFileSize(fileSize);
        fileEntity.setFileUrl(fileUrl);
        fileEntity.setEvent(event);
        fileEntity.setOriginalFileName(originalFilename);
        fileEntity.setContentType(file.getContentType());
        fileEntity.setExtName(fileExt);

        return fileRepository.save(fileEntity);
    }

    @Transactional
    public Optional<EventEntity> getEvent(int id) {
        Optional<EventEntity> eventOptional = boardRepository.findById(id);

        if (eventOptional.isPresent()) {
            EventEntity event = eventOptional.get();

            event.setHit(event.getHit() + 1);
            boardRepository.save(event);

            UserEntity user = event.getUser();
            if (user != null) {
                userRepository.findByUserid(user.getUserid());
            }

            List<FileEntity> files = fileRepository.findByEvent(event);
            files.forEach(file -> {
                String fileUrl = "/uploads/" + file.getFileName().substring(0, file.getFileName().indexOf("_")) + "/" + file.getFileName();
                file.setFileUrl(fileUrl);
            });
            event.setFiles(files);

            return Optional.of(event);
        }
        return Optional.empty();
    }

    private boolean isThumbnailUpdated(HttpServletRequest request) {
        return false;
    }

    @Transactional
    public void deleteEvent(int id) {
        log.info("deleteEvent 메서드 시작 - Event ID: {}", id);

        Optional<EventEntity> eventOptional = boardRepository.findById(id);
        if (eventOptional.isPresent()) {
            EventEntity event = eventOptional.get();

            log.info("EventEntity 찾음 - ID: {}, Subject: {}", event.getId(), event.getSubject());

            try {
                List<FileEntity> files = fileRepository.findByEvent(event);
                log.info("첨부 파일 목록 조회 - 파일 수: {}", files.size());
                for (FileEntity file : files) {
                    try {
                        fileRepository.delete(file);
                        log.info("FileEntity 삭제 성공 - File ID: {}", file.getId());
                    } catch (Exception fileDeleteEx) {
                        log.error("FileEntity 삭제 중 오류 발생 - File ID: {}", file.getId(), fileDeleteEx);
                        throw fileDeleteEx;
                    }
                }
            } catch (Exception fileLoopEx) {
                log.error("첨부 파일 삭제 루프 전체 오류 발생", fileLoopEx);
                throw fileLoopEx;
            }


            try {
                log.info("boardRepository.delete(event) 호출 전 - Event ID: {}", event.getId());
                boardRepository.delete(event);
                log.info("boardRepository.delete(event) 호출 후 - Event ID: {}", event.getId());
                log.info("EventEntity 삭제 성공 - Event ID: {}", event.getId());
            } catch (Exception boardDeleteEx) {
                log.error("boardRepository.delete(event) 삭제 중 오류 발생 - Event ID: {}", event.getId(), boardDeleteEx);
                throw boardDeleteEx;
            }


        } else {
            log.warn("삭제할 EventEntity 없음 - Event ID: {}", id);
            throw new IllegalArgumentException("Event not found with ID: " + id);
        }
        log.info("deleteEvent 메서드 종료 - Event ID: {}", id);
    }

    @Transactional
    public void updateHitCount(int id) {
        boardRepository.incrementHitCount(id);
    }


    @Transactional(readOnly = true)
    public Optional<EventEntity> getEventWithPasswordCheck(int id, String password) {
        Optional<EventEntity> eventOptional = boardRepository.findById(id);

        if (eventOptional.isPresent()) {
            EventEntity event = eventOptional.get();

            if (event.getCategory() != BoardCategory.INQUIRY || event.getPassword() == null) {
                return Optional.of(event);
            }

            if (checkPassword(password, event.getPassword())) {
                event.setHit(event.getHit() + 1);
                boardRepository.save(event);

                UserEntity user = event.getUser();
                if (user != null) {
                    userRepository.findByUserid(user.getUserid());
                }

                List<FileEntity> files = fileRepository.findByEvent(event);
                files.forEach(file -> {
                    String fileUrl = "/uploads/" + file.getFileName().substring(0, file.getFileName().indexOf("_")) + "/" + file.getFileName();
                    file.setFileUrl(fileUrl);
                });
                event.setFiles(files);

                return Optional.of(event);
            } else {
                return Optional.empty();
            }
        }
        return Optional.empty();
    }


    // ✅ SHA-256 해시 함수
    private String hashPassword(String password) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] encodedhash = digest.digest(password.getBytes(StandardCharsets.UTF_8));
            return bytesToHex(encodedhash);
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
            return null;
        }
    }

    // ✅ SHA-256 해시값 비교 함수
    private boolean checkPassword(String inputPassword, String hashedPassword) {
        String hashedInputPassword = hashPassword(inputPassword);
        return hashedInputPassword != null && hashedInputPassword.equals(hashedPassword);
    }


    // ✅ byte[] to hex string 변환 함수
    private String bytesToHex(byte[] hash) {
        BigInteger number = new BigInteger(1, hash);
        StringBuilder hexString = new StringBuilder(number.toString(16));
        while (hexString.length() < 32) {
            hexString.insert(0, '0');
        }
        return hexString.toString();
    }

    public void deleteFile(Long fileId) { // ✅ 파일 삭제 메소드 구현 (인터페이스 구현 제거), fileId 타입 Long 유지
        Optional<FileEntity> fileOptional = fileRepository.findById(fileId);

        if (fileOptional.isPresent()) {
            FileEntity fileEntity = fileOptional.get();

            // 1. 실제 파일 스토리지에서 파일 삭제
            Path filePath = Paths.get(uploadPath, String.valueOf(fileEntity.getEvent().getId()), fileEntity.getFileName());
            try {
                Files.deleteIfExists(filePath);
                System.out.println("파일 삭제 성공: " + filePath.toString());
            } catch (NoSuchFileException e) {
                System.out.println("파일이 이미 존재하지 않습니다: " + filePath.toString()); // 파일이 이미 없는 경우 로그만 남기고 성공 처리
            }
            catch (IOException e) {
                System.err.println("파일 삭제 실패: " + filePath.toString() + ", 오류: " + e.getMessage());
                throw new RuntimeException("파일 삭제 실패: " + e.getMessage());
            }


            // 2. 데이터베이스에서 파일 정보 삭제
            fileRepository.deleteById(fileId);

        } else {
            throw new IllegalArgumentException("파일을 찾을 수 없습니다.");
        }
    }


}