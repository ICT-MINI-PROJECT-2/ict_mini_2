import { useEffect, useState, useRef } from "react";

function ImageModal({imageList, setImageModal, restaurant}) {
    const mount = useRef(true);
        
        useEffect(()=>{
            if(!mount.current) mount.current = false;
            else {
                let modal=document.getElementById("review-image-modal");
    
                modal.style.opacity=1;
                modal.style.zIndex=5;
                modal.style.left=(window.innerWidth-modal.offsetWidth)/2 + 'px';
                modal.style.top=(window.innerHeight-modal.offsetHeight)/2 + 'px';
    
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
                        setImageModal(false);
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

        const zoomImage = (item)=>{
            let zoom = document.getElementById("zoom");
            
            zoom.setAttribute("src", `http://localhost:9977/uploads/review/${item.id}/${item.filename}`);
            zoom.style.display = 'block';
        }

        const imgRender = () => {
            const res = [];
            imageList.forEach((item,idx)=>{
                res.push(
                    <div id="image-box">
                        <img key={idx} src={`http://localhost:9977/uploads/review/${item.id}/${item.filename}`}
                                onClick={()=>{zoomImage(item)}}/>
                        <div>{item.writedate}</div>
                    </div>
                    )
                // if (idx >= 9 * (page - 1) && idx < 9 * page) {
                //     res.push(<img key={idx} src={`http://localhost:9977/uploads/review/${item.id}/${item.filename}`}/>);
                //     res.push(<div>{item.writedate}</div>)
                // }
            })
            
            return res;
        }

        return (
            <div id='review-image-modal'>
                <div>{restaurant.rstrName}</div>
                <div id="review-image-modal-exit" onClick={()=>setImageModal(false)}>×</div>

                <div className='gallery-box'>
                    {imgRender()}
                </div>

                <img id="zoom" onClick={()=>{document.getElementById("zoom").style.display = 'none'}}/>

                {/* <div className='gallery-page-button'>
                    {
                        page > 1 &&
                        <div className='gallery-left-button' onClick={()=> goPage(-1)}>◀</div>
                    }
                    <div className='gallery-page'>{page}</div>
                    {
                        imageList.length > page * 9 &&
                        <div className='gallery-right-button' onClick={()=> goPage(1)}>▶</div>
                    }
                </div> */}
            </div>
        );
}

export default ImageModal;