import { useState, useEffect, useRef } from "react";
import Dm from "./Dm";
import Report from './Report';

function Interact({ interact, setInteract }) {
    const [dm, setDm] = useState(false);
    const [report, setReport] = useState(false);
    const prevInteractRef = useRef(interact);

    useEffect(() => {
        prevInteractRef.current = interact;
    }, [interact]);

    const closePopup = () => {
        setInteract((prevState) => ({ ...prevState, isOpen: false }));
    };

    return (
        <>
            {dm && !report && <Dm interact={interact} setDm={setDm} />}
            {report && !dm && <Report interact={interact} setReport={setReport} />}
            
            {interact.isOpen && (
                <div className="interact-popup" style={{ left: interact.where.pageX, top: interact.where.pageY }}>
                    <div className="interact-exit" onClick={closePopup}>X</div>
                    <ul className="interact-list">
                        <li className="interact-item">정보 보기</li>
                        <li className="interact-item" onClick={() => !report && sessionStorage.getItem("loginStatus") == 'Y' && setDm(true)}>쪽지 보내기</li>
                        <li className="interact-item" onClick={() => !dm && sessionStorage.getItem("loginStatus") == 'Y' && setReport(true)}>신고 하기</li>
                    </ul>
                </div>
            )}
        </>
    );
}

export default Interact;