package com.ke.serv.controller;

import com.ke.serv.entity.PagingEntity;
import com.ke.serv.entity.RestaurantEntity;
import com.ke.serv.service.RestaurantService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/find")
@RequiredArgsConstructor
public class FindController {
    private final RestaurantService service;

    @PostMapping("/searchList")
    public List<RestaurantEntity> searchList(@RequestBody PagingEntity pe) {
        pe.setTotalRecord(service.totalRecord(pe));

        System.out.println(pe);

        List<RestaurantEntity> list = service.findListSelect(pe.getSearchWord());
        System.out.println(pe.getSearchWord() + ", " + pe.getSearchTag());

        String[] tagList = pe.getSearchTag().split("#");
        for (String s: tagList) {
            System.out.println(s);
        }
        return list;
    }

    @PostMapping("/findInfo")
    public RestaurantEntity getInfo(@RequestBody RestaurantEntity entity) {
        System.out.println(entity);
        return service.restaurantSelect(entity.getId());
    }
}
