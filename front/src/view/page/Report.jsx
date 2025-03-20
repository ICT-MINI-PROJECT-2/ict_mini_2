import { useState } from "react";
import axios from 'axios';

function Report({interact, setReport}){
    const [comment, setComment] = useState('');
    const [noMsg, setNoMsg] = useState(false);
    const changeComment = (e) =>{
        setComment(e.target.value);
    }

    const sendDm = () => {
        if(comment.length === 0) {
            setNoMsg(true);
        }
        else{
            axios.post('http://localhost:9977/tech/sendDm', {
                userFrom:{id:sessionStorage.getItem("id")},
                userTo:{id: interact.selected.id},
                comment:comment,
                state:2
            })
            .then(res =>{
                if(res.data==='ok') {
                    setReport(false);
                }
            })
            .catch(err => console.log(err))
        }
    }

    return (
        <div className='dm-container'>
            <div id='dm-exit' onClick={()=>setReport(false)}>X</div>
            <span>신고하기</span><br/>
            <div style={{fontWeight:'400',textAlign:'left', marginLeft:'13px'}}><span style={{fontSize:'13px', color:'red',marginLeft:'60px'}}>{noMsg && '내용을 입력해주세요'}</span></div>
            <textarea className='dm-textarea' onChange={changeComment} value={comment}/>
            <div id='dm-submit' style={{textAlign:'right', marginRight:'28px'}} onClick={sendDm}>전송</div>
        </div>
    );
}

export default Report;