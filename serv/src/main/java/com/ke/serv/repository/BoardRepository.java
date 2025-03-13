package com.ke.serv.repository;

import com.ke.serv.entity.EventEntity;
import com.ke.serv.entity.EventEntity.BoardCategory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BoardRepository extends JpaRepository<EventEntity, Integer> {

    @Query("SELECT COUNT(e) FROM EventEntity e WHERE (:category IS NULL OR e.category = :category)")
    int countByCategory(@Param("category") BoardCategory category);

    // JOIN FETCH를 사용하여 EventEntity와 UserEntity를 함께 로드
    @Query("SELECT e FROM EventEntity e LEFT JOIN FETCH e.user WHERE (:category IS NULL OR e.category = :category)")
    Page<EventEntity> findByCategory(@Param("category") BoardCategory category, Pageable pageable);
}