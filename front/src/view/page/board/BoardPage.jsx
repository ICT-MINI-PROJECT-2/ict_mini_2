import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function BoardPage() {
    const [boardData, setBoardData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [searchWord, setSearchWord] = useState('');

    useEffect(() => {
        getBoardPage(0); // 함수 이름 변경
    }, []);

    function getBoardPage(page) { // 함수 이름 변경
        let url = `http://localhost:9977/board/boardpage?page=${page}`; // URL 변경
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
        <div className="container" style={{position:"absolute"}}>
            <h1>게시판 목록</h1>
            <div className="row">
                <input type="text" placeholder="검색어 입력" name="searchWord" style={{ width: '200px' }}
                    value={searchWord}
                    onChange={searchWordChange}
                />
                <button style={{ width: '100px' }} onClick={() => getBoardPage(0)}>Search</button> {/*함수 호출 변경*/}
            </div>

            <div className="row" style={{ borderBottom: '1px solid #ccc', display: 'flex' }}>
            <div className="col-sm-1 p-2">번호</div>
            <div className="col-sm-6 p-2">제목</div>
            <div className="col-sm-1 p-2">작성자</div>
            <div className="col-sm-1 p-2">조회수</div>
            <div className="col-sm-3 p-2">등록일</div>
          </div>
          {boardData.map((record) => (
            <div className="row" style={{ borderBottom: '1px solid #ccc', display: 'flex' }} key={record.id}>
                    <div className="col-sm-1 p-2"><Link to={`/boardView/${record.id}`}>{record.id}</Link></div>
                    <div className="col-sm-6 p-2"><Link to={`/boardView/${record.id}`}>{record.subject}</Link></div>
                    {/* <div className="col-sm-1 p-2">{record.getUserid()}</div> */}
                    <div className="col-sm-1 p-2"><Link to={`/boardView/${record.id}`}>{record.hit}</Link></div>
                    <div className="col-sm-3 p-2"><Link to={`/boardView/${record.id}`}>{record.createDate.substring(0, 10)}</Link></div>
                </div>
            ))}

            {sessionStorage.getItem("logStatus") === 'Y' && (<p><Link to="/boardwrite">글쓰기</Link></p>)}
            {renderPagination()}
        </div>
    );
}

export default BoardPage;