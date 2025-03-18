// InquiryList.js
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './InquiryList.css'; // CSS 파일 import

function InquiryList() {
    const [boardData, setBoardData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [searchWord, setSearchWord] = useState('');

    useEffect(() => {
        getBoardPage(0, 'INQUIRY');
    }, []);

    function getBoardPage(page, category) {
        let url = `http://localhost:9977/board/boardPage?page=${page}&category=${category}`;
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

    function searchWordChange(event) {
        setSearchWord(event.target.value)
    }

    function renderPagination() {
        const pageNumbers = [];

        for (let i = 0; i < totalPages; i++) {
            pageNumbers.push(
                <li key={i} className={`InquiryList_page-item ${currentPage === i ? 'InquiryList_active' : ''}`}>
                    <a className="InquiryList_page-link" style={{ cursor: 'pointer' }} onClick={() => getBoardPage(i, 'INQUIRY')}>{i + 1}</a>
                </li>
            );
        }

        return (
            <ul className="InquiryList_pagination InquiryList_justify-content-center">
                <li className={`InquiryList_page-item ${currentPage === 0 ? 'InquiryList_disabled' : ''}`}>
                    <a className="InquiryList_page-link" style={{ cursor: 'pointer' }} onClick={() => getBoardPage(currentPage - 1, 'INQUIRY')}>Previous</a>
                </li>
                {pageNumbers}
                <li className={`InquiryList_page-item ${currentPage === totalPages - 1 ? 'InquiryList_disabled' : ''}`}>
                    <a className="InquiryList_page-link" style={{ cursor: 'pointer' }} onClick={() => getBoardPage(currentPage + 1, 'INQUIRY')}>Next</a>
                </li>
            </ul>
        );
    }

    return (
        <div className="InquiryList_container">
            <div className="InquiryList_row InquiryList_header-row">
                <div className="InquiryList_col InquiryList_col-sm-1 InquiryList_p-2" style={{ display: 'none' }}>번호</div>
                <div className="InquiryList_col InquiryList_col-sm-4 InquiryList_p-2 InquiryList_text-center">제목</div>
                <div className="InquiryList_col InquiryList_col-sm-2 InquiryList_p-2 InquiryList_text-center">작성자</div>
                <div className="InquiryList_col InquiryList_col-sm-2 InquiryList_p-2" style={{ display: 'none' }}>조회수</div>
                <div className="InquiryList_col InquiryList_col-sm-3 InquiryList_p-2 InquiryList_text-center">등록일</div>
            </div>

            {boardData.map((record) => (
                <div className="InquiryList_row InquiryList_data-row" key={record.id}>
                    <div className="InquiryList_col InquiryList_col-sm-1 InquiryList_p-2" style={{ display: 'none' }}><Link to={`/inquiry/view/${record.id}`}>{record.id}</Link></div>
                    <div className="InquiryList_col InquiryList_col-sm-4 InquiryList_p-2 InquiryList_text-center">
                        <Link to={`/inquiry/view/${record.id}`} className="InquiryList_title-link">
                            {record.files && record.files.length > 0 && (
                                <img src={`http://localhost:9977${record.files[0].fileUrl}`} alt="썸네일" className="InquiryList_thumbnail" />
                            )}
                            <span>{record.subject}</span>
                        </Link>
                    </div>
                    <div className="InquiryList_col InquiryList_col-sm-2 InquiryList_p-2 InquiryList_text-center">{record.user ? record.user.userid : '알 수 없음'}</div>
                    <div className="InquiryList_col InquiryList_col-sm-2 InquiryList_p-2" style={{ display: 'none' }}>{record.hit}</div>
                    <div className="InquiryList_col InquiryList_col-sm-3 InquiryList_p-2 InquiryList_text-center">{record.createDate ? record.createDate.substring(0, 10) : ''}</div>
                </div>
            ))}

            {/* 글쓰기 버튼 컨테이너 */}
            <div className="InquiryList_write-button-container">
                {sessionStorage.getItem("loginId") && (
                    <Link to="/boardwrite?category=INQUIRY" className="InquiryList_btn InquiryList_btn-primary">글쓰기</Link>
                )}
            </div>

            {renderPagination()}
            <div className="InquiryList_input-group InquiryList_mb-3">
                <input type="text" className="InquiryList_form-control" placeholder="검색어를 입력하세요" onChange={searchWordChange} value={searchWord} />
                <button className="InquiryList_btn InquiryList_btn-outline-secondary" type="button" onClick={() => getBoardPage(0, 'INQUIRY')}>검색</button>
            </div>
        </div>
    );
}

export default InquiryList;