import {Link} from 'react-router-dom';
import '../css/header.css';

function Header() {
    return (
      <ul className="header">
        <li>
            <ul className="header-left">
                
                <li>
                <Link to="/"><div id="logo-img"></div></Link>
                </li>
                <li>
                <Link id="header-logo" to="/">KICK EAT</Link>
                </li>
            </ul>
        </li>
        <li>
            <ul className="header-center">
                <li>
                    <Link to="/about">소개</Link>
                </li>
                <li>
                    <Link to="/find">음식점 찾기</Link>
                </li>
                <li>
                    <Link to="/boardpage">자유게시판</Link>
                </li>
                <li>
                    <Link to="/recommend">맛집 추천</Link>
                </li>
            </ul>
        </li>
        <li>
            <ul className="header-right">
                <li>
                    <Link to="/signup">회원 가입</Link>
                </li>
                <li>
                    <Link to="/login">로그인</Link>
                </li>
            </ul>
        </li>
      </ul>
    );
  }
  
  export default Header;
  