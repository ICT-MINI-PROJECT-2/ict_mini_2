import {useState} from 'react';
import axios from 'axios';
function Review(){
    const [data,setData] = useState({});
    const [file,setFile] = useState([]);
    function makeReview(){
        let reviewList = [{name:'hh',contents:'gg'},{name:'hh',contents:'gg'},{name:'hh',contents:'gg'},{name:'hh',contents:'gg'},{name:'hh',contents:'gg'},{name:'hh',contents:'gg'},{name:'hh',contents:'gg'},{name:'hh',contents:'gg'}];
        const listItems = reviewList.map((item, idx) =>
            (
            <li key={'review-' + idx} className="review-chat-box"><div className="container-msg">
                <div className='message-who'>{item.name}</div>
                <div className="message-container">
                  <div className='message-box'>
                    <ul>
                        <li className="message-date">
                            {item.date}
                        </li>
                        <li className="message-text">
                            {item.contents}
                        </li>
                    </ul>
                  </div>
                </div>
              </div></li>
        ));
        return (listItems);
    }
    
    const changeData = (e) => {
        setData(p => {
            return {...p, [e.target.name]:e.target.value}
        })
        console.log(data);
        console.log(file);
    }
    
    const changeFile = (e) => {
        setFile(e.target.files);
    }

    const doSubmit = () => {
        let formData = new FormData();
        formData.append("user", sessionStorage.getItem("id"));
        formData.append("subject",data.subject);
        formData.append("comment",data.comment);
        formData.append("rating",data.rating);
        for(var i=0;i<file.length;i++) {
            formData.append("files",file[i]);
        }
        axios.post('http://192.168.1.146:9977/review/write', formData)
        .then(res => {
            console.log(res.data);
        })
        .then(err=>{console.log(err)});
    }

    return(<div id='review'>
        <div className="review-body">
            <ol>
                {makeReview()}
            </ol>
        </div>
            <div className='review-input-box'>
                제목<input type='text' name='subject' className='review-input-subject' onChange={changeData}/><br/>
                내용<textarea name='comment' className='review-input-content' onChange={changeData}></textarea><br/>
                평점<input type='text' name='rating' className='review-input-rating' onChange={changeData}/><br/>
                사진첨부<input type='file' name='review_files' className='review-input-image' onChange={changeFile} multiple/><br/>
                <button className='review-input-button' onClick={doSubmit}>등록</button>
            </div>
    </div>);
}

export default Review;