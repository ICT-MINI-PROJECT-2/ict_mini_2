import {useState , useEffect, useRef} from 'react';
import '../../css/page/mainpage.css';
import Faded from '../../effect/Faded';
import axios from 'axios';

import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function MainPage(){

  const main_mount = useRef(false);

    useEffect(()=>{
      if(main_mount.current){}
      else {
        axios.get('http://localhost:9977/tech/today')
        .then(res => {
          console.log(res.data);
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
                <div className="slider-image-banner" id="slider-img-1">
                    
                </div>
                <div className="slider-image-banner" id="slider-img-2">
                    
                </div>
                <div className="slider-image-banner" id="slider-img-3">
                    
                </div>
                <div className="slider-image-banner" id="slider-img-4">
                    
                </div>
                <div className="slider-image-banner" id="slider-img-5">
                    
                </div>
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