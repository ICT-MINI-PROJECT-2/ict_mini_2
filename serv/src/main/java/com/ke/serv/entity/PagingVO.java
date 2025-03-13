package com.ke.serv.entity;


import lombok.ToString;

@ToString

public class PagingVO {
    private int nowPage = 1; //현재페이지
    private int onePageRecord = 5; //한 페이지의 표시할 레코드 수

    private int totalRecord; //총레코드 수
    private int totalPage; //총페이지 수

    private int offset; //선택레코드의 시작위치

    /*페이지번호*/
    private int onePageCount=5; //한번에 표시할 페이지 수
    private int startPageNum=1; //페이지 번호의 시작값

    /*검색어*/
    private String searchKey;
    private String searchWord;

    public int getNowPage() {
        return nowPage;
    }
    public void setNowPage(int nowPage) {
        this.nowPage = nowPage;

        // 현재페이지가 있으면 레코드 선택위치가 정해짐
        // offset은 0부터 매겨짐
        offset = (nowPage-1) * onePageRecord;

        //페이지번호의 시작값 계산
        //	(현재페이지-1)/한번에 표시할 페이지*한번에 표시할 페이지 +1
        startPageNum = (nowPage-1)/onePageCount*onePageCount+1;
    }
    public int getOnePageRecord() {
        return onePageRecord;
    }
    public void setOnePageRecord(int onePageRecord) {
        this.onePageRecord = onePageRecord;
    }
    public int getTotalRecord() {
        return totalRecord;
    }
    public void setTotalRecord(int totalRecord) {
        this.totalRecord = totalRecord;

        //총페이지 수 구하기
        totalPage = (totalRecord%onePageRecord == 0)? totalRecord/onePageRecord:totalRecord/onePageRecord+1;
    }
    public int getTotalPage() {
        return totalPage;
    }
    public void setTotalPage(int totalPage) {
        this.totalPage = totalPage;
    }
    public int getOffset() {
        return offset;
    }
    public void setOffset(int offset) {
        this.offset = offset;
    }
    public int getOnePageCount() {
        return onePageCount;
    }
    public void setOnePageCount(int onePageCount) {
        this.onePageCount = onePageCount;
    }
    public int getStartPageNum() {
        return startPageNum;
    }
    public void setStartPageNum(int startPageNum) {
        this.startPageNum = startPageNum;
    }
    public String getSearchKey() {
        return searchKey;
    }
    public void setSearchKey(String searchKey) {
        this.searchKey = searchKey;
    }
    public String getSearchWord() {
        return searchWord;
    }
    public void setSearchWord(String searchWord) {
        this.searchWord = searchWord;
    }
}
