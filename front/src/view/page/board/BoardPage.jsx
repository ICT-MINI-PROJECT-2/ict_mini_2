// BoardPage.js
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

function BoardPage() {
    const [boardData, setBoardData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [searchWord, setSearchWord] = useState('');
    const location = useLocation();
    const [activeCategory, setActiveCategory] = useState('EVENT');


    useEffect(() => {
        const category = new URLSearchParams(location.search).get('category') || 'EVENT';
        setActiveCategory(category);
        getBoardPage(0, category);
    }, [location]);

    function getBoardPage(page, category = activeCategory) {
        let url = `http://localhost:9977/board/boardpage?page=${page}&category=${category}`;
        if (searchWord) {
            url += `&searchWord=${searchWord}`;
        }

        axios.get(url)
            .then(function (response) {
                console.log("response.data.list:", response.data.list);
                setBoardData(response.data.list);
                setCurrentPage(response.data.page);
                setTotalPages(response.data.totalPages);

            })
            .catch(function (error) {
                console.log(error);
            });
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
        <div className="container" style={{ width: '60%', paddingTop: '10%', margin: '0 auto', position: 'relative' }}>
            <div className="row" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
                {['EVENT', 'INQUIRY', 'NOTICE', 'FAQ'].map(category => (
                    <div key={category} className={`p-2 ${activeCategory === category ? 'active' : ''}`} style={{ margin: '0 10px', cursor: 'pointer' }}>
                        <Link to={`?category=${category}`} style={{ textDecoration: 'none', color: activeCategory === category ? 'black' : '#ccc', fontWeight: activeCategory === category ? 'bold' : 'normal' }}>
                            {category}
                        </Link>
                    </div>
                ))}
            </div>

            <div className="row" style={{ borderBottom: '1px solid #ccc', display: 'flex', fontWeight: 'bold', justifyContent: 'space-between' }}>
                <div className="col-sm-1 p-2">번호</div>
                <div className="col-sm-4 p-2">제목</div>
                <div className="col-sm-2 p-2">작성자</div>
                <div className="col-sm-2 p-2">조회수</div>
                <div className="col-sm-3 p-2">등록일</div>
            </div>

            {boardData.map((record) => (
                <div className="row" style={{ borderBottom: '1px solid #ccc', display: 'flex', justifyContent: 'space-between' }} key={record.id}>
                    <div className="col-sm-1 p-2"><Link to={`/boardView/${record.id}`}>{record.id}</Link></div>
                    <div className="col-sm-4 p-2">
                        <Link to={`/boardView/${record.id}`}>
                            <img src={record.thumbnail} alt="썸네일" style={{ width: '100px', height: '100px', marginRight: '10px' }} />
                            {record.subject}
                            {/* 파일 목록 (간단하게) */}
                            {record.files && record.files.length > 0 && (
                                <div>
                                    <strong>첨부 파일:</strong>
                                    <ul>
                                        {record.files.map((file) => (
                                            <li key={file.id}>
                                                {/* 파일 이름만 표시,  다운로드 링크 X */}
                                                {/* {file.originalFileName}  */}
                                                {/* 파일 이름 및 다운로드 링크 */}
                                                <a href={file.fileUrl} download={file.originalFileName}>
                                                    {file.originalFileName} ({file.fileSize} bytes)
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </Link>
                    </div>
                    <div className="col-sm-2 p-2">{record.user ? record.user.userid : '알 수 없음'}</div>
                    <div className="col-sm-2 p-2">{record.hit}</div>
                    <div className="col-sm-3 p-2">{record.createDate ? record.createDate.substring(0, 10) : ''}</div>
                </div>
            ))}



            {/* 관리자 확인 수정 */}
            {sessionStorage.getItem("loginId") === 'admin1234' && (<p><Link to="/boardwrite?category=EVENT">글쓰기</Link></p>)}
            {renderPagination()}
        </div>
    );
}

export default BoardPage;