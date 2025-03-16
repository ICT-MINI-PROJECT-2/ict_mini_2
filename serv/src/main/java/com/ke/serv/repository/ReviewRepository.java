package com.ke.serv.repository;

import com.ke.serv.entity.RestaurantEntity;
import com.ke.serv.entity.ReviewEntity;
import com.ke.serv.entity.ReviewFileEntity;
import com.ke.serv.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<ReviewEntity, Integer> {
    List<ReviewEntity> findAllByRestaurantOrderByIdDesc(RestaurantEntity re);

    List<ReviewEntity> findAllByUser(UserEntity ue);
}
