import { useState } from "react";
import axios from 'axios';

function Dm({interact, setDm}){
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
                comment:comment
            })
            .then(res =>{
                if(res.data==='ok') {
                    setDm(false);
                }
            })
            .catch(err => console.log(err))
        }
    }

    return (
        <div className='dm-container'>
            <div id='dm-exit' onClick={()=>setDm(false)}>X</div>
            <span>쪽지</span><br/>
            <div style={{fontWeight:'400',textAlign:'left', marginLeft:'13px'}}><h5 style={{display:'inline', fontWeight:'600'}}>To.</h5> {interact.selected.username}<span style={{fontSize:'13px', color:'red',marginLeft:'60px'}}>{noMsg && '내용을 입력해주세요'}</span></div>
            <textarea className='dm-textarea' onChange={changeComment} value={comment}/>
            <div id='dm-submit' style={{textAlign:'right', marginRight:'28px'}} onClick={sendDm}>전송</div>
        </div>
    );
}

export default Dm;