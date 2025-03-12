package com.ke.serv.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name="USER")
public class UserEntity {

    @Id
    @Column(name="user_no")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private String userid;

    @Column(nullable = false)
    private String userpw;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String email1;

    @Column(nullable = false)
    private String email2;

    @Column(nullable = false)
    private String tel1;

    @Column(nullable = false)
    private String tel2;

    @Column(nullable = false)
    private String tel3;

    @Column(nullable = false)
    private int zipcode;

    @Column(nullable = false)
    private String addr;

    private String addrdetail;
}
