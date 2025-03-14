package com.ke.serv.controller;

import com.ke.serv.entity.RestaurantEntity;
import com.ke.serv.entity.ReviewEntity;
import com.ke.serv.entity.ReviewFileEntity;
import com.ke.serv.service.RestaurantService;
import com.ke.serv.service.ReviewService;
import com.ke.serv.vo.ReviewImgVO;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.interceptor.TransactionAspectSupport;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/review")
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewService service;
    private final RestaurantService rest_service;
    @GetMapping("/list")
    public List<ReviewImgVO> list(String restid){
        RestaurantEntity re = new RestaurantEntity();
        re.setId(Integer.parseInt(restid));
        List<ReviewEntity> review_list = service.selectReviewList(re);
        List<ReviewImgVO> result= new ArrayList<>();
        float rating = 0;
        float sum = 0;
        for(ReviewEntity review : review_list) {
            sum+=review.getRating();
            List<ReviewFileEntity> file_list = service.selectReviewFileList(review);
            ReviewImgVO rivo = new ReviewImgVO(file_list, review);
            result.add(rivo);
        }
        rating = sum/review_list.size();
        re.setRating(rating);
        rest_service.addRestaurantByAPI(re);
        return result;
    }

    @PostMapping("/write")
    @Transactional(rollbackFor = {RuntimeException.class, SQLException.class})
    public String write(ReviewEntity re, MultipartFile[] files, HttpServletRequest req) {
        System.out.println(re);
        System.out.println(files.length);
        List<File> file_list =null;
        try{
            ReviewEntity res_review = service.insert(re);
            file_list = new ArrayList<File>();
            for(MultipartFile mf: files) {
                String FILE_PATH = req.getServletContext().getRealPath("/uploads/review/")+res_review.getId();
                String orgFilename = mf.getOriginalFilename();
                System.out.println(orgFilename+"!");
                File f_folder = new File(FILE_PATH);
                if(!f_folder.exists()) f_folder.mkdirs();
                File f = new File(FILE_PATH, Objects.requireNonNull(orgFilename));
                int point = orgFilename.lastIndexOf(".");
                String fName = orgFilename.substring(0, point);
                String eName = orgFilename.substring(point + 1);
                if(f.exists()) {
                    for(int i=1;;i++) {
                        String newFilename = fName + "(" + i + ")." + eName;
                        File newFile = new File(FILE_PATH, newFilename);
                        if (!newFile.exists()) {
                            fName = fName + "(" + i + ")";
                            break;
                        }
                    }
                }
                File newFileObject = new File(FILE_PATH, fName + "." + eName);
                System.out.println(newFileObject);
                mf.transferTo(newFileObject);

                file_list.add(newFileObject);

                int size = (int) newFileObject.length();
                ReviewFileEntity rfe = new ReviewFileEntity(0,fName+"."+eName,size,res_review);
                ReviewFileEntity rfe_2 = service.fileInsert(rfe);
            }
        } catch (Exception e) {
            e.printStackTrace();
            for (File delFile : file_list) {
                delFile.delete();
            }
            TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
            return "fail";
        }
        return "ok";
    }

}
