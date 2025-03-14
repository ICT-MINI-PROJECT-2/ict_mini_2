// EventEntity.java
package com.ke.serv.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "Event") // 테이블 이름 확인
@EntityListeners(AuditingEntityListener.class) // Auditing 활성화
public class EventEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Board_ID") // 컬럼 이름 확인
    private int id;

    @Column(nullable = false, length = 100)
    private String subject;

    @Column(nullable = false, length = 1000) // 텍스트가 길어질 수 있다면 length 늘리기, 또는 @Lob
    private String content;

    @CreatedDate // 자동 생성
    @Column(updatable = false)
    private LocalDateTime createDate;

    @LastModifiedDate // 자동 생성
    private LocalDateTime modifiedDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BoardCategory category;


    // UserEntity와의 관계 설정 (ManyToOne)
    @ManyToOne(fetch = FetchType.LAZY) // LAZY 로딩
    @JoinColumn(name = "user_no") // 외래 키 컬럼 이름 확인
    private UserEntity user;

    private int hit = 0;


    //    @Column(nullable = true) // 썸네일은 null 허용
    //    private String thumbnail; // 썸네일 이미지 URL (또는 파일 경로)

    // 썸네일은 FileEntity를 통해 관리
    // (thumbnail 필드 제거 또는 주석 처리)

    // FileEntity와의 관계 (One-to-Many)
    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
    // 1:N 관계에서는 mappedBy 필수, cascade, orphanRemoval 설정
    private List<FileEntity> files = new ArrayList<>(); // FileEntity 리스트


    // enum 타입 정의 (카테고리)
    public enum BoardCategory {
        EVENT, INQUIRY, NOTICE, FAQ
    }

    // FileEntity 추가/제거를 위한 편의 메서드 (선택 사항)
    public void addFile(FileEntity file) {
        files.add(file);
        file.setEvent(this);
    }

    public void removeFile(FileEntity file) {
        files.remove(file);
        file.setEvent(null);
    }
}