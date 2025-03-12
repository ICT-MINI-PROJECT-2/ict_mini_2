package com.ke.serv.repository;

import com.ke.serv.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<UserEntity, Integer> {

    UserEntity findByUserid(String userid);
    UserEntity findByUseridAndUserpw(String userid, String userpw);
}
