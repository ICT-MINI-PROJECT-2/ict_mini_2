package com.ke.serv.service;

import com.ke.serv.entity.EventEntity;
import com.ke.serv.entity.EventEntity.BoardCategory;
import com.ke.serv.repository.BoardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BoardService {

    private final BoardRepository boardRepository;

    public Page<EventEntity> getBoardList(BoardCategory category, Pageable pageable) {
        return boardRepository.findByCategory(category, pageable); // EventEntity의 Page 반환
    }
}