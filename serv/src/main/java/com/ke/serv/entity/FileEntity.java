package com.ke.serv.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name="FILE_ENTITY")
public class FileEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="FILE_ID")
    private int id;

    @Column(nullable = false)
    private String file_name;

    @Column(nullable = false, length = 10)
    private String ext_name;

    // 2,100,235,129
    @Column(nullable = false)
    private int file_size;

}
