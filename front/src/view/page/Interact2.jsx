import { useState, useEffect } from "react";
import Dm2 from "./Dm2";
import Report from './Report';

function Interact2({interact2, setInteract2}){
    const [dm, setDm2] = useState(false);
    const [report, setReport] = useState(false);
    const [ddx, setDdx] = useState(0);
    const [ddy, setDdy] = useState(0);
    useEffect(()=>{
        const doc = document.getElementById('whoo');
        
        let x = interact2.where.pageY - interact2.where.target.getBoundingClientRect().top;
        setDdx(interact2.where.target.getBoundingClientRect().top - doc.getBoundingClientRect().top);
    },[interact2]);
    return(
        <>
        {report && <Report interact={interact2} setReport={setReport}/>}
        <ul className='interact-container-two' style={{left:'10px', top:ddx,lineHeight:'24px'}}>
        {dm && <Dm2 interact={interact2} setDm2={setDm2}/>}
            <div id='interact-exit' onClick={()=>setInteract2({...interact2, isOpen:false})}>X</div>
            <li>
                정보 보기
            </li>
            <li onClick={()=> setDm2(true)}>
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