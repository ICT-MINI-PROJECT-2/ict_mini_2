package com.ke.serv.service;

import com.ke.serv.entity.RestaurantEntity;
import com.ke.serv.entity.ReviewEntity;
import com.ke.serv.entity.ReviewFileEntity;
import com.ke.serv.entity.UserEntity;
import com.ke.serv.repository.ReviewFileRepository;
import com.ke.serv.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {
    private final ReviewRepository repo;
    private final ReviewFileRepository f_repo;
    public ReviewEntity insert(ReviewEntity re) {
        return repo.save(re);
    }
    public ReviewFileEntity fileInsert(ReviewFileEntity rfe) {return f_repo.save(rfe);}
    public List<ReviewEntity> selectReviewList(RestaurantEntity re) {return repo.findAllByRestaurantOrderByIdDesc(re);}
    public List<ReviewFileEntity> selectReviewFileList(ReviewEntity re) {return f_repo.findAllByReview(re);}
    public List<ReviewEntity> selectReviewListByUser(UserEntity ue) {return repo.findAllByUser(ue);}
}
