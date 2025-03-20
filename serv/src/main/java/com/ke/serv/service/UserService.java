package com.ke.serv.service;

import com.ke.serv.entity.RestaurantEntity;
import com.ke.serv.entity.UserEntity;
import com.ke.serv.entity.WishlistEntity;
import com.ke.serv.repository.UserRepository;
import com.ke.serv.repository.WishRepository;
import com.ke.serv.vo.PagingVO;
import com.ke.serv.vo.PagingWishVO;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository repo;
    private final WishRepository wishRepo;

    public UserEntity signup(UserEntity entity) {
        return repo.save(entity);
    }

    public UserEntity idChk(UserEntity entity) {
        return repo.findByUserid(entity.getUserid());
    }
    public UserEntity pwChk(UserEntity entity) {
        return repo.findByUseridAndUserpw(entity.getUserid(), entity.getUserpw());
    }

    public UserEntity selectUser(UserEntity entity) {
        return repo.findById(entity.getId());
    }
    //wishlist 만들곳
    public WishlistEntity wishUpdate(WishlistEntity entity) {
        return wishRepo.save(entity);
    }

    public WishlistEntity selectWishRestaurant(RestaurantEntity re, UserEntity ue) {
        return wishRepo.findByRestaurantAndUser(re, ue);
    }

    public List<WishlistEntity> findWishList(UserEntity entity, PagingWishVO pwVO) {
        return wishRepo.findAllByUser(entity, PageRequest.of(pwVO.getNowPage() -1, pwVO.getOnePageRecord()));
    }

    public int totalRecord(PagingWishVO pwVO) {
        return wishRepo.countIdBy();
    }

    public List<WishlistEntity> graphData(UserEntity entity){
        return wishRepo.findAllByUser(entity);
    }
}
