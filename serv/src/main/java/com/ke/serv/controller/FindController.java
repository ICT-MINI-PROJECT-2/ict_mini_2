package com.ke.serv.controller;

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

    @GetMapping("/searchList")
    public List<RestaurantEntity> searchList() {
        return service.findListSelect();
    }

    @PostMapping("/findInfo")
    public RestaurantEntity getInfo(@RequestBody RestaurantEntity entity) {
        System.out.println(entity);
        return service.restaurantSelect(entity.getId());
    }
}
