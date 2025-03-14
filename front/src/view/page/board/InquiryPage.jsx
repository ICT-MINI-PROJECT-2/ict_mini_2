// InquiryPage.js
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

function InquiryPage() {
    const [boardData, setBoardData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [searchWord, setSearchWord] = useState('');
    const location = useLocation();
    const [activeCategory, setActiveCategory] = useState('INQUIRY'); // 기본값 INQUIRY

    useEffect(() => {
        const category = new URLSearchParams(location.search).get('category') || 'INQUIRY'; //기본값
        setActiveCategory(category);
        getBoardPage(0, category);
    }, [location]);

    function getBoardPage(page, category = activeCategory) {
        let url = `http://localhost:9977/board/boardpage?page=${page}&category=${category}`; //8080 포트 사용
        if (searchWord) {
            url += `&searchWord=${searchWord}`;
        }

        axios.get(url)
            .then(function (response) {
                setBoardData(response.data.list);
                setCurrentPage(response.data.page);
                setTotalPages(response.data.totalPages);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

     // 날짜 포맷팅 함수 추가 (시작일과 종료일)
     function formatDateTime(dateTimeString) {
        if (!dateTimeString) {
          return '';
        }
        const date = new Date(dateTimeString);
        if (isNaN(date)) {
            return ''; //유효하지 않은 날짜
        }
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    function searchWordChange(event) {
        setSearchWord(event.target.value);
    }

    function renderPagination() {
        const pageNumbers = [];
        for (let i = 0; i < totalPages; i++) {
            pageNumbers.push(
                <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
                    <a className="page-link" onClick={() => getBoardPage(i)}>{i + 1}</a>
                </li>
            );
        }

        return (
            <ul className="pagination">
                <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                    <a className="page-link" onClick={() => getBoardPage(currentPage - 1)}>Previous</a>
                </li>
                {pageNumbers}
                <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
                    <a className="page-link" onClick={() => getBoardPage(currentPage + 1)}>Next</a>
                </li>
            </ul>
        );
    }

    return (
        <div className="board-container">
             {/* 카테고리 선택 메뉴 */}
            <div className="category-buttons">
                <Link to="?category=EVENT" className={`category-button ${activeCategory === 'EVENT' ? 'active' : ''}`}>EVENT</Link>
                <Link to="?category=INQUIRY" className={`category-button ${activeCategory === 'INQUIRY' ? 'active' : ''}`}>INQUIRY</Link>
                <Link to="?category=NOTICE" className={`category-button ${activeCategory === 'NOTICE' ? 'active' : ''}`}>NOTICE</Link>
                <Link to="?category=FAQ" className={`category-button ${activeCategory === 'FAQ' ? 'active' : ''}`}>FAQ</Link>
            </div>
            {/* 검색 및 상단 버튼 컨테이너 */}
            <div className="top-buttons">
                    <input
                    type="text"
                    placeholder="검색어를 입력하세요"
                    value={searchWord}
                    onChange={searchWordChange}
                    className="search-input"
                    />
                    <button className="btn-search" onClick={() => getBoardPage(0, activeCategory)}>검색</button>
                </div>
            <div className="board-grid">
                {boardData.map((record) => (
                    <Link to={`/boardView/${record.id}`} key={record.id} className="board-item">
                        {/* 썸네일 */}
                        {record.files && record.files.length > 0 && (
                            <div className="board-thumbnail">
                                <img src={`http://localhost:9977${record.files[0].fileUrl}`} alt="썸네일" />
                            </div>
                        )}

                        {/* 제목 */}
                        <h3 className="board-title">{record.subject}</h3>

                        {/* 이벤트 기간 */}
                        <p className="board-event-period">
                            {formatDateTime(record.createDate)} ~ {formatDateTime(record.modifiedDate)}
                        </p>

                        {/* 등록일 */}
                        <p className="board-register-date">
                            등록일: {formatDateTime(record.createDate)}
                        </p>
                    </Link>
                ))}
            </div>

            {sessionStorage.getItem("loginId") === 'admin1234' && (
                <div style={{ textAlign: 'right', marginTop: '20px' }}>
                     <Link to="/boardwrite?category=INQUIRY" className="btn-write">글쓰기</Link>
                </div>
            )}
            {renderPagination()}
        </div>
    );
}

export default InquiryPage;