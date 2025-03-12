package com.ke.serv.repository;

import com.ke.serv.entity.EventEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BoardRepository extends JpaRepository<EventEntity, Integer> {

}
