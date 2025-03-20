// BoardRepository.java
package com.ke.serv.repository;

import com.ke.serv.entity.EventEntity;
import com.ke.serv.entity.EventEntity.BoardCategory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository // 추가
public interface BoardRepository extends JpaRepository<EventEntity, Integer> {

    @Query("SELECT COUNT(e) FROM EventEntity e WHERE (:category IS NULL OR e.category = :category)")
    int countByCategory(@Param("category") BoardCategory category);

    @Query(value = "SELECT e FROM EventEntity e WHERE e.category = :category",
            countQuery = "SELECT COUNT(e) FROM EventEntity e WHERE e.category = :category")
    Page<EventEntity> findByCategory(@Param("category") BoardCategory category, Pageable pageable);

    // BoardRepository.java 수정 (조회수 증가를 위한 쿼리 추가)
    @Modifying
    @Query("UPDATE EventEntity e SET e.hit = e.hit + 1 WHERE e.id = :id")
    void incrementHitCount(@Param("id") int id);

    // ✅✅✅ 검색 기능 쿼리 메소드 추가 (JPA 쿼리 메소드 활용) ✅✅✅
    Page<EventEntity> findByCategoryAndSubjectContainingIgnoreCaseOrContentContainingIgnoreCase( // 제목+내용 검색
                                                                                                 @Param("category") BoardCategory category,
                                                                                                 @Param("subjectKeyword") String subjectKeyword,
                                                                                                 @Param("contentKeyword") String contentKeyword,
                                                                                                 Pageable pageable);

    Page<EventEntity> findByCategoryAndSubjectContainingIgnoreCase( // 제목만 검색
                                                                    @Param("category") BoardCategory category,
                                                                    @Param("subjectKeyword") String subjectKeyword,
                                                                    Pageable pageable);

    @Query("SELECT e FROM EventEntity e JOIN e.user u WHERE e.category = :category AND LOWER(u.userid) LIKE LOWER(CONCAT('%', :useridKeyword, '%'))")
    Page<EventEntity> searchByCategoryAndUserId(
            @Param("category") EventEntity.BoardCategory category,
            @Param("useridKeyword") String useridKeyword,
            Pageable pageable);

    List<EventEntity> findAllByCategoryOrderByStartDateAsc(EventEntity.BoardCategory category);
}