// BoardController.java
package com.ke.serv.controller;

import com.ke.serv.entity.EventEntity;
import com.ke.serv.entity.EventEntity.BoardCategory;
import com.ke.serv.service.BoardService;
import jakarta.servlet.http.HttpServletRequest;
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
@CrossOrigin(origins = "*")
@RequestMapping("/board")
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;

    @GetMapping("/boardPage")
    public ResponseEntity<Map<String, Object>> boardPage(
            @RequestParam(defaultValue = "EVENT") BoardCategory category, // 기본값 EVENT
            @PageableDefault(sort = "id", direction = Sort.Direction.DESC) Pageable pageable,
            HttpServletRequest req
    ) {
        System.out.println("BoardController - Category: " + category); // 로그 추가
        Page<EventEntity> boardPage = boardService.getBoardList(category, pageable);

        System.out.println("BoardController - BoardPage: " + boardPage);

        Map<String, Object> response = new HashMap<>();
        response.put("list", boardPage.getContent());
        response.put("page", boardPage.getNumber());
        response.put("totalPages", boardPage.getTotalPages());
        response.put("totalElements", boardPage.getTotalElements());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/eventWriteOk")
    public ResponseEntity<String> eventWriteOk(
            @RequestParam("event_title") String title,
            @RequestParam("event_content") String content,
            @RequestParam("event_startdate") String startDate,
            @RequestParam("event_enddate") String endDate,
            @RequestParam("mf") MultipartFile thumbnail,
            @RequestParam("files") List<MultipartFile> files,
            @RequestParam("user_id") String userId,
            @RequestParam("category") BoardCategory category,
            HttpServletRequest request
    ) {
        try {
            // 디버깅 로그 추가
            System.out.println("Title: " + title);
            System.out.println("Content: " + content);
            System.out.println("Start Date: " + startDate);
            System.out.println("End Date: " + endDate);
            System.out.println("Thumbnail: " + thumbnail.getOriginalFilename());
            System.out.println("Files: " + files.size());
            System.out.println("User ID: " + userId);
            System.out.println("Category: " + category);

            boardService.saveEvent(title, content, startDate, endDate, thumbnail, files, userId, category, request);
            return ResponseEntity.ok("Event created successfully");
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error creating event: " + e.getMessage());
        }
    }
}