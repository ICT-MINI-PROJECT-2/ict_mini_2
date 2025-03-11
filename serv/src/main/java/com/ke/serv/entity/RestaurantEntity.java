package com.ke.serv.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "RESTAURANT")
public class RestaurantEntity {

    @Id
    @Column(name = "RESTAURANT_NO")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "RESTAURANT_NAME", nullable = false)
    private String name;

    @Column(nullable = false)
    private String location;
}
