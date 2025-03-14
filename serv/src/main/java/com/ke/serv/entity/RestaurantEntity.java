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
    private int id;

    @Column(name = "RESTAURANT_NAME")
    private String name;

    private String location;

    @Column(columnDefinition = "float")
    private float latitudex;

    @Column(columnDefinition = "float")
    private float latitudey;

    private String tel;

    private String postno;

    private String category_1;

    private String category_2;

    @Column(columnDefinition = "float")
    private float area;

    @Column(nullable = false, columnDefinition = "float default 0.0")
    private float rating;
}
