package com.ke.serv.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.ke.serv.entity.RestaurantEntity;
import com.ke.serv.service.RecommendService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/recommend")
@RequiredArgsConstructor
public class RecommendController {
    private final RecommendService service;

    @PostMapping("/list")
    public List<RestaurantEntity> list(@RequestBody JsonNode request) {
        String category = request.get("menuCategory").asText();
        String address = request.get("address").asText();
        String dbCategory = "";
        if (category.equals("asia")) {
            dbCategory = "아시아음식";
        } else if (category.equals("buffet")) {
            dbCategory = "뷔페";
        } else if (category.equals("bunsik")) {
            dbCategory = "분식";
        } else if (category.equals("china")) {
            dbCategory = "중식";
        } else if (category.equals("fastfood")) {
            dbCategory = "패스트푸드";
        } else if (category.equals("hansik")) {
            dbCategory = "한식";
        } else if (category.equals("japan")) {
            dbCategory = "일식";
        } else if (category.equals("joojeom")) {
            dbCategory = "주점";
        } else if (category.equals("western")) {
            dbCategory = "양식";
        }
        System.out.println("dbCategory: " + dbCategory);
        System.out.println("address: " + address);

        try {
            List<RestaurantEntity> result = service.findByCategoryAndLocation(dbCategory, address);
            return result;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
