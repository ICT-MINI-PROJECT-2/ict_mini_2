package com.ke.serv.controller;

import com.ke.serv.entity.RestaurantEntity;
import com.ke.serv.service.RestaurantService;
import lombok.RequiredArgsConstructor;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;
import java.util.HashMap;

@RestController
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class HomeController {
    private final RestaurantService rest_service;

    @GetMapping("/")
    public String home(){
        return "index";
    }

    @GetMapping("/test")
    public RestaurantEntity test(String val) {
        String url = "https://map.naver.com/p/search/아침햇참";
        try {
            Document doc = Jsoup.connect(url).get();
            System.out.println(doc);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return rest_service.restaurantSelect(Integer.parseInt(val));
    }

    @GetMapping("/api")
    public String setAPI(){
        String result="";
        HashMap<String,Integer> h1 = new HashMap<String, Integer>(20);
        try{
            for(int i=0;i<500;i++) {
                URL url = new URL("http://openapi.seoul.go.kr:8088/59564b4578726a73353353466c4a6e/json/LOCALDATA_072404/"+Integer.toString(1000*i+1)+"/"+Integer.toString(1000*i+1000)+"/");
                BufferedReader bf = new BufferedReader(new InputStreamReader(url.openStream(), "UTF-8"));
                result = bf.readLine();
                JSONParser jsonParser = new JSONParser();
                JSONObject jsonObject = (JSONObject) jsonParser.parse(result);
                JSONObject LOCALDATA_072404 = (JSONObject) jsonObject.get("LOCALDATA_072404");

                Long cnt = (Long) LOCALDATA_072404.get("list_total_count");
                JSONObject subResult = (JSONObject) LOCALDATA_072404.get("RESULT");
                JSONArray infoArr = (JSONArray) LOCALDATA_072404.get("row");
                System.out.println(infoArr.size());
                RestaurantEntity re = new RestaurantEntity();
                for (int j = 0; j < infoArr.size(); j++) {
                    //h1.put((String) ((JSONObject) infoArr.get(j)).get("UPTAENM"), 1); //업태
                    // ((JSONObject) infoArr.get(j)).get("TRDSTATENM"); //폐업여부
                    if(!((JSONObject) infoArr.get(j)).get("TRDSTATENM").equals("폐업")) {
                        re.setName((String)((JSONObject) infoArr.get(j)).get("BPLCNM"));
                        re.setLocation((String)((JSONObject) infoArr.get(j)).get("SITEWHLADDR"));
                        try {
                            re.setLatitudex(Float.parseFloat((String)((JSONObject) infoArr.get(j)).get("X")));
                            re.setLatitudey(Float.parseFloat((String)((JSONObject) infoArr.get(j)).get("Y")));
                            re.setArea(Float.parseFloat((String)((JSONObject) infoArr.get(j)).get("SITEAREA")));
                        } catch(Exception ee){
                            System.out.println("!");
                        }
                        re.setTel((String) ((JSONObject) infoArr.get(j)).get("SITETEL"));
                        re.setPostno((String) ((JSONObject) infoArr.get(j)).get("SITEPOSTNO"));
                        re.setCategory_1((String) ((JSONObject) infoArr.get(j)).get("UPTAENM"));
                        re.setCategory_2((String) ((JSONObject) infoArr.get(j)).get("SNTUPTAENM"));
                        re.setId(i*1000+j+1);
                        rest_service.addRestaurantByAPI(re);
                    }
                }
            }

        } catch(Exception e) {
            e.printStackTrace();
        }
        return "hello!";
    }
}
