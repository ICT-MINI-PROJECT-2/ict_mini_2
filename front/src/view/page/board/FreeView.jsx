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

        axios.get(`http://localhost:9977/free/view/${id}`)
        .then(res=>{
            console.log(res.data);
            setRecord({
                id: res.data.id,
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
                    navigate('/free');
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
            <table className="table">
                <tbody>
                    <tr>
                        <td>글번호</td>
                        <td>{record.id}</td>
                    </tr>
                    <tr>
                        <td>작성자</td>
                        <td>{record.username}</td>
                    </tr>
                    <tr>
                        <td>조회수</td>
                        <td>{record.hit}</td>
                    </tr>
                    <tr>
                        <td>등록일</td>
                        <td>{record.writedate}</td>
                    </tr>
                    <tr>
                        <td>제목</td>
                        <td>{record.title}</td>
                    </tr>
                    <tr>
                        <td>글내용</td>
                        <td>{record.content}</td>
                    </tr>
                </tbody>
            </table>


            {
                sessionStorage.getItem("loginId") == record.userid && (
                    <div>
                        <Link to={`/free/edit/${record.id}`}>수정</Link>
                        <div onClick={boardDel}>삭제</div>
                    </div>
                )
            }
        </div>
    )
}

export default FreeView;