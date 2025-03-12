package com.ke.serv.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "REVIEW")
public class ReviewEntity {
    @Id
    @Column(name = "REVIEW_NO")
    private int id;

    @Column(nullable = false)
    private String comment;

    @CreationTimestamp
    @Column(columnDefinition = "DATETIME default now()")
    private String writedate;

    @ManyToOne
    @JoinColumn(name = "RESTAURANT_NO")
    private RestaurantEntity restaurant;

    @ManyToOne
    @JoinColumn(name = "USER_NO")
    private UserEntity user;
}
