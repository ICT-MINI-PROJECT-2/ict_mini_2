package com.ke.serv.service;

import com.ke.serv.vo.PagingVO;
import com.ke.serv.entity.RestaurantEntity;
import com.ke.serv.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RestaurantService {
    private final RestaurantRepository repository;

    public List<RestaurantEntity> findListSelect(PagingVO pvo) {
        return repository.findByNameContaining(pvo.getSearchWord(), PageRequest.of(pvo.getNowPage() -1, pvo.getOnePageRecord()));
    }

    public RestaurantEntity restaurantSelect(int id) {
        return repository.findById(id);
    }

    public void addRestaurantByAPI(RestaurantEntity re) {repository.save(re);}

    public int totalRecord(PagingVO pvo) {
        if (pvo.getSearchWord() == null || pvo.getSearchWord().isEmpty()){
            return repository.countIdBy();
        } else {
            return repository.countIdByNameContaining(pvo.getSearchWord());
        }
    }
}
