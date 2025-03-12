package com.ke.serv.controller;

import com.ke.serv.entity.UserEntity;
import com.ke.serv.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService service;

    @PostMapping("/signup")
    public String signup(@RequestBody UserEntity entity) {
        System.out.println(service.signup(entity));
        return "ok";
    }

    @PostMapping("/idChk")
    public String idChk(@RequestBody UserEntity entity) {
        if(service.idChk(entity) == null) return "0";
        return "1";
    }

    @PostMapping("/loginChk")
    public String loginchk(@RequestBody UserEntity entity) {
        if(service.idChk(entity) == null) return "0";
        if(service.pwChk(entity) == null) return "1";
        return service.idChk(entity).getUsername();
    }
}
