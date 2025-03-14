package com.ke.serv.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PagingEntity {
    private String searchWord;
    private String searchTag;

    private int nowPage = 1;
    private int onePageRecord = 12;

    private int totalRecord;
    private int totalPage;

    private int offset;

    private int onePageCount = 5;
    private int startPageNum = 1;

    public void setNowPage(int nowPage) {
        this.nowPage = nowPage;

        offset = (nowPage - 1) * onePageRecord;

        startPageNum = (nowPage - 1) / onePageCount * onePageCount + 1;
    }
    public void setTotalRecord(int totalRecord) {
        this.totalRecord = totalRecord;

        totalPage = (totalRecord % onePageRecord == 0) ?
                totalRecord / onePageRecord : totalRecord / onePageRecord + 1;
    }
}
