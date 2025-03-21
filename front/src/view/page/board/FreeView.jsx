import { useState, useRef, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function FreeView(){
    const navigate = useNavigate();
    const {id} = useParams();

    const mounted = useRef(false);
    useEffect(()=>{
        if (!mounted.current) {
            mounted.current = true;
            getBoardChoice();
        }
    }, []);

    let [record, setRecord] = useState({});

    function getBoardChoice(){
        let url = `http://localhost:9977/free/view/${id}`;
        if (sessionStorage.getItem("id")) {
            url += '?userNo=' + sessionStorage.getItem("id");
        }
        axios.get(url)
        .then(res=>{
            console.log(res.data);
            setRecord({
                id: res.data.id,
                category: res.data.category,
                userid: res.data.user.userid,
                username: res.data.user.username,
                hit: res.data.hit,
                writedate: res.data.writedate,
                title: res.data.title,
                content: res.data.content
            });
        })
        .catch(err=>{
            console.log(err);
        });
    }

    function boardDel(){
        if (window.confirm("글을 삭제하시겠습니까?")) {
            axios.get(`http://localhost:9977/free/delete/${id}`)
            .then(res=>{
                console.log(res.data);
                if (res.data == 0) {
                    navigate('/boardpage?category=BOARD');
                } else {
                    alert("게시글이 삭제되지 않았습니다.")
                }
            })
            .catch(err=>{
                console.log(err);
            });
        }
    }

    return (
        <div className="view-container">
            <div className="view-box">
                <div className="view-header">
                    <div style={{textAlign: 'left'}}>
                        {record.category === 'notice' && <span id="notice-sticker">공지</span>}
                        {record.title}
                        </div>
                    <div>👤{record.username}</div>
                    <div>댓글수</div>
                    <div>👁 {record.hit}</div>
                </div>
                <div id="view-content">{record.content}</div>

                <div className="view-footer">
                    <div id="view-writedate">작성일: {record.writedate}</div>
                        <div className="view-btn">
                            <div onClick={()=>{navigate('/boardpage?category=BOARD')}}>목록</div>
                    {
                        
                        sessionStorage.getItem("loginId") == record.userid && (
                            <>
                                <div><Link to={`/free/edit/${record.id}`}>수정</Link></div>
                                <div onClick={boardDel}>삭제</div>
                            </>
                        )
                    }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FreeView;