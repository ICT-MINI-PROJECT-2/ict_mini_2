package com.ke.serv.controller;

import com.ke.serv.entity.EventEntity;
import com.ke.serv.entity.EventEntity.BoardCategory;
import com.ke.serv.repository.BoardRepository;
import com.ke.serv.service.BoardService; // BoardService 추가
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/board") //  <-  /board는 상위 경로로 유지
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;

    @GetMapping("/boardpage") //  <-  /boardList 대신 /boardpage로 변경
    public ResponseEntity<Map<String, Object>> boardPage( // 메서드 이름도 boardList -> boardPage
                                                          @RequestParam(required = false) BoardCategory category,
                                                          @PageableDefault(sort = "id", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<EventEntity> boardPage = boardService.getBoardList(category, pageable);

        Map<String, Object> response = new HashMap<>();
        response.put("list", boardPage.getContent());
        response.put("page", boardPage.getNumber());
        response.put("totalPages", boardPage.getTotalPages());
        response.put("totalElements", boardPage.getTotalElements());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/boardModifie")
    public String boardModifie() {
        return null;
    }

    @GetMapping("/boardCreate")
    public String boardCreate() {
        return null;
    }
}