package com.ke.serv.controller;

import com.ke.serv.entity.UserEntity;
import com.ke.serv.service.UserService;
import lombok.RequiredArgsConstructor;
import org.jsoup.Connection;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.springframework.util.ObjectUtils;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/tech")
@RequiredArgsConstructor
public class TechController {
    private final UserService service;

    @GetMapping("/jsoup")
    public HashMap infoSearch(String place_id) {
        System.out.println(place_id);

        System.setProperty("webdriver.chrome.driver","chromedriver.exe");

        ChromeOptions options=new ChromeOptions();
        options.addArguments("--disable-popup-blocking");//팝업 무시
        options.addArguments("headless");
        options.addArguments("--remote-allow-origins=*");
        WebDriver driver = new ChromeDriver(options);

        String[] category = new String[2];
        category[0] = "photoview";
        category[1] = "menuinfo";

        String url = "https://place.map.kakao.com/"+place_id;
        List<String> menu_list = new ArrayList<>();
        List<String> img_list = new ArrayList<>();
        List<String> info_list = new ArrayList<>();
        HashMap<String, List> map = new HashMap<>();
        try{
            driver.get(url);
            Thread.sleep(500);
            List<WebElement> buttons = driver.findElements(By.className("link_more"));
            List<WebElement> imgs = driver.findElements(By.className("img-thumb"));
            List<WebElement> when = driver.findElements(By.className("txt_detail"));
            System.out.println(when.size());
            for(WebElement wh : when) {
                if(!wh.getText().isEmpty()) info_list.add(wh.getText());
            }
            for(WebElement img : imgs) {
                img_list.add(img.getAttribute("src"));
            }
            System.out.println(imgs.size());
            for(WebElement button : buttons) {
                if(button.getText().contains("메뉴")) {
                    button.click();
                    break;
                }
            }
            List<WebElement> elements = driver.findElements(By.className("tit_item"));
            for(WebElement element : elements) {
                menu_list.add(element.getText());
            }
        } catch(Exception e) {
            e.printStackTrace();
        }
        driver.quit();
        map.put("menu_list", menu_list);
        map.put("img_list", img_list);
        map.put("info_list",info_list);
        return map;
    }
    /*
    @PostMapping("/getImg")
    public List<String> getImg(@RequestBody List<String> ids) {
        System.out.println(ids);
        System.setProperty("webdriver.chrome.driver","chromedriver.exe");

        ChromeOptions options=new ChromeOptions();
        options.addArguments("--disable-popup-blocking");//팝업 무시
        options.addArguments("headless");
        options.addArguments("--remote-allow-origins=*");
        options.addArguments("--disable-images");
        options.addArguments("--blink-settings=imagesEnabled=false");
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");
        WebDriver driver = new ChromeDriver(options);
        List<String> res = new ArrayList<>();
        for(String place_id : ids) {
            String url = "https://place.map.kakao.com/"+place_id;
            try{
                driver.get(url);
                Thread.sleep(500);
                WebElement img = driver.findElement(By.className("img-thumb"));
                res.add(img.getAttribute("src"));
            } catch(Exception e) {
                res.add("");
            }
        }
        driver.quit();
        System.out.println(res.size());
        return res;
    }*/
}
