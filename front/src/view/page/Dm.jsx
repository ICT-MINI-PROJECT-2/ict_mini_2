import { useState } from "react";
import axios from 'axios';
import styled from 'styled-components';

function Dm({ interact, setDm }) {
    const [comment, setComment] = useState('');
    const [noMsg, setNoMsg] = useState(false);

    const changeComment = (e) => {
        setComment(e.target.value);
    }

    const sendDm = () => {
        if (comment.length === 0) {
            setNoMsg(true);
        }
        else {
            axios.post('http://localhost:9977/tech/sendDm', {
                userFrom: { id: sessionStorage.getItem("id") },
                userTo: { id: interact.selected.id },
                comment: comment
            })
                .then(res => {
                    if (res.data === 'ok') {
                        setDm(false);
                    }
                })
                .catch(err => console.log(err))
        }
    }
    const DmButton = styled.div`
    position: relative;
    font-family: "IBM Plex Sans KR", sans-serif;
    height: 26px;
    line-height: 26px;
    padding: 4px 10px;
    border: 2px solid #b21848;
    font-weight: bold;
    font-size: 12px;
    border-radius: 5px;
    cursor: pointer;
    text-align: center;
    width: auto;
    color: #b21848;
    background-color: transparent;
    transition: all 0.3s ease-in-out;
    margin-top:10px;
    font-size:15px;

    &:hover {
        font-weight: bold;
        color:white;
    }

    &:after {
        content: "";
        position: absolute;
        left: 0;
        bottom: 0;
        width: 0%;
        height: 100%;
        border-radius: 1px;
        transition: all 0.3s ease-in-out;
        opacity: 0;
        background-color: #b21848;
        z-index: -1;
    }

    &:hover:after {
        width: 100%;
        opacity: 1;
    }
`;
    return (
        <div className='dm-container' style={{ left: interact.where.pageX + 50, top: interact.where.pageY + 50 }}>
            <div className='dm-exit' onClick={() => setDm(false)}>X</div>
            <div className='dm-header'>쪽지 보내기</div>
            <div className='dm-recipient'>
                <h5 className='dm-recipient-label'>To.</h5>
                <span className='dm-recipient-username'>{interact.selected.username}</span>
                {noMsg && <span className='dm-error'>내용을 입력해주세요</span>}
            </div>
            <textarea className='dm-textarea' onChange={changeComment} value={comment} placeholder="내용을 입력해주세요" />
            <DmButton onClick={sendDm}>전송</DmButton>
        </div>
    );
}

export default Dm;