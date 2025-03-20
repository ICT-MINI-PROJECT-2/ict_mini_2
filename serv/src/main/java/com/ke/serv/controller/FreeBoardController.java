package com.ke.serv.controller;

import com.ke.serv.entity.FreeBoardEntity;
import com.ke.serv.service.FreeBoardService;
import com.ke.serv.vo.PagingVO;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/free")
@RequiredArgsConstructor
public class FreeBoardController {
    private final FreeBoardService service;

    @GetMapping("/list")
    public Map boardList(PagingVO pVO, @PageableDefault(sort="id", direction = Sort.Direction.DESC) Pageable pageable) {
        // 총레코드수
        pVO.setOnePageRecord(10);
        pVO.setTotalRecord(service.totalRecord(pVO));

        System.out.println(pVO);

        List<FreeBoardEntity> list = service.freePageSelect(pVO);

        Map map = new HashMap();
        map.put("pVO", pVO);
        map.put("list", list);

        return map;
    }

    @PostMapping("/writeOk")
    public String freeWriteOk(@RequestBody FreeBoardEntity entity) {
        FreeBoardEntity result = service.boardInsert(entity);

        if (result == null || result.getId() == 0) {
            return "fail";
        } else {
            return "success";
        }
    }

    @GetMapping("/view/{id}")
    public FreeBoardEntity boardView(@PathVariable("id") int id) {

        FreeBoardEntity entity = service.boardSelect(id);
        entity.setHit(entity.getHit() + 1);

        System.out.println(entity);
        return service.boardInsert(entity);
    }

    @PostMapping("/editOk")
    public String boardEditOk(@RequestBody FreeBoardEntity entity) {
        FreeBoardEntity selectEntity = service.boardSelect(entity.getId());

        entity.setCategory(selectEntity.getCategory());
        entity.setHit(selectEntity.getHit());
        entity.setWritedate(selectEntity.getWritedate());
        entity.setUser(selectEntity.getUser());

        FreeBoardEntity result = service.boardInsert(entity);

        if (result == null) {
            return "fail";
        } else {
            return "success";
        }
    }

    @GetMapping("/delete/{id}")
    public int boardDel(@PathVariable("id") int id) {
        service.boardDelete(id);
        return service.countBoardSelect(id);
    }
}
