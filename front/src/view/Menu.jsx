import {useEffect,useState} from 'react';
import {Link} from 'react-router-dom';
import '../css/menu.css';
import MessageBox from './MessageBox';
import MessageView from "./MessageView";

function Menu(){
    const [open, setOpen] = useState(false);
    const [msg_box, setMsg_box] = useState({
        isOpen:false,
        msg_list:[]
    })
    useEffect(()=>{
        let menu_button = document.getElementsByClassName('menu-button')[0];
        let menu_list = document.getElementsByClassName('menu-list')[0];
        if(menu_button && menu_list) {
            menu_button.addEventListener('mouseover', ()=>{
                menu_list.style.right='0%';
                menu_list.style.transform='translateY(-50%) rotateY(0deg)';
                menu_button.style.right='-90px';
                setOpen(true);
            });
            menu_list.addEventListener('mouseover', () =>{
                menu_list.addEventListener('mouseleave', () => {
                    menu_list.style.transform='translateY(-50%) rotateY(-90deg)';
                    menu_button.style.right='-43px';
                    setOpen(false);
                });
            })
        }
    },[]);

    const scrollUp = () => {
        window.scrollTo({top:0,left:0,behavior:'smooth'});
    }

    const logout = () => {
        sessionStorage.clear();
        window.location.href="/";
    }

    return(
        <>
        {msg_box.isOpen && <MessageView msg_box={msg_box} setMsg_box={setMsg_box}/>}
        <div className='menu-bar'>
            <div className='menu-button'>
            <br/><br/>
            &nbsp;&nbsp;―<br/>
            &nbsp;&nbsp;―<br/>
            &nbsp;&nbsp;―
            </div>
            <ul className='menu-list'>
                <div id='menu-title'>메뉴</div>
                <li>
                <Link to="/">메인 페이지</Link>
                </li>
                <li>
                <Link to="/about">소개</Link>
                </li>
                <li>
                <Link to="/find">음식점 찾기</Link>
                </li>
                <li>
                <Link to="/recommend">맛집 추천</Link>
                </li>
                <li>
                <Link to="/BoardPage?category=BOARD">자유게시판</Link>
                </li>
                <li>
                <Link to="/BoardPage">1:1문의</Link>
                </li>
                {sessionStorage.getItem("loginStatus") === 'Y' ? <li>
                    <Link onClick={logout}>로그아웃</Link>
                </li> : <li>
                    <Link to="/login">로그인</Link>
                </li>}
                <div id="up-button" onClick={()=>scrollUp()}>
                    ▲
                </div>
                {sessionStorage.getItem("loginStatus") === 'Y' && <MessageBox msg_box={msg_box} setMsg_box={setMsg_box} open={open}/>} 
            </ul>
        </div>
        </>
    );
}

export default Menu;