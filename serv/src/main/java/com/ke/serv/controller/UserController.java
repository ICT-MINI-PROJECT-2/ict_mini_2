package com.ke.serv.controller;

import com.ke.serv.entity.RestaurantEntity;
import com.ke.serv.entity.ReviewEntity;
import com.ke.serv.entity.UserEntity;
import com.ke.serv.entity.WishlistEntity;
import com.ke.serv.service.RestaurantService;
import com.ke.serv.service.UserService;
import com.ke.serv.vo.PagingWishVO;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService service;
    private final RestaurantService rest_sevice;
    @PostMapping("/signup")
    public String signup(@RequestBody UserEntity entity) {
        return "ok";
    }

    @PostMapping("/getWishList")
    public Map getWishList(UserEntity entity, PagingWishVO pwVO, @PageableDefault(sort="id", direction = Sort.Direction.DESC) Pageable pageable){
        pwVO.setTotalRecord(service.totalRecord(entity));
        List<WishlistEntity> we = service.findWishList(entity, pwVO); // 여기를 페이징
        List<RestaurantEntity> re = new ArrayList<>();
        for(WishlistEntity wish : we) {
            re.add(rest_sevice.restaurantSelect(wish.getRestaurant().getId()));
        }
        Map map = new HashMap();
        map.put("pwVO",pwVO);
        map.put("re", re);
        map.put("we", we);
        return map;
    }

    @PostMapping("/getReviewList")
    public Map getReviewList(UserEntity entity, PagingWishVO prVO, @PageableDefault(sort="id", direction =  Sort.Direction.DESC) Pageable pageable){
        prVO.setTotalRecord(service.totalReviewRecord(entity));
        List<ReviewEntity> review = service.findReviewList(entity, prVO);
        List<RestaurantEntity> rest = new ArrayList<>();
        for(ReviewEntity reviewEntity : review) {
            rest.add(rest_sevice.restaurantSelect(reviewEntity.getRestaurant().getId()));
        }
            Map map = new HashMap();
            map.put("prVO",prVO);
            map.put("rest",rest);
            map.put("review",review);
            return map;
        }

    @GetMapping("/graphData")
    public List<RestaurantEntity> getGraphData(UserEntity entity){
        List<WishlistEntity> we = service.graphData(entity);
        List<RestaurantEntity> redata = new ArrayList<>();
        for(WishlistEntity wish : we){
            redata.add(rest_sevice.restaurantSelect(wish.getRestaurant().getId()));
        }
        return redata;

    }




    @PostMapping("/editEnterChk")
    public UserEntity editEnterChk(@RequestBody UserEntity entity){
        UserEntity ue = new UserEntity();
        if(service.idEditChk(entity) == null){
            ue.setId(-1);
            return ue;
        }
        if(service.pwEditChk(entity)==null){
            ue.setId(-2);
            return ue;
        }

        return service.idEditChk(entity);
    }


    @PostMapping("/idChk")
    public String idChk(@RequestBody UserEntity entity) {
        if(service.idChk(entity) == null) return "0";
        return "1";
    }

    @PostMapping("/loginChk")
    public UserEntity loginchk(@RequestBody UserEntity entity) {
        UserEntity ue = new UserEntity();
        if(service.idChk(entity) == null) {
            ue.setId(-1);
            return ue;
        }
        if(service.pwChk(entity) == null) {
            ue.setId(-2);
            return ue;
        }
        return service.idChk(entity);
    }

    @PostMapping("/checkList")
    public String checkList(@RequestBody UserEntity entity) {
        System.out.println(service.signup(entity));
       return "foodsupdate ok";
    }
}