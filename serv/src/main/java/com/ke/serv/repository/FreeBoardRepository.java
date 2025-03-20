package com.ke.serv.repository;

import com.ke.serv.entity.FreeBoardEntity;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FreeBoardRepository extends JpaRepository<FreeBoardEntity, Integer> {
    int countIdBy();

    int countIdByTitleContaining(String searchWord);

    List<FreeBoardEntity> findAllByOrderByIdDesc(PageRequest of);

    List<FreeBoardEntity> findAllByTitleContainingOrderByIdDesc(String searchWord, PageRequest of);

    FreeBoardEntity findById(int id);

    int countById(int id);
}
