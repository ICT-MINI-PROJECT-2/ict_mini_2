package com.ke.serv.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "Event")
@EntityListeners(AuditingEntityListener.class)
public class EventEntity {

    @Id
    @Column(name = "Board_ID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false, length = 100)
    private String subject;

    @Column(nullable = false, length = 100)
    private String content;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createDate;

    @LastModifiedDate
    private LocalDateTime modifiedDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BoardCategory category;

    // UserEntity와의 관계 설정 (ManyToOne)
    @ManyToOne(fetch = FetchType.LAZY) // LAZY 로딩 (필요할 때만 UserEntity 로드)
    @JoinColumn(name = "user_no") // 외래 키 컬럼 이름
    private UserEntity user; // UserEntity 참조

    private int hit;

    public enum BoardCategory {
        EVENT, INQUIRY, NOTICE, FAQ
    }

}