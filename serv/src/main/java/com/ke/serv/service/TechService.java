package com.ke.serv.service;


import com.ke.serv.entity.DmEntity;
import com.ke.serv.repository.DmRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TechService {
    private final DmRepository repo;

    public void insertDm(DmEntity entity){
        repo.save(entity);
    }
}
