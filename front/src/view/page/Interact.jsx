import { useState, useEffect } from "react";
import Dm from "./Dm";
import Report from './Report';

function Interact({interact, setInteract}){
    const [dm, setDm] = useState(false);
    const [report, setReport] = useState(false);
    useEffect(()=>{
    },[interact]);
    return(
        <>
        {dm && <Dm interact={interact} setDm={setDm}/>}
        {report && <Report interact={interact} setReport={setReport}/>}
        <ul className='interact-container' style={{left:interact.where.pageX, top:interact.where.pageY}}>
            <div id='interact-exit' onClick={()=>setInteract({...interact, isOpen:false})}>X</div>
            <li>
                정보 보기
            </li>
            <li onClick={()=> setDm(true)}>
                쪽지 보내기
            </li>
            <li onClick={()=> setReport(true)}>
                신고 하기
            </li>
        </ul>
        </>
    )
}

export default Interact;