import {Link} from 'react-router-dom';
import '../css/header.css';

function Header() {
    return (
      <ul className="header">
        <li>
            <ul className="header-left">
                
                <li>
                <Link to="/"><div>img</div></Link>
                </li>
                <li>
                <Link to="/">KICK EAT</Link>
                </li>
            </ul>
        </li>
        <li>
            <ul className="header-center">
                <li>
                    <Link to="/about">소개</Link>
                </li>
                <li>
                    <Link to="/">음식점 찾기</Link>
                </li>
                <li>
                    <Link to="/">자유게시판</Link>
                </li>
                <li>
                    <Link to="/">맛집 추천</Link>
                </li>
            </ul>
        </li>
        <li>
            <ul className="header-right">
                <li>
                    <Link to="/">회원 가입</Link>
                </li>
                <li>
                    <Link to="/">로그인</Link>
                </li>
            </ul>
        </li>
      </ul>
    );
  }
  
  export default Header;
  