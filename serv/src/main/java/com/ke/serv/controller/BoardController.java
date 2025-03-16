// BoardController.java
package com.ke.serv.controller;

import com.ke.serv.entity.EventEntity;
import com.ke.serv.entity.EventEntity.BoardCategory;
import com.ke.serv.service.BoardService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.security.MessageDigest; // ✅ MessageDigest import 추가
import java.security.NoSuchAlgorithmException; // ✅ NoSuchAlgorithmException import 추가
import java.nio.charset.StandardCharsets; // StandardCharsets import 추가
import java.math.BigInteger; // BigInteger import 추가


@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/board")
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;

    @GetMapping("/boardPage")
    @Transactional(readOnly = true) // ✅ 읽기 전용 트랜잭션 적용 (목록 조회)
    public ResponseEntity<Map<String, Object>> boardPage(
            @RequestParam(defaultValue = "EVENT") BoardCategory category, // 기본값 EVENT
            @PageableDefault(sort = "id", direction = Sort.Direction.DESC) Pageable pageable,
            @RequestParam(required = false) String searchType, // ✅ 검색 타입 파라미터 추가 (required = false)
            @RequestParam(required = false) String searchTerm, // ✅ 검색어 파라미터 추가 (required = false)
            HttpServletRequest req
    ) {
        System.out.println("BoardController - Category: " + category + ", SearchType: " + searchType + ", SearchTerm: " + searchTerm); // 로그 추가
        Page<EventEntity> boardPage = boardService.getBoardList(category, pageable, searchType, searchTerm); // ✅ Service 메소드에 검색 파라미터 전달

        System.out.println("BoardController - BoardPage: " + boardPage);

        Map<String, Object> response = new HashMap<>();
        response.put("list", boardPage.getContent());
        response.put("page", boardPage.getNumber());
        response.put("totalPages", boardPage.getTotalPages());
        response.put("totalElements", boardPage.getTotalElements());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/eventWriteOk")
    @Transactional
    public ResponseEntity<String> eventWriteOk(
            @RequestParam(value = "event_id", required = false) Integer eventId,
            @RequestParam("event_title") String title,
            @RequestParam("event_content") String content,
            @RequestParam(value = "event_startdate", required = false) String startDate,
            @RequestParam(value = "event_enddate", required = false) String endDate,
            @RequestParam(value = "mf", required = false) MultipartFile thumbnail,
            @RequestParam(value = "files", required = false) List<MultipartFile> contentImageFiles,
            @RequestParam("user_id") String userId,
            @RequestParam("category") BoardCategory category,
            @RequestParam("password") String password, // ✅ 비밀번호 파라미터 추가
            HttpServletRequest request
    ) {
        try {
            // 디버깅 로그 추가 (기존 로그 유지)
            System.out.println("Event ID: " + eventId);
            System.out.println("Title: " + title);
            System.out.println("Content: " + content);
            System.out.println("Start Date: " + startDate);
            System.out.println("End Date: " + endDate);
            System.out.println("Thumbnail: " + (thumbnail != null ? thumbnail.getOriginalFilename() : "없음"));
            System.out.println("Content Image Files: " + (contentImageFiles != null ? contentImageFiles.size() : 0));
            System.out.println("User ID: " + userId);
            System.out.println("Category: " + category);
            System.out.println("Password: " + (password != null ? "입력됨" : "없음")); // ✅ 비밀번호 로그 추가

            boardService.saveEvent(eventId, title, content, startDate, endDate, thumbnail, contentImageFiles, userId, category, password, request); // ✅ 비밀번호 파라미터 전달
            return ResponseEntity.ok(eventId == null ? "Event created successfully" : "Event updated successfully");
        } catch (IOException e) {
            return ResponseEntity.status(500).body(eventId == null ? "Error creating event: " : "Error updating event: " + e.getMessage());
        }
    }

    @GetMapping("/view/{id}") // ✅ 이 엔드포인트 추가!
    @Transactional(readOnly = false) // 🔥 변경
    public ResponseEntity<?> viewEvent(@PathVariable("id") int id) {
        Optional<EventEntity> eventOptional = boardService.getEvent(id); // 새로운 service 메소드 호출
        if (eventOptional.isPresent()) {
            return ResponseEntity.ok(eventOptional.get()); // event 가 있으면 200 OK 와 함께 event 정보 반환
        } else {
            return ResponseEntity.notFound().build(); // event 가 없으면 404 Not Found 반환
        }
    }

    @GetMapping("/view/edit/{id}") // ✅ 수정용 엔드포인트 추가!
    @Transactional(readOnly = true) // ✅ 읽기 전용 트랜잭션 적용 (수정 폼 조회)
    public ResponseEntity<?> editEvent(@PathVariable("id") int id) {
        Optional<EventEntity> eventOptional = boardService.getEvent(id); // 기존 getEvent 메소드 재활용
        if (eventOptional.isPresent()) {
            return ResponseEntity.ok(eventOptional.get()); // event 가 있으면 200 OK 와 함께 event 정보 반환
        } else {
            return ResponseEntity.notFound().build(); // event 가 없으면 404 Not Found 반환
        }
    }

    @DeleteMapping("/delete/{id}") // ✅ 삭제 엔드포인트 추가
    @CacheEvict(value = "boardPage", allEntries = true) // "boardPage" 라는 캐시를 모두 비움
    @Transactional // ✅ 쓰기 트랜잭션 적용 (삭제) - readOnly=false (기본값)
    public ResponseEntity<?> deleteEvent(@PathVariable("id") int id) {
        try {
            boardService.deleteEvent(id); // BoardService 에 삭제 로직 구현 필요
            return ResponseEntity.ok().build(); // 성공적으로 삭제되었을 경우 200 OK 반환
        } catch (Exception e) {
            // 삭제 실패 시 에러 처리 (예: 게시글이 없을 경우, 삭제 중 오류 발생 등)
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("삭제 중 오류 발생: " + e.getMessage());
        }
    }

    // ✅ 문의 게시판 상세 보기 엔드포인트 수정 (비밀번호 검증 추가)
    @GetMapping("/inquiryView/{id}")
    @Transactional(readOnly = false)
    public ResponseEntity<?> viewInquiry(
            @PathVariable("id") int id,
            @RequestParam("password") String password // ✅ 비밀번호 파라미터 추가
    ) {
        Optional<EventEntity> eventOptional = boardService.getEventWithPasswordCheck(id, password); // ✅ Service 메서드 변경 (비밀번호 검증 로직 추가)
        if (eventOptional.isPresent()) {
            return ResponseEntity.ok(eventOptional.get()); // 비밀번호 일치 시 EventEntity 반환
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("비밀번호가 일치하지 않습니다."); // 401 Unauthorized 반환 (비밀번호 불일치)
        }
    }

}