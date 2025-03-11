import {useState} from 'react';
import '../../css/page/mainpage.css';
import Faded from '../../effect/Faded';
import axios from 'axios';

import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function MainPage(){
    const [tt,setTt] = useState('');
    const test = () =>{
        axios.get('http://localhost:9977/test')
        .then(res => {
            setTt(res.data);
        })
        .catch(err => console.log(err));
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
                <button onClick={test} style={{marginTop:'300px'}}>TEST</button>
                {tt}
            </div>
        </Faded>
    )
}

export default MainPage;