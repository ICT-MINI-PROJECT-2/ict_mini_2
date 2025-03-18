// NoticePage.js
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import './NoticePage.css';


function NoticePage() {
    const [boardData, setBoardData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [searchWord, setSearchWord] = useState('');  // 검색어 상태 추가
    const navigate = useNavigate();
    const location = useLocation();  // 카테고리 정보 받기

    useEffect(() => {
        getBoardPage(0, 'NOTICE'); // 초기 로드 시 NOTICE 게시글 가져오기
    }, []);

    function getBoardPage(page, category) {
      let url = `http://localhost:9977/board/boardPage?page=${page}&category=${category}`;
      if(searchWord){
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
            <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
              <a className="page-link" style={{cursor:'pointer'}} onClick={() => getBoardPage(i, 'NOTICE')}>{i + 1}</a>
            </li>
          );
        }

        return (
            <ul className="pagination">
              <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                <a className="page-link" style={{cursor:'pointer'}} onClick={() => getBoardPage(currentPage - 1, 'NOTICE')}>Previous</a>
              </li>
              {pageNumbers}
              <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
                <a className="page-link" style={{cursor:'pointer'}} onClick={() => getBoardPage(currentPage + 1, 'NOTICE')}>Next</a>
              </li>
            </ul>
        );
    }



    return (
        <div>
            <div className="row" style={{ borderBottom: '1px solid #ccc', display: 'flex', fontWeight: 'bold' }}>
                <div className="col-sm-1 p-2" style={{width: '15.5%'}}>번호</div>
                <div className="col-sm-1 p-2" style={{width: '45.3%'}}>제목</div>
                <div className="col-sm-1 p-2" style={{width: '14.6%'}}>작성자</div>
                <div className="col-sm-1 p-2" style={{width: '14.4%'}}>조회수</div>
                <div className="col-sm-1 p-2">등록일</div>
            </div>

            {boardData.map((record) => (
                <div className="row" style={{ borderBottom: '1px solid #ccc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} key={record.id}>
                    <div className="col-sm-1 p-2"><Link to={`/notice/view/${record.id}`}>{record.id}</Link></div>
                    <div className="col-sm-4 p-2">
                    <Link to={`/notice/view/${record.id}`} style={{ display: 'flex', alignItems: 'center' }}>
                            {record.files && record.files.length > 0 && (
                                <img src={`http://localhost:9977${record.files[0].fileUrl}`} alt="썸네일" style={{ width: '100px', height: '100px', marginRight: '10px' }} />
                            )}
                            <span>{record.subject}</span>
                        </Link>
                    </div>
                    <div className="col-sm-2 p-2">{record.user ? record.user.userid : '알 수 없음'}</div>
                    <div className="col-sm-2 p-2">{record.hit}</div>
                    <div className="col-sm-3 p-2">{record.createDate ? record.createDate.substring(0, 10) : ''}</div>
                </div>
            ))}
            <Link to={'/noticewrite'}></Link>
            {sessionStorage.getItem("loginId") === 'admin1234' && (<p><Link to="/notice/write">글등록</Link></p>)}
            {renderPagination()}
             <div className="input-group mb-3">
                <input type="text" className="form-control" placeholder="검색어를 입력하세요" onChange={searchWordChange} value={searchWord}/>
                <button className="btn btn-outline-secondary" type="button" onClick={() => getBoardPage(0, 'NOTICE')}>검색</button>
                
            </div>
        </div>
    );
}

export default NoticePage;