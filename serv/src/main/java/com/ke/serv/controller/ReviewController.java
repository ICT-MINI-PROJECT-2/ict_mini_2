package com.ke.serv.controller;

import com.ke.serv.entity.PagingEntity;
import com.ke.serv.entity.RestaurantEntity;
import com.ke.serv.entity.ReviewEntity;
import com.ke.serv.service.RestaurantService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.sql.SQLException;
import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/review")
@RequiredArgsConstructor
public class ReviewController {
    @PostMapping("/write")
    @Transactional(rollbackFor = {RuntimeException.class, SQLException.class})
    public String write(ReviewEntity re, MultipartFile[] files, HttpServletRequest req) {
        System.out.println(re);
        System.out.println(files.length);
        return "!";
    }

}
