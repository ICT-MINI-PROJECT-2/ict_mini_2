import {useState , useEffect, useRef} from 'react';
import axios from 'axios';

import ReviewModal from './ReviewModal';
import Interact from '../Interact';
function Review({getReview, review_list, restaurant_id, isLogin}){
    const review_mount = useRef(false);
    const dataTransfer = new DataTransfer();

    const [file_id,setFile_id] = useState([]);

    const [isReviewWrite, setIsReviewWrite] = useState(false);

    const [msg, setMsg] = useState('');

    const [reviewModal, setReviewModal] = useState({
        isOpen: false,
        selected:{}
    });

    const [interact, setInteract] = useState({
        isOpen:false,
        selected:0
    });
    
    useEffect(() => {
        axios.get('http://localhost:9977/review/getReviewById?id='+sessionStorage.getItem("id"))
        .then(res => {
            res.data.forEach((item) => {
                if(restaurant_id === item.restaurant.id) {
                    setIsReviewWrite(true); 
                    return;
                }
            });
        })
        .catch(err => {
            
        })
    }, [review_list])

    const handler = {
        init() {
            const fileInput = document.querySelector('#review_files');
            const preview = document.querySelector('#preview');
            fileInput.addEventListener('change', () => { 
                const files = Array.from(fileInput.files);
                let f_id = [];
                files.forEach(file => {
                    f_id.push(file.lastModified);
                    preview.innerHTML += `
                    <p id="`+file.lastModified+`">
                        <span id='r-file-name'>`+file.name+`</span>
                        <span type='button' data-index="`+file.lastModified+`" class='file-remove'>X</span>
                    </p>`;
                    dataTransfer.items.add(file);
                });
                fileInput.files = dataTransfer.files;
                setFile_id(f_id);
            });
        },
        
        removeFile: () => {
            document.addEventListener('click', (e) => {
            if(e.target.className !== 'file-remove') return;
            const removeTargetId = e.target.dataset.index;
            const removeTarget = document.getElementById(removeTargetId);
            const files = document.querySelector('#review_files').files;
            const dataTranster = new DataTransfer();
            let f_id = [];
            Array.from(files)
                .forEach(file => {
                if(file.lastModified == removeTargetId) dataTransfer.items.remove(file);
                else {dataTranster.items.add(file);f_id.push(file.lastModified);}
             });
             setFile_id(f_id);
            document.querySelector('#review_files').files = dataTranster.files;
            if(removeTarget && removeTarget !== undefined)
                removeTarget.remove();

            var curFileCnt = dataTransfer.files.length; //현재 선택된 첨부파일 개수
        })
        }
    }

    useEffect(() => {
        if(review_mount.current) {}
        else {
            review_mount.current = true;
            console.log("review_mounted");
            handler.init();
            handler.removeFile();
        }    
    },[]);

    const clickRating = (event) => {
        let a = document.getElementById('st').getBoundingClientRect().left;
        let x = event.clientX - a;
        for(let i=1; i<11; i++) {
            if(x < i*88/10) {setStarWid(10*i); break;};
        }
    }

    const [starwid, setStarWid] = useState(0);
    const [comment,setComment] = useState('');
    const [file,setFile] = useState([]);
    function makeReview(){
        const listItems = review_list.map((item, idx) =>
            (
            <li key={'review-' + idx} className="review-chat-box"><div className="container-msg">
                <div style={{cursor:'pointer'}} className='message-who'>{interact.isOpen && sessionStorage.getItem("id") != item.entity.id && <Interact interact={interact} setInteract={setInteract}/>}<span onClick={()=>setInteract({selected:item.entity.user, isOpen:true})}>{item.entity.user.username}</span></div>
                <div className="message-container">
                  <div className='message-box' onClick={()=>setReviewModal({isOpen:true, selected:item.entity.id})}>
                    <ul>
                        <li className="message-text">
                            {item.entity.writedate}
                        </li>
                        <li>
                            <span className='star-rating'>
                            <span style ={{width:`${item.entity.rating*20}%`, float:"left"}}></span>
                            </span> {item.entity.rating}
                        </li>
                    </ul>
                    <div className='message-comment'>
                        {item.entity.comment}
                    </div>
                    <img id='review-img' src={`http://localhost:9977/uploads/review/${item.entity.id}/${item.imgList[0].filename}`}/>
                    {/*
                        item.imgList.map((imgs,img_idx) => {
                            return(<img key={'review-img-'+img_idx}width='100' src={`http://localhost:9977/uploads/review/${item.entity.id}/${imgs.filename}`}/>)
                        })*/
                    }
                    
                  </div>
                </div>
              </div></li>
        ));
        return (listItems);
    }
    
    const changeComment = (e) => {
        setComment(e.target.value);
    }
    
    const changeFile = (e) => {
        setFile(e.target.files);
    }

    const doSubmit = () => {
        if(comment.length === 0) {
            setMsg('내용을 작성해주세요');
        } else if(starwid === 0) {
            setMsg('별점을 체크해주세요');
        } else if(file_id.length < 1) {
            setMsg('리뷰 사진을 1개 이상 등록해주세요');
        } else if(file_id.length > 5) {
            setMsg('리뷰 사진을 5개 이하 등록해주세요');
        }
        else {
            setMsg('');
            let formData = new FormData();
            formData.append("user", sessionStorage.getItem("id"));
            formData.append("restaurant",restaurant_id);
            formData.append("comment",comment);
            formData.append("rating",starwid/20);
            for(var i=0;i<file.length;i++) {
                formData.append("files",file[i]);
            }
            
            axios.post('http://localhost:9977/review/write', formData)
            .then(res => {
                getReview();
                setStarWid(0);
                setComment('');
                file_id.forEach((item) => {
                    document.getElementById(item).remove();
                })
                setFile_id([]);
                setFile([]);
                const files = document.querySelector('#review_files').files;
                document.querySelector('#preview').innerHTML='';
                Array.from(files)
                .forEach(file => {
                    dataTransfer.items.remove(file);
                });
            })
            .then(err=>{console.log(err)});
            getReview();
        }
    }

    const doNaN = () => {

    }

    const myReview = () => {
        review_list.forEach(item => {
            if(item.entity.user.id == sessionStorage.getItem('id')) {
                setReviewModal({isOpen:true, selected:item.entity.id});
                return;
            }
        })
    }

    return(
        <div id='review'>
            {reviewModal.isOpen && <ReviewModal reviewModal ={reviewModal} setReviewModal={setReviewModal}/>}
        {
            review_list.length !== 0 ?
            (<div className="review-body">
                <ol>
                    {makeReview()}
                </ol>
            </div>) : <div className='no-review'>등록된 리뷰가 없습니다.</div>
        }
        
            <div className='review-input-box'>
                <div className='input-star'>
                <span id='st'className='star-rating' style ={{float:"left",cursor:'pointer',marginTop:'5px'}} onClick={ isLogin && !isReviewWrite ? clickRating.bind(this):doNaN()}>
                <span style ={{width:starwid+"%", cursor:'pointer'}}></span></span>{starwid/20}
                </div>
                <span className='review-err-msg'>
                    {msg}
                </span>
                <div className='boxes'>
                    { 
                        isLogin ? (
                            isReviewWrite ? (
                                <textarea name='comment' className='review-input-content' value='이미 리뷰를 작성하셨습니다.' disabled/>
                            ) : (
                                <textarea name='comment' className='review-input-content' onChange={changeComment} value={comment}/>
                            )
                        ) : (
                            <textarea name='comment' className='review-input-content' value = { '로그인 후 리뷰 작성이 가능합니다.'} disabled/> 
                        )
                    }
                    <div className='two-button'>
                        { isLogin && !isReviewWrite ?
                        <label className="input-file-button" htmlFor="review_files"/>:
                        <label className="input-file-button" htmlFor=""/>
                        }
                        <input key={'1'} type='file' style={{display:'none'}} id='review_files' name='review_files' className='review-input-image' onChange={changeFile} multiple/>
                        { isLogin && !isReviewWrite ? 
                        <span className='all-button' id='review-submit-button' onClick={doSubmit}>리뷰작성</span>
                        /*<button className='review-input-button' onClick={doSubmit}>리뷰작성</button>*/ :
                        <span className='all-button' id='review-submit-button' onClick={myReview}>리뷰보기</span>
                        }
                    </div>
                </div>
                <div id="preview"></div>
            </div>
    </div>);
}

export default Review;