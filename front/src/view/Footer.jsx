// footer.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import '../css/footer.css';
import kakaoIcon from '../img/footer_kakao.png';
import instaIcon from '../img/footer_insta.png';
import facebookIcon from '../img/footer_facebook.png';

function Footer({ loginStatus, contextPath }) {
    if (loginStatus === 'A') {
        return null;
    }

    return (
        <ul className="footer">
            <li className="footer-left">
                <ul>
                <li>
                        <Link to="/privacy-policy">Privacy Policy</Link>
                    </li>
                    <li>
                        <Link to="/terms-of-use">Site Terms of Use</Link>
                    </li>            
                </ul>
            </li>
            <li className="footer-center">
                <p>
                    e-mail.
                    <a href="mailto:kickeat@gmail.com">kickeat@gmail.com</a>
                    <br/>  
                    Tel.
                    <a href="tel:010-0000-0000">010-0000-0000</a>
                </p>
                <div className="image-container"> {/* 이미지 컨테이너 추가 */}
                    <a href="https://www.kakao.com" target="_blank" rel="noopener noreferrer">
                        <img src={kakaoIcon} alt="Kakao" />
                    </a>
                    <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                        <img src={instaIcon} alt="Instagram" />
                    </a>
                    <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                        <img src={facebookIcon} alt="Facebook" />
                    </a>
                </div>
            </li>
            <li className="footer-right">
                ⓒ 2025 kick Eat Inc.
            </li>
        </ul>
    );
}

export default Footer;