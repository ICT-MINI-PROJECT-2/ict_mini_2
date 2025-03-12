package com.ke.serv.repository;

import com.ke.serv.entity.RestaurantEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RestaurantRepository extends JpaRepository<RestaurantEntity, Integer> {
    RestaurantEntity findById(int id);

    List<RestaurantEntity> findByNameContaining(String searchWord);
}
