import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function FreeEdit() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    
    const {id} = useParams();
    const navigate = useNavigate();

    function changeTitle(event) {
        setTitle(event.target.value);
    }
    function changeContent(event) {
        setContent(event.target.value);
    }

    const mounted = useRef(false);
    useEffect(()=>{
        if (!mounted.current) {
            mounted.current = true;
            getBoard();
        }
    }, []);

    function getBoard() {
        axios(`http://localhost:9977/free/view/${id}`)
        .then(res=>{
            setTitle(res.data.title);
            setContent(res.data.content);
        })
        .catch(err=>{
            console.log(err);
        });
    }

    function boardSubmit() {
        if (title == '' || title == null) {
            alert("제목을 입력하세요.");
            return false;
        }

        let editData = {
            id: id,
            title: title,
            content: content,
            user: {id: sessionStorage.getItem("id")}
        }

        axios.post('http://localhost:9977/free/editOk', editData)
        .then(res=>{
            if (res.data == 'success') {
                navigate('/boardpage?category=BOARD');
            } else if (res.data == 'fail') {
                alert("게시글이 수정되지 않았습니다.");
            }
        })
        .catch(err=>{
            console.log(err);
        });
    }
    return (
        <div className="free-write">
            <h1>글수정</h1>
            <div>
                <label htmlFor="title">제목</label>
                <input type="text" id="title" placeholder="글제목 입력" name="title"
                    value={title} onChange={changeTitle}
                />
            </div>

            <div>
                <label htmlFor="content">글내용</label>
                <textarea id="content" placeholder="글내용 입력" name="content"
                    value={content} onChange={changeContent}
                ></textarea>
            </div>

            <div id='write-btn' onClick={boardSubmit}>글수정</div>
        </div>  
    );
}

export default FreeEdit;