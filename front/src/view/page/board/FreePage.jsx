import { useState, useRef, useEffect } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";
import Interact2 from '../Interact2';
import "./../board/FreePage.css"

function FreePage() {
    const [boardData, setBoardData] = useState([]);
    const [noticeList, setNoticeList] = useState([]);
    const [pageNumber, setPageNumber] = useState([]);
    const [nowPage, setNowPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [searchWord, setSearchWord] = useState('');
    const [totalRecord, setTotalRecord] = useState(0);
    const [currentView, setCurrentView] = useState('all');

    const [interact2, setInteract2] = useState({
        isOpen:false,
        selected:0
    });

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
            setNoticeList(res.data.noticeList);
            setBoardData(res.data.list);

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

    const renderList = (data, isNotice = false) => {
        return data.map(record => (
            <ul className="free-list" key={record.id}>
                <li>{record.id}</li>
                <li style={{ textAlign: 'left' }}>
                    <Link to={`/free/view/${record.id}`}>
                        {isNotice && <span id="notice-sticker">공지</span>}
                        <span>{record.title}</span>
                    </Link>
                </li>
                <li>{record.user.username}</li>
                <li>{record.hit}</li>
                <li>{record.writedate}</li>
            </ul>
        ));
    };
    

    return (
        <div className="free-container">
            {interact2.isOpen && <Interact2 interact2={interact2} setInteract2={setInteract2}/>}
            <h2>자유게시판</h2>
            <div id="search">
                {
                    currentView === 'all' ? 
                    <div onClick={()=>{setCurrentView('notice')}}>공지 전체 목록</div>
                    : <div onClick={()=>{setCurrentView('all')}}>게시글 목록</div>
                }
                <input type="text" placeholder="검색어를 입력하세요" name="searchWord"
                    value={''||searchWord}  onChange={searchWordChange} onKeyUp={(e) => handleSearch(e)}
                />
                <input type="button" value="검색" onClick={()=>{getBoardList(1)}}/>
                {
                    currentView === 'all' &&
                    <div>총 게시글 수: {totalRecord}개</div>
                }
            </div>

            <div className="board-list">
                <ul className="free-list-header">
                    <li>번호</li>
                    <li>제목</li>
                    <li>작성자</li>
                    <li>조회수</li>
                    <li>등록일</li>
                </ul>
                {
                    currentView === 'all' && (
                        <>
                            {renderList(noticeList.slice(0, 2), true)}
                            boardData.map(record=>{
                              return (
                                  <ul className="free-list">
                                      <li>
                                          {record.id}
                                      </li>
                                      <li style={{textAlign: 'left'}}>
                                          <Link to={`/free/view/${record.id}`}>
                                              <span>{record.title}</span>
                                          </Link>
                                      </li>
                                      <li style={{cursor:'pointer'}}onClick={(e)=>{ !interact2.isOpen && sessionStorage.getItem("id") !=record.user.id && setInteract2({selected:record.user, isOpen:true, where:e})}}><span>{record.user.username}</span></li>
                                      <li>{record.hit}</li>
                                      <li>{record.writedate}</li>
                                  </ul>
                              )
                          })
                        </>
                    )
                }
                {
                    currentView === 'notice' && renderList(noticeList, true)
                }

            </div>

            <div className="write-btn">
            {
                sessionStorage.getItem("loginStatus") == "Y" && 
                <Link state={{category: 'free'}} to={'/free/write'}><div>글쓰기</div></Link>
            }
            {
                sessionStorage.getItem("loginId") == "admin1234" &&
                <Link state={{category: 'notice'}} to={'/free/write'}><div>공지 등록</div></Link>
            }
            </div>

            {
                currentView === 'all' &&
        
                <ul className="free-pagination">
                    {
                        (function(){
                            if (nowPage > 1){
                                return (<a className="free-page-link" onClick={()=>setNowPage(nowPage-1)}>
                                            <li className="free-page-item">◀</li>
                                        </a>)
                            }
                        })()
                    }
                    {
                        pageNumber.map(function(pg){
                            var activeStyle = 'free-page-item';
                            if (nowPage == pg) var activeStyle = 'free-page-item active';
                            return (<a className="free-page-link" onClick={()=>setNowPage(pg)}>
                                        <li className={activeStyle}>{pg}</li>
                                    </a>)
                        })
                    }
                    {
                        (function(){
                            if (nowPage < totalPage && nowPage > 0){
                                return (<a className="free-page-link" onClick={()=>setNowPage(nowPage + 1)}>
                                            <li className="free-page-item">▶</li>
                                        </a>)
                            }
                        })()
                    }
                </ul>
            }
        </div>
    )
}

export default FreePage;