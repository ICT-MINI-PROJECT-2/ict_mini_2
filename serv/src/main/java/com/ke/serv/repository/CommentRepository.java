package com.ke.serv.repository;

import com.ke.serv.entity.CommentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<CommentEntity, Integer> {
    List<CommentEntity> findAllByFreeBoardId(int boardId);

    int countById(int id);
}
