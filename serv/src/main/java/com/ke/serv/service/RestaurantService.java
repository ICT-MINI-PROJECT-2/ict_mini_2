package com.ke.serv.service;

import com.ke.serv.entity.PagingEntity;
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

    public List<RestaurantEntity> findListSelect(PagingEntity pe) {
        return repository.findByNameContaining(pe.getSearchWord(), PageRequest.of(pe.getNowPage() -1, pe.getOnePageRecord()));
    }

    public RestaurantEntity restaurantSelect(int id) {
        return repository.findById(id);
    }

    public void addRestaurantByAPI(RestaurantEntity re) {repository.save(re);}

    public int totalRecord(PagingEntity pe) {
        if (pe.getSearchWord() == null || pe.getSearchWord().isEmpty()){
            return repository.countIdBy();
        } else {
            return repository.countIdByNameContaining(pe.getSearchWord());
        }
    }
}
