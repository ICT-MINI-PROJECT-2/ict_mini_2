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

    return(
        <Faded>
            <div className="main-container">
            <div className="main-content-title">▶ <p>KICK!</p> 이벤트</div>
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
                <br/><br/><br/><br/><br/><br/>
                <div className="main-content-title">▶ <p>KICK!</p> 오늘의 맛집</div>
              <div className='main-today'>
                  <div className='main-today-left'>
                  <span>인기 리뷰</span>
                  </div>
                  <div className='main-today-right'>
                  <span>인기 맛집</span>
                  </div>
              </div>
            </div>
            <button onClick={setAPI} style={{display:'none',marginTop:'300px'}}>절대 클릭 [X] api테스트용</button>
            <button onClick={testCrolling} style={{display:'none',marginTop:'100px'}}>크롤링 테스트용</button>
        </Faded>
    )
}

export default MainPage;