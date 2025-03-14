package com.ke.serv.service;

import com.ke.serv.entity.EventEntity;
import com.ke.serv.entity.FileEntity;
import com.ke.serv.entity.UserEntity;
import com.ke.serv.entity.EventEntity.BoardCategory;
import com.ke.serv.repository.BoardRepository;
import com.ke.serv.repository.FileRepository;
import com.ke.serv.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;


import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;


@Service
@RequiredArgsConstructor
//@Transactional // 클래스 레벨 대신 메서드 레벨로 변경
public class BoardService {

    private final BoardRepository boardRepository;
    private final UserRepository userRepository;
    private final FileRepository fileRepository;

    @Value("${file.upload.path}")
    private String uploadPath;

    @Transactional(readOnly = true) // 읽기 전용 트랜잭션
    public Page<EventEntity> getBoardList(BoardCategory category, Pageable pageable) {
        //  return boardRepository.findByCategory(category, pageable);

        //  fetch join 사용하지 않고,  page<EventEntity> 가져온 후, 각 EventEntity에 대해 연관된 FileEntity들을 로딩.
        Page<EventEntity> boardPage = boardRepository.findByCategory(category, pageable);

        // (수정)
        boardPage.forEach(event -> {
            List<FileEntity> files = fileRepository.findByEvent(event);
            event.setFiles(files); // 명시적으로 설정 (LAZY 로딩),  N+1 발생.  해결하려면 다른 방법(EntityGraph, DTO) 사용해야함.
        });
        return boardPage;
    }

    @Transactional // 쓰기 트랜잭션
    public void saveEvent(String title, String content, String startDate, String endDate,
                          MultipartFile thumbnail, List<MultipartFile> files, String userId) throws IOException {

        // UserEntity 가져오기 (null 체크)
        UserEntity user = userRepository.findByUserid(userId);
        if (user == null) {
            throw new IllegalArgumentException("Invalid user ID: " + userId);
        }

        EventEntity event = new EventEntity();
        event.setSubject(title);
        event.setContent(content);
        event.setCategory(EventEntity.BoardCategory.EVENT); // 카테고리

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm");
        //startDate가 null 또는 ""이 아니면,
        if(startDate != null && !startDate.isEmpty()){
            event.setCreateDate(LocalDateTime.parse(startDate, formatter));
        }
        //endDate가 null 또는 ""이 아니면,
        if(endDate != null && !endDate.isEmpty()) {
            event.setModifiedDate(LocalDateTime.parse(endDate, formatter));
        }

        // 썸네일 처리 (FileEntity 사용)
        if (thumbnail != null && !thumbnail.isEmpty()) {
            FileEntity thumbnailFile = saveUploadedFile(thumbnail, event); // 별도 메서드로 분리
            event.addFile(thumbnailFile); // addFile 메서드 사용 (EventEntity에 추가)
            //event.setThumbnail(thumbnailFile.getFileUrl()); // thumbnail 제거
        }

        // 파일 처리 (FileEntity 사용)
        if(files != null && !files.isEmpty()){
            for (MultipartFile file : files) {
                if (!file.isEmpty()) { // 빈 파일이 아닌 경우에만 처리
                    FileEntity fileEntity = saveUploadedFile(file, event); // 별도 메서드
                    event.addFile(fileEntity);
                }
            }
        }


        boardRepository.save(event); // 게시글 저장 (cascade로 FileEntity도 함께 저장)
    }
    // 파일 저장 로직을 별도 메서드로 분리 (DRY 원칙)
    private FileEntity saveUploadedFile(MultipartFile file, EventEntity event) throws IOException {
        String originalFilename = file.getOriginalFilename(); // 원래 파일 이름
        String fileName = System.currentTimeMillis() + "_" + originalFilename; // 고유한 파일 이름 생성
        String fileExt = originalFilename.substring(originalFilename.lastIndexOf(".") + 1); // 확장자
        long fileSize = file.getSize(); // 파일 크기
        Path filePath = Paths.get(uploadPath, fileName); // 저장 경로
        Files.write(filePath, file.getBytes());
        String fileUrl = "/uploads/" + fileName; // URL (또는 상대 경로)

        FileEntity fileEntity = new FileEntity();
        fileEntity.setFileName(fileName);
        fileEntity.setFileExt(fileExt);
        fileEntity.setFileSize(fileSize);
        fileEntity.setFileUrl(fileUrl);  // URL 저장
        fileEntity.setEvent(event); // EventEntity 설정
        fileEntity.setOriginalFileName(originalFilename); //원본 파일 명
        fileEntity.setContentType(file.getContentType());

        return fileRepository.save(fileEntity); // FileEntity 저장 후 반환
    }
}