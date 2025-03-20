import { useState, useRef, useEffect } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";

import "./../board/FreePage.css"

function FreePage() {
    const [boardData, setBoardData] = useState([]);
    const [pageNumber, setPageNumber] = useState([]);
    const [nowPage, setNowPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [searchWord, setSearchWord] = useState('');
    const [totalRecord, setTotalRecord] = useState(0);

    const mounted = useRef(false);
    useEffect(()=>{
        if (!mounted.current) {
            mounted.current = true;
            getBoardList(1);
        }
    }, []);

    useEffect(()=>{
        getBoardList(nowPage);
    },[nowPage])
    
    function getBoardList(page) {
        let url = "http://localhost:9977/free/list?nowPage=" + page;

        if (searchWord !== null && searchWord !== '') {
            url += "&searchWord=" + searchWord;
        }
        
        axios.get(url)
        .then(res=>{
            setBoardData([]);

            res.data.list.map(function(record) {
                setBoardData(prev => {
                    return [...prev, {
                        id: record.id,
                        title: record.title,
                        category: record.category,
                        hit: record.hit,
                        username: record.user.username,
                        writedate: record.writedate
                    }];
                });
            });

            setPageNumber([]);
            let pVO = res.data.pVO;
            
            for (let p = pVO.startPageNum; p < pVO.startPageNum + pVO.onePageCount; p++) {
                if (p <= pVO.totalPage) {
                    setPageNumber((prev)=>{
                        return [...prev, p];
                    });
                }
            }

            setNowPage(pVO.nowPage);
            setTotalPage(pVO.totalPage);
            setTotalRecord(pVO.totalRecord);
        })
        .catch(err=>{
            console.log(err);
        });
    }

    function searchWordChange(e){
        setSearchWord(e.target.value);
    }
    const handleSearch = (e) => {
        if(e.key==='Enter') getBoardList(1);
    }

    return (
        <div className="free-container">
            <h2>자유게시판</h2>
            <div id="search">
                <input type="text" placeholder="검색어를 입력하세요" name="searchWord"
                    value={''||searchWord}  onChange={searchWordChange} onKeyUp={(e) => handleSearch(e)}
                />
                <input type="button" value="검색" onClick={()=>{getBoardList(1)}}/>
            </div>

            <div id="total-record">총 게시글 수: {totalRecord}개</div>
            
            <div className="board-list">
                <ul className="free-list-header">
                    <li>번호</li>
                    <li>제목</li>
                    <li>작성자</li>
                    <li>조회수</li>
                    <li>등록일</li>
                </ul>
                {
                    boardData.map(function(record){
                        return (
                            <ul className="free-list">
                                <li>
                                    {record.id}
                                </li>
                                <li style={{textAlign: 'left'}}>
                                    <Link to={`/free/view/${record.id}`}>
                                    {
                                        record.category === 'notice' && <span id="notice-sticker">공지</span>
                                    }
                                        <span>{record.title}</span>
                                    </Link>
                                </li>
                                <li>{record.username}</li>
                                <li>{record.hit}</li>
                                <li>{record.writedate}</li>
                            </ul>
                        )
                    })
                }
            </div>

            <div className="write-btn">
            {
                sessionStorage.getItem("loginStatus") == "Y" && 
                <div><Link state={{category: 'free'}} to={'/free/write'}>글쓰기</Link></div>
            }
            {
                sessionStorage.getItem("loginId") == "admin1234" &&
                <div><Link state={{category: 'notice'}} to={'/free/write'}>공지 등록</Link></div>
            }
            </div>

            <ul className="pagination">
                {
                    (function(){
                        if (nowPage > 1){
                            return (<a className="page-link" onClick={()=>setNowPage(nowPage-1)}>
                                        <li className="page-item">◀</li>
                                    </a>)
                        }
                    })()
                }
                {
                    pageNumber.map(function(pg){
                        var activeStyle = 'page-item';
                        if (nowPage == pg) var activeStyle = 'page-item active';
                        return (<a className="page-link" onClick={()=>setNowPage(pg)}>
                                    <li className={activeStyle}>{pg}</li>
                                </a>)
                    })
                }
                {
                    (function(){
                        if (nowPage < totalPage && nowPage > 0){
                            return (<a className="page-link" onClick={()=>setNowPage(nowPage + 1)}>
                                        <li className="page-item">▶</li>
                                    </a>)
                        }
                    })()
                }
            </ul>
        </div>
    )
}

export default FreePage;