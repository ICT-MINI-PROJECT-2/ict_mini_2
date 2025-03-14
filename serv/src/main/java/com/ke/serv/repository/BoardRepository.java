package com.ke.serv.repository;

import com.ke.serv.entity.EventEntity;
import com.ke.serv.entity.EventEntity.BoardCategory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository // 추가
public interface BoardRepository extends JpaRepository<EventEntity, Integer> {

    @Query("SELECT COUNT(e) FROM EventEntity e WHERE (:category IS NULL OR e.category = :category)")
    int countByCategory(@Param("category") BoardCategory category);

    @Query("SELECT e FROM EventEntity e LEFT JOIN FETCH e.user")
    Page<EventEntity> findByCategory(@Param("category") BoardCategory category, Pageable pageable);

}