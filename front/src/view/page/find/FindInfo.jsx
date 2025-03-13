import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

const {kakao} = window;

function FindInfo() {
    const loc = useLocation();
    const mount = useRef(true);
    const [info, setInfo] = useState({});
    const [tab, setTab] = useState('home');
    const [menu_list, setMenu_list] = useState([]);
    const [img_list, setImg_list] = useState([]);
    const [info_list, setInfo_list] = useState([]);
    useEffect(()=>{
        if (!mount.current) {}
        else {
            mount.current = false;
            getInfo();
        }
    }, []);
    
    useEffect(()=> {
        if (info.rstrLoc != undefined) {
            var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
                mapOption = {
                    center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
                    level: 3 // 지도의 확대 레벨
                };  
    
            // 지도를 생성합니다    
            var map = new kakao.maps.Map(mapContainer, mapOption); 
    
            var places = new kakao.maps.services.Places();
            
            var cb = (res, stat) => {
                res.forEach(item => {
                    let addr_list = item.address_name.split(' ');
                    let cnt = 0;
                    addr_list.forEach(a => {
                        if(info.rstrLoc.indexOf(a) !== -1) cnt++;
                    })
                    if(cnt >= addr_list.length-1 ) { //검색 점포명의 주소와 일치하는 카카오맵의 검색 결과
                        axios.get('http://localhost:9977/tech/jsoup?place_id='+item.id)
                        .then(res =>{
                            console.log(res.data);
                            setImg_list(res.data.img_list);
                            setMenu_list(res.data.menu_list);
                            setInfo_list(res.data.info_list);
                        }).catch(err=>console.log(err))
                    }
                })
            }
            places.keywordSearch(info.rstrName,cb);

            // 주소-좌표 변환 객체를 생성합니다
            var geocoder = new kakao.maps.services.Geocoder();

            // 주소로 좌표를 검색합니다
            geocoder.addressSearch(info.rstrLoc, function(result, status) {
                console.log(result);
    
                // 정상적으로 검색이 완료됐으면 
                if (status === kakao.maps.services.Status.OK) {
    
                    var coords = new kakao.maps.LatLng(result[0].y, result[0].x);
    
                    // 결과값으로 받은 위치를 마커로 표시합니다
                    var marker = new kakao.maps.Marker({
                        map: map,
                        position: coords
                    });
    
                    // 인포윈도우로 장소에 대한 설명을 표시합니다
                    var infowindow = new kakao.maps.InfoWindow({
                        content: `<div style="width:150px;text-align:center;padding:6px 0;">${info.rstrName}</div>`
                    });
                    infowindow.open(map, marker);
    
                    // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
                    map.setCenter(coords);
                } 
            }); 
        }
    },[info]);


    const getInfo = ()=> {
        axios.post(`http://localhost:9977/find/findInfo`, {id: loc.state.id})
        .then(res=>{
            // console.log(res.data);
            setInfo({
                id: res.data.id,
                rstrName: res.data.name,
                rstrLoc: res.data.location
            })
            window.scrollTo({top:0,left:0,behavior:'smooth'});
        })
        .catch(err=>{
            console.log(err);
        });
    }

    return (
        <div className='info'>
            <h1>{info.rstrName}</h1>
            <div className='rPhoto'>사진 (슬라이드)</div>

            <div className='rInfo'>
                <ul className='info-tab'>
                    <li onClick={()=>setTab("home")}>정보</li>
                    <li onClick={()=>setTab("menu")}>메뉴</li>
                    <li onClick={()=>setTab("photo")}>사진</li>
                    <li onClick={()=>setTab("review")}>리뷰</li>
                </ul>

                <div className='info-view'>
                    {tab === "home" && (
                        <div id="home">
                            상세정보<br/>
                            상세주소: {info.rstrLoc}<br/>
                            영업시간 ...
                        </div>
                    )}
                    {tab === "menu" && (
                        <div id="menu">
                            메뉴정보 (메뉴이름 + 가격)
                        </div>
                    )}
                    {tab === "photo" && (
                        <div id="photo">
                            가게사진
                        </div>
                    )}
                    {tab === "review" && (
                        <div id='review'>
                            리뷰 (list로 출력)<br/>
                            ★★★★☆
                            리뷰내용: 클릭시 리뷰 상세 모달(사진, 내용, 작성자 아이디, 날짜)
                        </div>
                    )}
                </div>
                
            </div>
            
            <div className='rLocation'>
                오시는 길
                <div id='map'></div>
            </div>
            <div className='rate'>
                리뷰 (list로 출력)<br/>
                ★★★★☆
                리뷰내용: 클릭시 리뷰 상세 모달(사진, 내용, 작성자 아이디, 날짜)
            </div>
            <div>
                {
                    img_list.map((item) => {
                        return(<div>
                            <img src={item} width='200'/>
                        </div>);
                    })
                }
            </div>
            <div>
              {
                    menu_list.map((item) => {
                        return(<div>
                            {item}
                        </div>);
                    })
                }
            </div>
            <div>
              {
                    info_list.map((item) => {
                        return(<div>
                            {item}
                        </div>);
                    })
                }
            </div>
        </div>
    )
}

export default FindInfo;