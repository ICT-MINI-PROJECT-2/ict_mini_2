package com.ke.serv.controller;

import com.ke.serv.entity.PagingEntity;
import com.ke.serv.entity.RestaurantEntity;
import com.ke.serv.service.RestaurantService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/find")
@RequiredArgsConstructor
public class FindController {
    private final RestaurantService service;

    @PostMapping("/searchList")
    public Map searchList(@RequestBody PagingEntity pe) {
        pe.setTotalRecord(service.totalRecord(pe));

        List<RestaurantEntity> list = service.findListSelect(pe);
        System.out.println(pe.getSearchWord() + ", " + pe.getSearchTag());

        String[] tagList = pe.getSearchTag().split("#");
        for (String s: tagList) {
            System.out.println(s);
        }

        Map map = new HashMap();
        map.put("pe", pe);
        map.put("list", list);

        return map;
    }

    @PostMapping("/findInfo")
    public RestaurantEntity getInfo(@RequestBody RestaurantEntity entity) {
        System.out.println(entity);
        return service.restaurantSelect(entity.getId());
    }
}
