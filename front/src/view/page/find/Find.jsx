import {useEffect, useState, useRef} from 'react';

import '../../../css/page/find/find.css';
import Faded from '../../../effect/Faded';
import plusImg from '../../../img/plus.png';
import searchImg from '../../../img/search.png';
import FindListItem from './FindListItem';
import axios from 'axios';

function Find(){
    let [list, setList] = useState([]);

    useEffect(() => {
        window.scrollTo({top:450,left:0,behavior:'smooth'});
    },[list])

    async function searchList() {
        axios.get('http://localhost:9977/find/searchList')
        .then(function(response){
            setList(response.data);
        })
        .catch(function(error){
            console.log(error);
        });
    }
    
    const mount = useRef(true);

    const [area,setArea] = useState(['성동구','강남구','냠냠구','구구구','어어구','칠칠구']);
    const [category,setCategory] = useState(['한식','양식','일식','중식']);
    const [detailCategory,setDetailCategory] = useState([['찌개','족발'],['스테이크','파스타'],['초밥','덮밥'],['중화요리','사천요리']]);
    const [dc, setDc] = useState([]);
    const [tag, setTag] = useState('');

    useEffect(()=>{
        if(!mount.current) mount.current = false;
        else {
            let modal=document.getElementById("find-modal");

            let clicked=0;
            let f_x=0;
            let f_y=0;
            
            let m_x=0;
            let m_y=0;
            
            let c_x=0;
            let c_y=0;
            
            let cnt=0;
            if(modal)
                modal.addEventListener("mousedown", (e) =>{
                    if(clicked==0) {
                        c_x=getNumberFromPixel(modal.style.left);
                        c_y=getNumberFromPixel(modal.style.top);
                        modal.style.cursor="grabbing";
                        clicked=1;
                    }
                    setTimeout(function moveModal(){
                        modal.style.left=c_x+m_x-f_x+'px';
                        modal.style.top=c_y+m_y-f_y+'px';
                        c_x=getNumberFromPixel(modal.style.left);
                        c_y=getNumberFromPixel(modal.style.top);
                        f_x=m_x;
                        f_y=m_y;
                        setTimeout(moveModal,10);
                        cnt++;
                    },10);
                    window.addEventListener("mouseup", (e) =>{
                        cnt=0;
                        clicked=0;
                        modal.style.cursor="grab";
                    });
                    window.addEventListener("mousemove",(e)=>{
                        if(clicked==1) {
                            m_x=e.clientX;
                            m_y=e.clientY;
                            if(cnt<1000000) {
                                cnt=1000000;
                                f_x=e.clientX;
                                f_y=e.clientY;
                            }
                        }
                    });
                });
        }
    },[]);

    document.addEventListener('keydown', function(event) {
        if (event.keyCode == 27) {
            closeModal();
        }
    });

    function getNumberFromPixel(_px) {
        if (_px == null || _px == "") {
            return 0;
        }
       
        _px = _px + "";
       
        if (_px.indexOf("px") > -1) {
            _px = _px.replace("px", "");
        }
       
        if (_px.indexOf("PX") > -1) {
            _px = _px.replace("PX", "");
        }
       
        var result = parseInt(_px, 10);
        if ((result + "") == "NaN") {
            return 0;
        }
       
        return result;
    }

    const openModal = () => {
        let modal=document.getElementById("find-modal");
        modal.style.opacity=1;
	    modal.style.zIndex=5;
        modal.style.left=(window.innerWidth-modal.offsetWidth)/2 + 'px';
	    modal.style.top=window.innerHeight/4+'px';
    }

    const closeModal = () => {
        let modal=document.getElementById("find-modal");
        modal.style.opacity=0;
	    modal.style.zIndex=-5;
        modal.style.left=(window.innerWidth-modal.offsetWidth)/2 + 'px';
	    modal.style.top=window.innerHeight/4+'px';
    }

    const clickArea = (e) => {
        let item = document.getElementById(e.target.id);
        if(item.value === -1) {
            item.style.fontWeight='bold';
            item.style.color='#b21848';
            item.value = 1;
        } else {
            item.style.fontWeight='400';
            item.style.color='black';
            item.value = -1;
        }
    }

    const clickCategory = (e) => {
        let items = [];
        for(var i=0;i<4;i++) {
            items.push(document.getElementById('category-'+i));
            items[i].style.fontWeight='400';
            items[i].style.color='black';
            items[i].value = -1;
        }
        items[e.target.id.substring(9,10)].style.fontWeight='bold';
        items[e.target.id.substring(9,10)].style.color='#b21848';
        items[e.target.id.substring(9,10)].value = 1;
        setDc(detailCategory[e.target.id.substring(9,10)]);

        if(document.getElementsByName('detailcategory')) {
            document.getElementsByName('detailcategory').forEach((item)=>{
                item.style.fontWeight='400';
                item.style.color='black';
                item.value = -1;
            });
        }
    }

    const clickDetailCategory = (e) => {
        let item = document.getElementById(e.target.id);
        if(item.value === -1) {
            item.style.fontWeight='bold';
            item.style.color='#b21848';
            item.value = 1;
        } else {
            item.style.fontWeight='400';
            item.style.color='black';
            item.value = -1;
        }
    }

    const submitModal = () => {
        let ls = document.getElementsByName('find-input')[0].value;
        let tags='';
        let areas = document.getElementsByName('area');
        let detailcategorys = document.getElementsByName('detailcategory');
        for(var i=0;i<ls.length;i++) if(ls[i] === '#') ls = ls.substring(0,i-1);
        if(areas)
            areas.forEach(item => {
                if(item.value === 1) tags+= ' #' + item.innerHTML;
            });
        if(detailcategorys)
            detailcategorys.forEach(item => {
                if(item.value === 1) tags+= ' #' + item.innerHTML;
            });
        setTag(tags);
        closeModal();
    }
    return(
        <Faded>
            <div id="find-modal">
                <div id="modal-exit" onClick={()=>closeModal()}>X</div>
                <div id="modal-title">상세 검색</div>
                <div id="modal-mini-title">원하시는 카테고리를 선택해주세요</div>
                <div id="modal-list">
                    <ul className='modal-list-title'>
                        <li>지역</li>
                        <li>분류</li>
                        <li>세부 분류</li>
                    </ul>
                    <div className='modal-list-item'>
                        <ul id="list-area">
                            {
                                area.map((item,idx)=> {
                                    return(<li key={idx} value={-1} id={'area-'+idx} name='area' onClick={clickArea}>{item}</li>) }
                                )
                            }
                        </ul>
                        <ul id="list-category">
                            {
                                category.map((item, idx)=> {
                                    return(<li key={idx} value={-1} id={'category-'+idx} onClick={clickCategory}>{item}</li>) }
                                )
                            }
                        </ul>
                        <ul id="list-category">
                            {
                                dc.map((item, idx)=> {
                                    return(<li key={idx} value={-1} id={'detailcategory-'+idx} name='detailcategory' onClick={clickDetailCategory}>{item}</li>) }
                                )
                            }
                        </ul>
                    </div>
                </div>
                <div id="modal-submit" onClick={()=>submitModal()}>카테고리 등록</div>
            </div>
            <div className="find-container">
                <div id="logo"></div>
                <div id="logo-text">KICK EAT</div>
                <div className='find-box'>
                    <div id="plus-btn"><img src={plusImg} width='40' onClick={() => openModal()}/></div>
                    <input type="text" placeholder="검색어를 입력하세요." name="find-input"></input>
                    <div id="hash-tag">{tag}</div>
                    <div id="search-btn" onClick={searchList}><img src={searchImg} width='40'/></div>
                </div>
                <div className='find-list'>
                    {list.map((item, idx)=>{
                        return (
                            <FindListItem key={idx} restaurant={item}/>
                        )
                    })}
                </div>
            </div>
        </Faded>
    )
}

export default Find;