import React, { useRef, useEffect } from 'react';
import '../../css/page/about.css';
import Faded from '../../effect/Faded';

import about1 from '../../img/about/about_1.jpg';
import about2 from '../../img/about/about_2.jpg';
import about3 from '../../img/about/about_3.jpg';

function About() {
  const scrollContainer = useRef(null);

  useEffect(() => {
    const handleScroll = (e) => {
      const scrollHeight = window.innerHeight;
      const currentScroll = scrollContainer.current.scrollTop;
      const pageIndex = Math.round(currentScroll / scrollHeight);
      scrollContainer.current.scrollTo({
        top: pageIndex * scrollHeight,
        behavior: 'smooth',
      });
    };

    if (scrollContainer.current) {
      scrollContainer.current.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (scrollContainer.current) {
        scrollContainer.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
    <Faded>
      <div className="about-scroll-container" ref={scrollContainer}>
        <div className="about-page" id="about-page-1">
          <img src={about1} alt="about_1" className="about-image" />
          <div className="text-overlay">
            <p className="slider-text">KickEat은 당신의 미각을 깨워줄 최고의 맛집을 추천합니다.</p>
          </div>
        </div>
        <div className="about-page" id="about-page-2">
          <img src={about2} alt="about_2" className="about-image" />
          <div className="text-overlay">
            <p className="slider-text">숨은 맛의 비법, 정신이 번쩍 드는 맛집을 소개해 드립니다.</p>
          </div>
        </div>
        <div className="about-page" id="about-page-3">
          <img src={about3} alt="about_3" className="about-image" />
          <div className="text-overlay">
            <p className="slider-text">새로운 맛의 발견과 특별한 경험을 원한다면, 지금 바로 KickEat과 함께하세요!</p>
          </div>
        </div>
      </div>
    </Faded>
  );
}

export default About;