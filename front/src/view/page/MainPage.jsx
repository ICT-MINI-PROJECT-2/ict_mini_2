import {useState , useEffect, useRef} from 'react';
import { Link } from 'react-router-dom';
import '../../css/page/mainpage.css';
import Faded from '../../effect/Faded';
import axios from 'axios';

import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function MainPage(){

  const main_mount = useRef(false);
  const [event_list, setEvent_list] = useState([]);
    useEffect(()=>{
      if(main_mount.current){}
      else {
        axios.get('http://localhost:9977/tech/event')
        .then(res => {
          console.log(res.data);
          let elist = [];
          for(var i=0; i<res.data.length;i++) {
            if(i>=5) break;
            elist.push(res.data[i]);
          }
          setEvent_list(elist);
        })
        .catch(err => console.log(err))
      }
    },[]);

    const setAPI = () =>{
        axios.get('http://localhost:9977/api')
        .then(res => {
          console.log(res.data);
        })
        .catch(err => console.log(err));
    }

    const testCrolling = () => {
      window.location.href="#/test";
    }

    const settings = {
          dots: true,
          infinite: true,
          speed: 500,
          slidesToShow: 1,
          slidesToScroll: 1,
          autoplay: true,
          autoplaySpeed: 5000,
          appendDots: (dots) => (
            <div
              style={{
                width: '100%',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ul> {dots} </ul>
            </div>
          ),
          dotsClass: 'dots_custom'
    };

    const [popReview, setPopReview] = useState({});
    const [popRstr, setPopRstr] = useState([]);
    const [reviewRank, setReviewRank] = useState(0);
    const [rstrRank, setRstrRank] = useState(0);

    // useEffect(()=>{
      
    // }, [popRestaurant])

    useEffect(()=>{
      axios.get('http://localhost:9977/find/getPopRestaurant')
      .then(res=>{
        console.log(res.data);
        setPopRstr(res.data);
      })
      .catch(err=>console.log(err));
    },[])

    useEffect(()=>{
      axios.get('http://localhost:9977/find/getPopReview')
      .then(res=>{
        console.log(res.data);
        setPopReview(res.data);
      })
      .catch(err=>console.log(err));
    },[])

    return (
      <Faded>
        <div className="main-container">
          <div className="main-content-title">
            ▶ <p>KICK!</p> 이벤트
          </div>
    
          <Slider {...settings}>
              {
                event_list.map((item,idx) => {
                  return(
                  <div className="slider-image-banner">
                    <img style={{width:'100%',height:'100%',objectFit:'cover'}}src={`http://localhost:9977/uploads/board/${item.id}/${item.files[0].fileName}`}/>
                    <Link style={{position:'absolute', bottom:'30px',right:'30px', fontSize:'30px', backgroundColor:'white', padding:'0px 10px 0px 10px'}}to={`/events/${item.id}`}>확인하러 가기 ▶</Link>
                    </div>
                  )
                })
              }
            </Slider>
    
          <br /><br /><br /><br /><br /><br />
    
          <div className="main-content-title">
            ▶ <p>먹 KICK!</p> 리스트
          </div>
    
          <div className="main-today">
            <div className="main-today-left">
              <span>인기 리뷰</span>
              <ul>
                <li onClick={() => { setReviewRank(0) }} style={reviewRank == 0 ? {color: '#b21848', fontWeight: 'bold'} : {}}>1</li>
                <li onClick={() => { setReviewRank(1) }} style={reviewRank == 1 ? {color: '#b21848', fontWeight: 'bold'} : {}}>2</li>
                <li onClick={() => { setReviewRank(2) }} style={reviewRank == 2 ? {color: '#b21848', fontWeight: 'bold'} : {}}>3</li>
              </ul>

              {popReview.review_list != undefined && (
                <div>
                  <div style={{position: 'relative'}}>
                    <img
                      id="pop-rev-photo"
                      src={`http://localhost:9977/uploads/review/${popReview.review_list[reviewRank].id}/${popReview.file_list[reviewRank].filename}`}
                    />
                    <img id="medal" src={`./img/main/medal${reviewRank+1}.png`}/>
                  </div>
                  <div>
                    <span style={{fontWeight: 'bold'}}>{popReview.review_list[reviewRank].comment}</span><br/>
                    <span className="star-rating">
                        <span
                          style={{
                            width: `${popReview.review_list[reviewRank].rating * 20}%`,
                            float: "left",
                          }}
                        ></span>
                      </span>
                      <span style={{padding: '0 10px', position: 'relative'}}>
                        <h5 style={{display:'inline', fontSize: '20px', fontWeight: '100'}}>👁</h5>
                        <span>{popReview.review_list[reviewRank].hit}</span>
                      </span>
                  </div>

                </div>
              )}
              
            </div>
    
            <div className="main-today-right">
              <span>인기 맛집</span>
              <ul>
                <li onClick={() => { setRstrRank(0) }} style={rstrRank == 0 ? {color: '#b21848', fontWeight: 'bold'} : {}}>1</li>
                <li onClick={() => { setRstrRank(1) }} style={rstrRank == 1 ? {color: '#b21848', fontWeight: 'bold'} : {}}>2</li>
                <li onClick={() => { setRstrRank(2) }} style={rstrRank == 2 ? {color: '#b21848', fontWeight: 'bold'} : {}}>3</li>
              </ul>

              {popRstr[rstrRank] && (
                <Link to={'/findInfo'} state={{ id: popRstr[rstrRank].id }}>
                  <>
                    <div style={{position: 'relative'}}>
                      <img
                        id="pop-res-photo"
                        src={`http://localhost:9977/uploads/review/${popRstr[rstrRank].review_file.review.id}/${popRstr[rstrRank].review_file.filename}`}
                      />
                      <img id="medal" src={`./img/main/medal${rstrRank+1}.png`}/>
                    </div>
                    <div style={{fontWeight: 'bold'}}>{popRstr[rstrRank].rname}</div>
                    <div id="pop-res-detail">
                      <span className="star-rating">
                        <span
                          style={{
                            width: `${popRstr[rstrRank].rating * 20}%`,
                            float: "left",
                          }}
                        ></span>
                      </span>
                      <span style={{padding: '0 10px'}}>{popRstr[rstrRank].review_count}명</span>
                      <span style={{padding: '0 10px', position: 'relative'}}>
                        <h5 style={{display:'inline', fontSize: '20px', fontWeight: '100'}}>👁</h5>
                        <span>{popRstr[rstrRank].hit}</span>
                      </span>
                    </div>
                  </>
                </Link>
              )}
            </div>
          </div>
    
          <button onClick={setAPI} style={{ display: 'none', marginTop: '300px' }}>
            절대 클릭 [X] api테스트용
          </button>
          <button onClick={testCrolling} style={{ display: 'none', marginTop: '100px' }}>
            크롤링 테스트용
          </button>
        </div>
      </Faded>
    );
    
}

export default MainPage;