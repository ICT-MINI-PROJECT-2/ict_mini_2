package com.ke.serv.controller;

import com.ke.serv.entity.EventEntity;
import com.ke.serv.repository.BoardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/board")
@RequiredArgsConstructor
public class BoardController {
    private final BoardRepository service;

    @GetMapping("/boardList")
    public List<EventEntity> boardList(){
            return service.findAll();
    }

    @GetMapping("/boardModifie")
    public String boardModifie(){
        return null;
    }

    @GetMapping("/boardCreate")
    public String boardCreate(){
        return null;
    }

}
