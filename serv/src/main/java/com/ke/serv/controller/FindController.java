package com.ke.serv.controller;

import com.ke.serv.service.ReviewService;
import com.ke.serv.vo.PagingVO;
import com.ke.serv.entity.RestaurantEntity;
import com.ke.serv.service.RestaurantService;
import lombok.RequiredArgsConstructor;
import org.checkerframework.checker.units.qual.A;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/find")
@RequiredArgsConstructor
public class FindController {
    private final RestaurantService service;
    private final ReviewService review_service;

    @PostMapping("/searchList")
    public Map searchList(@RequestBody PagingVO pvo) {

        List<RestaurantEntity> list = new ArrayList<>();
        if(pvo.getSearchTag().isEmpty()) {
            if (pvo.getSort().equals("restaurant_no")) {
                pvo.setSort("id");
            }
            pvo.setTotalRecord(service.totalRecord(pvo));
            list = service.findListSelect(pvo);
        }
        else {
            String[] tagList = pvo.getSearchTag().split("#");
            List<String> loc_list = new ArrayList<>();
            List<String> cat_list = new ArrayList<>();
            for(int i=1;i< tagList.length;i++) {
                if(tagList[i].contains("구")) loc_list.add(tagList[i].replace(" ", ""));
                else cat_list.add(tagList[i].replace(" ", ""));
            }
            System.out.println(service.totalRecordByTag(pvo,cat_list,loc_list)+"!!");
            pvo.setTotalRecord(service.totalRecordByTag(pvo,cat_list,loc_list));
            list = service.findListByTag(pvo,cat_list,loc_list);
        }
        List<Integer> rating_size = new ArrayList<>();

        for(RestaurantEntity re: list) {
            rating_size.add(review_service.selectReviewList(re).size());
        }
        Map map = new HashMap();
        map.put("pvo", pvo);
        map.put("list", list);
        map.put("rating_size",rating_size);
        System.out.println(pvo.getOnePageRecord());
        return map;
    }

    @PostMapping("/findInfo")
    public RestaurantEntity getInfo(@RequestBody RestaurantEntity entity) {
        RestaurantEntity updatedEntity = service.restaurantSelect(entity.getId());

        updatedEntity.setHit(updatedEntity.getHit() + 1); // 조회수 증가
        service.hitUpdate(updatedEntity);

        return service.restaurantSelect(updatedEntity.getId());
    }
}
