package com.ke.serv.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import java.sql.Timestamp;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "Event")
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
    private Timestamp createDate;

    @LastModifiedDate
    private Timestamp modifiedDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BoardCategory category;

    public enum BoardCategory {
        EVENT, INQUIRY, NOTICE, FAQ
    }

}

/* [이벤트에 필요한 정보]

리스트 - 제목, 기간, 작성일
-> 형식은 격자형, 썸네일이 표시될 수 있게

세부 - 제목, 내용, 기간, 작성일, 이미지 관련

Event

읽었던 글을 불러올 수 있는 기능,

user  <- userboardread -> board

*/
