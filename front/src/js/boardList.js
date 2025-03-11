import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

function BoardList(){
    // 백엔드에서 가져온 목록 보관할 변수
    let [boardData, setBoardData] = useState([]); //[{id:3, subject:'aaaa'.....},{}]

    // 페이지 번호를 보관할 변수
    let [pageNumber, setPageNumber] = useState([]); // [1,2,3,4,5]

    //현재 보고 있는 페이지 번호
    let [nowPage, setNowPage] = useState(1);
    //총페이지수
    let[totalPage, setTotalPage] = useState(1);

    //검색어 보관할 변수
    let[searchWord, setSearchWord] = useState('');


    //getBoardList() 함수를 자동으로 1번호출
    const mounted=useRef(false);
        useEffect(()=>{
            if(!mounted.current){
                mounted.current=true;
            }else{
                getBoardList(1);
            }
        },[]);

    

    function getBoardList(page){
        let url = "http://localhost:9977/board/boardList?nowPage=" + page;
        //검색어가 있으면 스프링서버로 검색어 보내기
        if(searchWord!=null && searchWord!=''){
            url += "&searchWord=" + searchWord;
        }

        axios.get(url)
        .then(function(response){
            console.log(response.data);
            // 기존 레코드를 초기화하는 방법
            setBoardData([]);

            // 레코드 목록을 boardData 변수에 저장
            response.data.list.map(function(record){
                setBoardData(prev=>{
                    return [...prev, {id:record.id, 
                                      subject:record.subject, 
                                      username:record.joins.username,
                                      hit:record.hit,
                                      writedate:record.writedate}]
                });
            });
            // console.log(boardData);

            //페이지 번호 처리
            //      startPage       startPage       startPage
            //  1 -> 1,2,3,4,5  2 -> 1,2,3,4,5   3->1,2,3,4,5

            // 기존의 페이지가 보관된 값을 초기화
            setPageNumber([]);
            let pVO = response.data.pVO;
            //              1           1+5
            //              6           6+5
            for(let p=pVO.startPageNum; p<pVO.startPageNum+pVO.onePageCount; p++){
                if(p<=pVO.totalPage){
                    setPageNumber((prev)=>{
                        return [...prev, p]
                    });
                }
            }

            //현재페이지 변경
            setNowPage(pVO.nowPage);
            //총페이지 설정
            setTotalPage(pVO.totalPage);
        })
        .catch(function(error){
            console.log(error);
        });
    }
    function searchWordChange(event){
        setSearchWord(event.target.value);
        console.log(searchWord);
    }
    return(
        <div className="container">
            <h1>게시판 목록</h1>
            {/* 검색 */}
            <div className="row">
                <input type="text"  placeholder="검색어 입력" name="searchWord" style={{width:'200px'}}
                    value={searchWord}
                    onChange={searchWordChange}
                />
                <input type="button"  value="Search" style={{width:'100px'}} onClick={()=>getBoardList(1)}/>
            </div>

            <div className="row" style={{borderBottom:'1px solid #ccc'}}>
                <div className="col-sm-1 p-2">번호</div>
                <div className="col-sm-6 p-2">제목</div>
                <div className="col-sm-1 p-2">작성자</div>
                <div className="col-sm-1 p-2">조회수</div>
                <div className="col-sm-3 p-2">등록일</div>
            </div>
        {
            boardData.map(function(record){
                return(
                        <div className="row" style={{borderBottom:'1px solid #ccc'}}>
                            <div className="col-sm-1 p-2">{record.id}</div>
                            {/*                                      /boardView/23   */}
                            <div className="col-sm-6 p-2"><Link to={`/boardView/${record.id}`}>{record.subject}</Link></div>
                            <div className="col-sm-1 p-2">{record.username}</div>
                            <div className="col-sm-1 p-2">{record.hit}</div>
                            <div className="col-sm-3 p-2">{record.writedate}</div>
                        </div>
                )
            })
        }


            {sessionStorage.getItem("logStatus")=='Y' &&(<p><a href="/boardwrite">글쓰기</a></p>)}
            {/* //페이지처리 */}
            <ul className="pagination">
                {/* 이전페이지 */
                    (function(){
                    if(nowPage>1){
                        return <li className="page-item">
                                <a className="page-link" onClick={()=>getBoardList(nowPage-1)}>Previous</a></li>
                    }
                  })()
                }

                {/* 페이지 번호 */}
                {
                pageNumber.map(function(pg){
                    var activeStyle = 'page-item';
                    if(nowPage==pg)activeStyle = 'page-item active' //현재페이지

                    return <li className={activeStyle}><a className="page-link" onClick={()=>getBoardList(pg)}>{pg}</a></li>
                })}
                

                
                {/* 다음페이지 */
                (function(){
                    //         총페이지수 보다 작을 때 다음이 있다.
                    if(nowPage<totalPage){
                        return <li className="page-item">
                                <a className="page-link" onClick={()=>getBoardList(nowPage+1)}>Next</a></li>
                    }
                  })()
                }
            </ul>
        </div>
    )
}
export default BoardList;