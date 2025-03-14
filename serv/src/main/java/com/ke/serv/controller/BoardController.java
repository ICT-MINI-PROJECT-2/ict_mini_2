// BoardController.java
package com.ke.serv.controller;

import com.ke.serv.entity.EventEntity;
import com.ke.serv.entity.EventEntity.BoardCategory;
import com.ke.serv.repository.BoardRepository;
import com.ke.serv.service.BoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*") // 모든 출처 허용 (보안상 주의) - 개발용
@RequestMapping("/board")
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;

    @GetMapping("/boardpage")
    public ResponseEntity<Map<String, Object>> boardPage(
            @RequestParam(defaultValue = "EVENT") BoardCategory category, // 기본값 EVENT
            @PageableDefault(sort = "id", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<EventEntity> boardPage = boardService.getBoardList(category, pageable);

        Map<String, Object> response = new HashMap<>();
        response.put("list", boardPage.getContent());  //게시글 목록
        response.put("page", boardPage.getNumber());     //현재 페이지 번호
        response.put("totalPages", boardPage.getTotalPages()); // 전체 페이지 수
        response.put("totalElements", boardPage.getTotalElements()); //전체 게시글 수

        return ResponseEntity.ok(response);
    }


    @PostMapping("/eventWriteOk")
    public ResponseEntity<String> eventWriteOk(
            @RequestParam("event_title") String title,
            @RequestParam("event_content") String content,
            @RequestParam("event_startdate") String startDate,
            @RequestParam("event_enddate") String endDate,
            @RequestParam("mf") MultipartFile thumbnail,
            @RequestParam(value = "files", required = false) List<MultipartFile> files, // 여러 파일 받기, 필수는 아님
            @RequestParam("user_id") String userId  // user_id 받기
    ) {
        try {

            boardService.saveEvent(title, content, startDate, endDate, thumbnail, files, userId); //files 파라미터
            return ResponseEntity.ok("Event created successfully");
        } catch (IOException e) {
            e.printStackTrace();// 오류 스택 트레이스 출력 (로깅으로 변경 권장)
            return ResponseEntity.status(500).body("Error creating event: " + e.getMessage());
        }
    }
    // 아래는 আপাতত 사용하지 않음
    @GetMapping("/boardModifie")
    public String boardModifie() {
        return null;
    }

    @GetMapping("/boardCreate")
    public String boardCreate() {
        return null;
    }
}