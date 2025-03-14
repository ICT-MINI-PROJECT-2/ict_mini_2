import {useState , useEffect, useRef} from 'react';
import axios from 'axios';
function Review({getReview, review_list, restaurant_id}){
    const review_mount = useRef(false);
    const dataTransfer = new DataTransfer();

    const [file_id,setFile_id] = useState([]);

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
            
            removeTarget.remove();

            var curFileCnt = dataTransfer.files.length; //현재 선택된 첨부파일 개수
            console.log(curFileCnt+"!!");
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
                <div className='message-who'>{item.entity.user.username}</div>
                <div className="message-container">
                  <div className='message-box'>
                    <ul>
                        <li className="message-text">
                            {item.entity.writedate}
                        </li>
                        <li>
                            <span className='star-rating'>
                            <span style ={{width:`${item.entity.rating*20}%`}}></span>
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
        let formData = new FormData();
        formData.append("user", sessionStorage.getItem("id"));
        formData.append("restaurant",restaurant_id);
        formData.append("comment",comment);
        formData.append("rating",starwid/20);
        console.log(file);
        for(var i=0;i<file.length;i++) {
            formData.append("files",file[i]);
        }
        
        axios.post('http://192.168.1.146:9977/review/write', formData)
        .then(res => {
            getReview();
            setStarWid(0);
            setComment('');
            file_id.forEach((item) => {
                 console.log(item);
                 document.getElementById(item).remove();
            })
            setFile_id([]);
            setFile([]);
            const files = document.querySelector('#review_files').files;
            Array.from(files)
            .forEach(file => {
                dataTransfer.items.remove(file);
            });
        })
        .then(err=>{console.log(err)});
        getReview();
    }

    return(<div id='review'>
        <div className="review-body">
            <ol>
                {makeReview()}
            </ol>
        </div>
            <div className='review-input-box'>
                <div className='input-star'>
                <span id='st'className='star-rating' style ={{float:"left",cursor:'pointer',marginTop:'5px'}} onClick={clickRating.bind(this)}>
                <span style ={{width:starwid+"%", cursor:'pointer'}}></span></span>{starwid/20}
                </div>
                <div className='boxes'>
                    <textarea name='comment' className='review-input-content' onChange={changeComment} value={comment}></textarea><br/>
                    <div className='two-button'>
                        <label className="input-file-button" htmlFor="review_files"/>
                        <input type='file' style={{display:'none'}} id='review_files' name='review_files' className='review-input-image' onChange={changeFile} multiple/>
                        <button className='review-input-button' onClick={doSubmit}>리뷰작성</button>
                    </div>
                </div>
                <div id="preview"></div>
            </div>
    </div>);
}

export default Review;