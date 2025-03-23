import { useState, useEffect } from "react";
import Dm from "./Dm";
import Report from './Report';

function Interact2({interact2, setInteract2}){
    const [dm, setDm] = useState(false);
    const [report, setReport] = useState(false);
    useEffect(()=>{
        console.log(interact2.where.pageX);
        console.log(window.innerWidth);
    },[interact2]);
    return(
        <>
        {dm && <Dm interact={interact2} setDm={setDm}/>}
        {report && <Report interact={interact2} setReport={setReport}/>}
        <ul className='interact-container-two' style={{left:interact2.where.pageX-window.innerWidth/3.8, top:interact2.where.pageY-240}}>
            <div id='interact-exit' onClick={()=>setInteract2({...interact2, isOpen:false})}>X</div>
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

export default Interact2;