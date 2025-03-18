package com.ke.serv.controller;

import com.ke.serv.entity.UserEntity;
import com.ke.serv.service.UserService;
import lombok.RequiredArgsConstructor;
import org.apache.catalina.User;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService service;

    @PostMapping("/signup")
    public String signup(@RequestBody UserEntity entity) {
        return "ok";
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