import {useEffect} from 'react';
import {Link} from 'react-router-dom';
import '../css/menu.css';

function Menu(){
    useEffect(()=>{
        let menu_button = document.getElementsByClassName('menu-button')[0];
        let menu_list = document.getElementsByClassName('menu-list')[0];
        if(menu_button && menu_list) {
            menu_button.addEventListener('mouseover', ()=>{
                menu_list.style.right='0%';
                menu_list.style.transform='translateY(-50%) rotateY(0deg)';
                menu_button.style.right='-90px';
            });
            menu_list.addEventListener('mouseover', () =>{
                menu_list.addEventListener('mouseleave', () => {
                    menu_list.style.transform='translateY(-50%) rotateY(-90deg)';
                    menu_button.style.right='-43px';
                });
            })
        }
    },[]);
    return(
        <div className='menu-bar'>
            <div className='menu-button'>
            <br/><br/>
            &nbsp;&nbsp;―<br/>
            &nbsp;&nbsp;―<br/>
            &nbsp;&nbsp;―
            </div>
            <ul className='menu-list'>
                <li>
                <Link to="/">홈</Link>
                </li>
                <li>
                <Link to="/about">소개</Link>
                </li>
                <li>
                <Link to="/search">음식점 찾기</Link>
                </li>
                <li>
                <Link to="/">자유게시판</Link>
                </li>
                <li>
                <Link to="/">맛집 추천</Link>
                </li>
            </ul>
        </div>
    );
}

export default Menu;