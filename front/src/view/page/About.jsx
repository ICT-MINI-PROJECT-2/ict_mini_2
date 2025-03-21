import React, { useRef, useEffect, useState } from 'react';
import '../../css/page/about.css';
import Faded from '../../effect/Faded';

import about1 from '../../img/about/about_1.jpg';
import about2 from '../../img/about/about_2.jpg';
import about3 from '../../img/about/about_3.jpg';

function About() {
  const scrollContainer = useRef(null);
  const [activePage, setActivePage] = useState(0);
  let isScrolling = false;

  useEffect(() => {
    const handleScroll = (e) => {
      if (isScrolling) return;
      isScrolling = true;
      const scrollHeight = window.innerHeight;
      let pageIndex = Math.round(scrollContainer.current.scrollTop / scrollHeight);

      const delta = e.deltaY || e.detail || e.wheelDelta;
      if (delta > 0) {
        pageIndex = Math.min(pageIndex + 1, 2);
      } else {
        pageIndex = Math.max(pageIndex - 1, 0);
      }

      setActivePage(pageIndex); 

      scrollContainer.current.scrollTo({
        top: pageIndex * scrollHeight,
        behavior: 'smooth',
      });

      setTimeout(() => {
        isScrolling = false;
      }, 500);
    };

    if (scrollContainer.current) {
      scrollContainer.current.addEventListener('wheel', handleScroll);
    }

    return () => {
      if (scrollContainer.current) {
        scrollContainer.current.removeEventListener('wheel', handleScroll);
      }
    };
  }, []);

  return (
    <Faded>
      <div className="about-scroll-container" ref={scrollContainer}>
        <div className="about-page" id="about-page-1">
          <img src={about1} alt="about_1" className="about-image" />
          <div className="text-overlay">
            <p className={`slider-text ${activePage === 0 ? 'focus-in-expand-fwd' : ''}`}>
              KickEat은 당신의 미각을 깨워줄 최고의 맛집을 추천합니다.<br/>
            </p>
            <p className={`slider-text ${activePage === 0 ? 'focus-in-expand-fwd' : ''}`}>
              당신의 취향과 원하는 조건을 알려주시면 남들이 미처 생각하지 못한 숨은 맛의 비법,<br/>한입 베어 무는 순간 정신이 번쩍 드는 맛집을 소개해 드립니다.
            </p>
          </div>
        </div>
        <div className="about-page" id="about-page-2">
          <img src={about2} alt="about_2" className="about-image" />
          <div className="text-overlay">
            <p className={`slider-text ${activePage === 1 ? 'focus-in-expand-fwd' : ''}`}>
              평범한 식사는 이제 그만! <br/>
            </p>
            <p className={`slider-text ${activePage === 1 ? 'focus-in-expand-fwd' : ''}`}>
              새로운 맛의 발견과 특별한 경험을 원한다면, 지금 바로 KickEat과 함께하세요.<br/>이제껏 몰랐던 미식의 새로운 세계, KickEat과 함께라면 당신의 입맛도 한 단계 업그레이드됩니다!
            </p>
          </div>
        </div>
        {/*<div className="about-page" id="about-page-3">
          <img src={about3} alt="about_3" className="about-image" />
          <div className="text-overlay">
            <p className="slider-text">새로운 맛의 발견과 특별한 경험을 원한다면, 지금 바로 KickEat과 함께하세요!</p>
          </div>
        </div>*/}
      </div>
    </Faded>
  );
}

export default About;
