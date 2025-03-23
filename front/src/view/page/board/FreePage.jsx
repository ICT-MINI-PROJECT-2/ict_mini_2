import { useState, useRef, useEffect } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";
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
    const mounted = useRef(false);

    const getBoardList = async (page) => {
        let url = `http://localhost:9977/free/list?nowPage=${page}`;
        if (searchWord !== '') {
            url += `&searchWord=${searchWord}`;
        }

        try {
            const res = await axios.get(url);
            const { noticeList, list, pVO } = res.data;

            setNoticeList(noticeList);
            setBoardData(list);

            const newPageNumbers = [];
            for (let p = pVO.startPageNum; p < pVO.startPageNum + pVO.onePageCount; p++) {
                if (p <= pVO.totalPage) {
                    newPageNumbers.push(p);
                }
            }
            setPageNumber(newPageNumbers);
            setNowPage(pVO.nowPage);
            setTotalPage(pVO.totalPage);
            setTotalRecord(pVO.totalRecord);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true;
            getBoardList(nowPage);
        }
    }, []);

    useEffect(() => {
        if (mounted.current) {
            getBoardList(nowPage);
        }
    }, [nowPage]);

    const searchWordChange = (e) => {
        setSearchWord(e.target.value);
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            getBoardList(1);
        }
    };

    const renderList = (data, isNotice = false) => {
        return data.map((record) => (
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
            <h2>자유게시판</h2>
            <div id="search">
                {currentView === 'all' ? (
                    <div onClick={() => { setCurrentView('notice'); }}>공지 전체 목록</div>
                ) : (
                    <div onClick={() => { setCurrentView('all'); }}>게시글 목록</div>
                )}
                <input
                    type="text"
                    placeholder="검색어를 입력하세요"
                    name="searchWord"
                    value={searchWord}
                    onChange={searchWordChange}
                    onKeyUp={handleSearch}
                />
                <input type="button" value="검색" onClick={() => { getBoardList(1); }} />
                {currentView === 'all' && (
                    <div>총 게시글 수: {totalRecord}개</div>
                )}
            </div>

            <div className="board-list">
                <ul className="free-list-header">
                    <li>번호</li>
                    <li>제목</li>
                    <li>작성자</li>
                    <li>조회수</li>
                    <li>등록일</li>
                </ul>
                {currentView === 'all' && (
                    <>
                        {renderList(noticeList.slice(0, 2), true)}
                        {boardData.map((record) => (
                            <ul className="free-list" key={record.id}>
                                <li>{record.id}</li>
                                <li style={{ textAlign: 'left' }}>
                                    <Link to={`/free/view/${record.id}`}>
                                        <span>{record.title}</span>
                                    </Link>
                                </li>
                                <li>
                                    <span
                                        style={{ cursor: 'pointer' }}
                                        id={`mgw-${record.user.id}`}
                                        className="msg-who"
                                    >
                                        {record.user.username}
                                    </span>
                                </li>
                                <li>{record.hit}</li>
                                <li>{record.writedate}</li>
                            </ul>
                        ))}
                    </>
                )}
                {currentView === 'notice' && renderList(noticeList, true)}
            </div>

            <div className="write-btn">
                {sessionStorage.getItem("loginStatus") === "Y" && currentView === 'all' && (
                    <Link state={{ category: 'free' }} to={'/free/write'}><div>글쓰기</div></Link>
                )}
                {sessionStorage.getItem("loginId") === "admin1234" && (
                    <Link state={{ category: 'notice' }} to={'/free/write'}><div>공지 등록</div></Link>
                )}
            </div>

            {currentView === 'all' && (
                <ul className="free-pagination">
                    {nowPage > 1 && (
                        <a className="free-page-link" onClick={() => setNowPage(nowPage - 1)}>
                            <li className="free-page-item">◀</li>
                        </a>
                    )}
                    {pageNumber.map((pg) => {
                        const activeStyle = nowPage === pg ? 'free-page-item active' : 'free-page-item';
                        return (
                            <a className="free-page-link" onClick={() => setNowPage(pg)} key={pg}>
                                <li className={activeStyle}>{pg}</li>
                            </a>
                        );
                    })}
                    {nowPage < totalPage && (
                        <a className="free-page-link" onClick={() => setNowPage(nowPage + 1)}>
                            <li className="free-page-item">▶</li>
                        </a>
                    )}
                </ul>
            )}
        </div>
    );
}

export default FreePage;