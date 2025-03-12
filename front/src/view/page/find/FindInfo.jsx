import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

function FindInfo() {
    const loc = useLocation();
    const mount = useRef(true);
    const [info, setInfo] = useState({});

    useEffect(()=>{
        if (!mount.current) {}
        else {
            mount.current = false;
            getInfo();
        }
    }, []);


    const getInfo = ()=> {
        axios.post(`http://localhost:9977/find/findInfo`, {id: loc.state.id})
        .then(res=>{
            console.log(res.data);
            setInfo({
                id: res.data.id,
                rstrName: res.data.name,
                rstrLoc: res.data.location
            })
            window.scrollTo({top:0,left:0,behavior:'smooth'});
        })
        .catch(err=>{
            console.log(err);
        });
    }

    return (
        <div className='info'>
            <h1>{info.rstrName}</h1>
            <div className='rPhoto'>사진 (슬라이드)</div>
            <div className='rLocation'>
                상세주소: {info.rstrLoc}<br/>
                <div>지도 표시할 div</div>
            </div>
            <div className='rate'>
                리뷰 (list로 출력)<br/>
                ★★★★☆
                리뷰내용: 클릭시 리뷰 상세 모달(사진, 내용, 작성자 아이디, 날짜)
            </div>
        </div>
    )
}

export default FindInfo;