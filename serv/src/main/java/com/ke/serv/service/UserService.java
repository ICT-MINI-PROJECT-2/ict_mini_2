package com.ke.serv.service;

import com.ke.serv.entity.UserEntity;
import com.ke.serv.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository repo;

    public UserEntity signup(UserEntity entity) {
        return repo.save(entity);
    }

    public UserEntity idChk(UserEntity entity) {
        return repo.findByUserid(entity.getUserid());
    }
    public UserEntity pwChk(UserEntity entity) {
        return repo.findByUseridAndUserpw(entity.getUserid(), entity.getUserpw());
    }

    public UserEntity selectUser(UserEntity entity) {
        return repo.findById(entity.getId());
    }
}
