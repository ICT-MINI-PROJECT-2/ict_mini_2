package com.ke.serv.service;

import com.ke.serv.entity.RestaurantEntity;
import com.ke.serv.repository.RecommendRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RecommendService {
    private final RecommendRepository repository;

    public List<RestaurantEntity> findByCategoryAndLocation(String category, String location) {
        return repository.findByCategoryAndLocation(category, location);
    }
}
