// BoardService.java
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


import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

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
    public Page<EventEntity> getBoardList(BoardCategory category, Pageable pageable) {
        Page<EventEntity> boardPage = boardRepository.findByCategory(category, pageable);
        System.out.println(boardPage);
        //여기서 fileUrl을 재정의 한다
        boardPage.forEach(event -> {
            UserEntity user = event.getUser();
            if (user != null) {
                userRepository.findByUserid(user.getUserid());//이부분은 수정하지 않아도 된다.
            }

            List<FileEntity> files = fileRepository.findByEvent(event);
            files.forEach(file -> { //files에서 fileUrl를 재정의
                String fileUrl = "/uploads/" + file.getFileName().substring(0, file.getFileName().indexOf("_")) + "/" + file.getFileName();

                file.setFileUrl(fileUrl);
            });//files에서 fileUrl를 재정의
            event.setFiles(files);
        });

        return boardPage;
    }

    @Transactional // 쓰기 트랜잭션
    public void saveEvent(String title, String content, String startDate, String endDate,
                          MultipartFile thumbnail, List<MultipartFile> files, String userId, BoardCategory category,
                          HttpServletRequest request) throws IOException {

        UserEntity user = userRepository.findByUserid(userId);
        if (user == null) {
            throw new IllegalArgumentException("Invalid user ID: " + userId);
        }

        EventEntity event = new EventEntity();
        event.setSubject(title);
        event.setContent(content);
        event.setCategory(category);

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm");
        if (startDate != null && !startDate.isEmpty()) {
            event.setCreateDate(LocalDateTime.parse(startDate, formatter));
        }
        if (endDate != null && !endDate.isEmpty()) {
            event.setModifiedDate(LocalDateTime.parse(endDate, formatter));
        }

        if (thumbnail != null && !thumbnail.isEmpty()) {
            FileEntity thumbnailFile = saveUploadedFile(thumbnail, event, user.getId(), request);
            event.addFile(thumbnailFile);
        }

        if (files != null && !files.isEmpty()) {
            for (MultipartFile file : files) {
                if (!file.isEmpty()) {
                    FileEntity fileEntity = saveUploadedFile(file, event, user.getId(), request);
                    event.addFile(fileEntity);
                }
            }
        }
        System.out.println("확인해볼게!!!!!" +  user);
        event.setUser(user);
        boardRepository.save(event);
    }

    // 수정된 saveUploadedFile 메서드 (디렉토리 생성)
    private FileEntity saveUploadedFile(MultipartFile file, EventEntity event, int boardId, HttpServletRequest request) throws IOException {
        String originalFilename = file.getOriginalFilename();
        String userFolder = "Board/UserId"; // 사용자별 폴더 경로 설정
//        String fileName = boardId + "_" + System.currentTimeMillis() + "_" + originalFilename; //UserId를 파일 이름에 추가
        String fileName =  boardId + "_" + System.currentTimeMillis() + "_" + originalFilename;
        String fileExt = originalFilename.substring(originalFilename.lastIndexOf(".") + 1);
        long fileSize = file.getSize();


        // 실제 경로 설정 (uploadPath 사용)
        Path filePath = Paths.get(uploadPath,  String.valueOf(boardId), fileName);

        // 파일 경로가 존재하지 않으면 생성
        Files.createDirectories(filePath.getParent());

        Files.write(filePath, file.getBytes());

//        String fileUrl = "/uploads/" + userFolder + "/" + fileName; // 수정: userFolder 사용 안 함, boardId 사용
        String fileUrl = "/uploads/" + boardId + "/" + fileName; // fileUrl 생성 로직 수정
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
}