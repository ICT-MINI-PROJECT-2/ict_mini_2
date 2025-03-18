import { useEffect, useRef,useState } from "react";
import axios from 'axios';
function ReviewModal({reviewModal, setReviewModal}){
    const mount = useRef(true);
    const [review, setReview] = useState({});
    const [img_list,setImg_list] = useState([]);
    useEffect(()=>{
        if(!mount.current) mount.current = false;
        else {
            axios.get('http://localhost:9977/review/selectReview?id='+reviewModal.selected)
            .then(res =>{
                setReview(res.data.review);
                setImg_list(res.data.img_list);
            })
            .catch(err => {
                console.log(err);
            })
            let modal=document.getElementById("review-modal");

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
                    setReviewModal({...reviewModal, isOpen:false});
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

    const delReview = () => {
        setReviewModal({...reviewModal, isOpen:false});
        axios.get('http://localhost:9977/review/deleteReview?id='+review.id)
        .then(res => {
            window.location.reload(true);
        })
        .catch(err => console.log(err))
    }

    return(<div id='review-modal'>
        <div id="review-modal-exit" onClick={()=>setReviewModal({...reviewModal, isOpen:false})}>X</div>
        { review.restaurant !==undefined &&
        <div className='review-modal-box'>
            <div id='review-modal-title'>{review.restaurant.name}</div>
            <div id='review-modal-star'>
            <span className='star-rating'>
            <span style ={{width:`${review.rating*20}%`}}></span>
            </span> {review.rating}
            </div>
            <span id='review-modal-who'>{review.user.username} / {review.writedate}</span><br/>
            <span id='review-modal-cat'>{review.restaurant.categoryOne} / {review.restaurant.location}</span><br/>
            <span id='review-modal-comment'>{review.comment}</span><br/>
            {
                img_list.map((item) => {
                    return(<img id='review-modal-img' src={`http://localhost:9977/uploads/review/${item.review.id}/${item.filename}`}/>)
                })
            }
            <br/>
            { (sessionStorage.getItem('id') == review.user.id) && <span id='review-del-button' onClick={()=> delReview()}>삭제</span>}
        </div>
        }
    </div>);
}

export default ReviewModal;