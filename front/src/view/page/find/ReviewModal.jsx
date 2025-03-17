import { useEffect, useRef } from "react";

function ReviewModal({setReviewModal}){
    const mount = useRef(true);
    
    useEffect(()=>{
        if(!mount.current) mount.current = false;
        else {
            let modal=document.getElementById("review-modal");

            modal.style.opacity=1;
            modal.style.zIndex=5;
            modal.style.left=(window.innerWidth-modal.offsetWidth)/2 + 'px';
            modal.style.top=window.innerHeight/4+'px';

            let clicked=0;
            let f_x=0;
            let f_y=0;
            
            let m_x=0;
            let m_y=0;
            
            let c_x=0;
            let c_y=0;
            
            let cnt=0;

            document.addEventListener('keyup', (e)=>{
                if(e.key ==='Escape') {
                    setReviewModal(false);
                }
            })

            if(modal)
                modal.addEventListener("mousedown", (e) =>{
                    if(clicked==0) {
                        c_x=getNumberFromPixel(modal.style.left);
                        c_y=getNumberFromPixel(modal.style.top);
                        modal.style.cursor="grabbing";
                        clicked=1;
                    }
                    setTimeout(function moveModal(){
                        modal.style.left=c_x+m_x-f_x+'px';
                        modal.style.top=c_y+m_y-f_y+'px';
                        c_x=getNumberFromPixel(modal.style.left);
                        c_y=getNumberFromPixel(modal.style.top);
                        f_x=m_x;
                        f_y=m_y;
                        setTimeout(moveModal,10);
                        cnt++;
                    },10);
                    window.addEventListener("mouseup", (e) =>{
                        cnt=0;
                        clicked=0;
                        modal.style.cursor="grab";
                    });
                    window.addEventListener("mousemove",(e)=>{
                        if(clicked==1) {
                            m_x=e.clientX;
                            m_y=e.clientY;
                            if(cnt<1000000) {
                                cnt=1000000;
                                f_x=e.clientX;
                                f_y=e.clientY;
                            }
                        }
                    });
                });
        }
    },[]);

    function getNumberFromPixel(_px) {
        if (_px === null || _px === "") {
            return 0;
        }
        
        _px = _px + "";
        
        if (_px.indexOf("px") > -1) {
            _px = _px.replace("px", "");
        }
        
        if (_px.indexOf("PX") > -1) {
            _px = _px.replace("PX", "");
        }
        
        var result = parseInt(_px, 10);
        if ((result + "") == "NaN") {
            return 0;
        }
        
        return result;
    }
    return(<div id='review-modal'>
        <div id="review-modal-exit" onClick={()=>setReviewModal(false)}>X</div>
        hi
    </div>);
}

export default ReviewModal;