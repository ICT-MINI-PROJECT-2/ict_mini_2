import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function FreeWrite() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const loc = useLocation();
    const navigate = useNavigate();

    function changeTitle(event) {
        setTitle(event.target.value);
    }
    function changeContent(event) {
        setContent(event.target.value);
    }

    function boardSubmit() {
        if (title == '' || title == null) {
            alert("제목을 입력하세요.");
            return false;
        }
        if (content == '' || content == null) {
            alert("내용을 입력하세요.");
            return false;
        }

        let writeData = {
            title: title,
            content: content,
            category: loc.state.category,
            user: {id: sessionStorage.getItem("id")}
        }
        console.log(writeData);

        axios.post('http://localhost:9977/free/writeOk', writeData)
        .then(res=>{
            if (res.data == 'success') {
                navigate('/boardpage?category=BOARD');
            } else if (res.data == 'fail') {
                alert("게시글이 등록되지 않았습니다.");
            }
        })
        .catch(err=>{
            console.log(err);
        });
    }
    return (
        <div className="free-write">
            <h2>글쓰기</h2>
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

            <div id='write-btn' onClick={boardSubmit}>글등록</div>
        </div>  
    );
}

export default FreeWrite;