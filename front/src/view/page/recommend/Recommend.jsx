import { act, useEffect, useState } from 'react';
import '../../../css/page/recommend/recommend.css';
import Faded from '../../../effect/Faded';
import activatedLogo from '../../../img/kickeat_logo.png';
import disabledLogo from '../../../img/kickeat_logo_disabled.png';
import emptyImage from '../../../img/empty_select_menu.png';
import Post from '../../user/Post';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const { kakao } = window;


function Recommend() {
    var menuCategory = ["asia", "buffet", "bunsik", "china", "fastfood", "hansik", "japan", "joojeom", "western"];
    const [menuArr, setMenuArr] = useState(new Array(menuCategory.length).fill([]).map(() => [0, 1, 2, 3, 4]));
    const [selectedMenu, setSelectedMenu] = useState([]);
    const [lastestSelectedMenu, setLastestSelectedMenu] = useState("");

    const [left_hover, setLeft_hover] = useState(false);
    const [right_hover, setRight_hover] = useState(false);

    const [rest_info, setRest_info] = useState({
        id:0,
        name:'',
        location:'',
        distance:0,
        rating:0,
        wish:0,
        hit:0,
        category:0,
        review:0
    });
    const [rest_info_two, setRest_info_two] = useState({
        id:0,
        name:'',
        location:'',
        distance:0,
        rating:0,
        wish:0,
        hit:0,
        category:0,
        review:0
    });
    const [rest_info_three, setRest_info_three] = useState({
        id:0,
        name:'',
        location:'',
        distance:0,
        rating:0,
        wish:0,
        hit:0,
        category:0,
        review:0
    });
    const [rest_info_four, setRest_info_four] = useState({
        id:0,
        name:'',
        location:'',
        distance:0,
        rating:0,
        wish:0,
        hit:0,
        category:0,
        review:0
    });

    useEffect(() => {
        axios.get('http://localhost:9977/tech/getUserInfo?id='+sessionStorage.getItem('id'))
        .then(res => {
            console.log(res.data);
            setAddr({ address: res.data.addr });
        })
        .catch(err => console.log(err));
    }, []);

    useEffect(() => {
        var imagePath = '/img/recommend/menuCategory/';
        var imageExt = '.jpg';

        var result = getRandomMenu();

        setMenuImage((prev) => ({
            // 새로운 메뉴 이미지로 변경
            leftImage: imagePath + result[0] + '_' + result[1] + imageExt,
            rightImage: imagePath + result[2] + '_' + result[3] + imageExt
        }));

        console.log(menuArr);
    }, [menuArr]);

    function getRandomMenu() {
        // 중복되지 않는 카테고리 먼저 선택
        const uniqueMenuNumber = new Set();

        while (uniqueMenuNumber.size < 2) {
            const randomNumber = Math.floor(Math.random() * menuCategory.length);
            // 선택된 숫자의 menuArr 배열의 값이 전부 -1이 아닌지 검사
            let minusCount = 0;
            for (let i = 0; i < menuArr[randomNumber].length; i++) {
                if (menuArr[randomNumber][i] == -1) {
                    minusCount++;
                }
            }

            // 전부 -1이 아닌 경우 추가
            if (minusCount != 5) {
                uniqueMenuNumber.add(randomNumber);
            }
        }

        // 결과 배열로 변환
        const uniqueMenuNumberArr = Array.from(uniqueMenuNumber);

        const uniqueNumber = new Array();

        while (uniqueNumber.length < 2) {

            if (uniqueNumber.length == 0) {
                var randomIndex1 = Math.floor(Math.random() * menuArr[uniqueMenuNumberArr[0]].length);
                if (menuArr[uniqueMenuNumberArr[0]][randomIndex1] !== -1) {
                    uniqueNumber.push(randomIndex1);
                }
            }

            if (uniqueNumber.length == 1) {
                var randomIndex2 = Math.floor(Math.random() * menuArr[uniqueMenuNumberArr[1]].length);
                if (menuArr[uniqueMenuNumberArr[1]][randomIndex2] !== -1) {
                    uniqueNumber.push(randomIndex2);
                }
            }
        }

        return [menuCategory[uniqueMenuNumberArr[0]], uniqueNumber[0], menuCategory[uniqueMenuNumberArr[1]], uniqueNumber[1]];
    }

    function exceptMenu(menuCategoryName, menuNumber) {
        var menuCategoryNumber = menuCategory.indexOf(menuCategoryName);

        setMenuArr(prev => {
            const updatedMenuArr = [...prev];
            updatedMenuArr[menuCategoryNumber] = [...prev[menuCategoryNumber]];
            updatedMenuArr[menuCategoryNumber][menuNumber] = -1;

            return updatedMenuArr;
        });
    }

    const [menuImage, setMenuImage] = useState({
        leftImage: null,
        rightImage: null
    });

    const [isListPrinted, setIsListPrinted] = useState(false);
    const [isMenuSelected, setIsMenuSelected] = useState([false, false, false, false]);

    useEffect(() => {
        for (let i = 0; i < isMenuSelected.length; i++) {
            var logo = disabledLogo;
            if (isMenuSelected[i]) {
                logo = activatedLogo;
                break;
            }
        }
        document.getElementById('kickEatListButton').style.backgroundImage = `url(${logo})`;
    }, [isMenuSelected])


    const kickMenu = (option) => {
        console.log(selectedMenu);
        for (let i = 1; i <= 4; i++) {

            if (!isMenuSelected[i - 1]) {
                if (option === 'left') {

                    var fileName = menuImage.leftImage.substring(28, menuImage.leftImage.length - 4);
                    var menuName = fileName.substring(0, fileName.length - 2);
                    var menuNum = fileName.substring(fileName.length - 1);

                    exceptMenu(menuName, menuNum);

                    break;
                } else if (option === 'right') {

                    var fileName = menuImage.rightImage.substring(28, menuImage.rightImage.length - 4);
                    var menuName = fileName.substring(0, fileName.length - 2);
                    var menuNum = fileName.substring(fileName.length - 1);

                    exceptMenu(menuName, menuNum);

                    break;
                }
            }
        }
    }
    const selectMenu = (option) => {
        for (let i = 1; i <= 4; i++) {

            if (!isMenuSelected[i - 1]) {
                if (option === 'left') {
                    document.getElementById("select-menu" + i).querySelector("img").style.transition = 'opacity 1s ease-in-out';
                    document.getElementById("select-menu" + i).querySelector("img").style.opacity = 0;

                    var fileName = menuImage.leftImage.substring(28, menuImage.leftImage.length - 4);
                    var menuName = fileName.substring(0, fileName.length - 2);
                    var menuNum = fileName.substring(fileName.length - 1);

                    exceptMenu(menuName, menuNum);

                    setIsMenuSelected((prev) => {
                        const newState = [...prev];
                        newState[i - 1] = true;
                        return newState;
                    });

                    setSelectedMenu((prev) => {
                        const newState = [...prev];
                        newState[i - 1] = menuName;
                        return newState;
                    });

                    setTimeout(() => {
                        document.getElementById("select-menu" + i).querySelector("img").src = menuImage.leftImage;
                        document.getElementById("select-menu" + i).querySelector("img").style.opacity = 1;
                    }, 750);

                    setTimeout(() => {
                        document.getElementById("select-menu" + i).querySelector("img").style.transition = 'opacity 0s ease-in-out';
                    }, 1500);
                    break;
                } else if (option === 'right') {
                    document.getElementById("select-menu" + i).querySelector("img").style.transition = 'opacity 1s ease-in-out';
                    document.getElementById("select-menu" + i).querySelector("img").style.opacity = 0;

                    var fileName = menuImage.rightImage.substring(28, menuImage.rightImage.length - 4);
                    var menuName = fileName.substring(0, fileName.length - 2);
                    var menuNum = fileName.substring(fileName.length - 1);

                    exceptMenu(menuName, menuNum);

                    setIsMenuSelected((prev) => {
                        const newState = [...prev];
                        newState[i - 1] = true;
                        return newState;
                    })

                    setSelectedMenu((prev) => {
                        const newState = [...prev];
                        newState[i - 1] = menuName;
                        return newState;
                    });

                    setTimeout(() => {
                        document.getElementById("select-menu" + i).querySelector("img").src = menuImage.rightImage;
                        document.getElementById("select-menu" + i).querySelector("img").style.opacity = 1;
                    }, 750);

                    setTimeout(() => {
                        document.getElementById("select-menu" + i).querySelector("img").style.transition = 'opacity 0s ease-in-out';
                    }, 1500);
                    break;
                }
            }
        }

        var imagePath = '/img/recommend/menuCategory/';
        var imageExt = '.png';

        var result = getRandomMenu();

        setMenuImage((prev) => ({
            // 새로운 메뉴 이미지로 변경
            leftImage: imagePath + result[0] + result[1] + imageExt,
            rightImage: imagePath + result[2] + result[3] + imageExt
        }));
    }

    const showRecommendList = () => {
        if (!document.getElementById("kickEatListButton").style.backgroundImage.includes("disable")) {
            var recommnedContainer = document.getElementsByClassName("recommend-container")[0];
            let menuCon = document.getElementsByClassName('menu-container')[0];
            menuCon.style.transition='all 2s';
            menuCon.style.transform='translateY(-700px)';
            recommnedContainer = document.getElementsByClassName("recommend-container")[0];
            recommnedContainer.style.transition = 'all 1.5s';
            recommnedContainer.style.paddingTop = '75px';
            recommnedContainer.style.height = '0px';


            for (let i = 1; i <= 4; i++) {
                if (i == 1) {
                    setLastestSelectedMenu(selectedMenu[0]);
                } 
                if (document.getElementById("select-menu" + i).querySelector("button")) {
                    document.getElementById("select-menu" + i).querySelector("button").remove();
                }
            }
            setIsListPrinted(true);
        }
    }

    /*
    useEffect(() => {
        if (isListPrinted) {
            const handleResize = () => {
                console.log(isListPrinted);
                if (isListPrinted) {
                    var recommendList = document.getElementById("recommend-list");
                    if (window.innerWidth > 1920) {
                        recommendList.style.height = '576px';
                    } else {
                        recommendList.style.height = '30vw';
                    }
                }
            };

        }
    }, [isListPrinted]);
    */

    const postButtonStyle = {
        position: 'absolute',
        top: '8px',
        right: '8px',
        width: '30px',
        height: '30px',
        fontSize: '20px'
    }

    const postBox = {
        backgroundColor: 'white',
        width: '800px',
        height: '450px',
        position: 'fixed',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%,-30%)',
        border: '2px solid black',
        borderRadius: '5px'
    }

    const [popup, setPopup] = useState(false);
    const [addr, setAddr] = useState({ addr: '' });
    const handleComplete = (data) => {
        setPopup(!popup);
    }
    const calcDist = (addrs) => {
        let dists=0;
        var geocoder = new kakao.maps.services.Geocoder();

        if(addr.address != undefined)
        geocoder.addressSearch(addrs, function(result, status) {

            if (status === kakao.maps.services.Status.OK) {
                geocoder.addressSearch(addr.address , (ress, stat) => {
                    if(ress) {
                        let x = ress[0].road_address.x;
                        let y = ress[0].road_address.y;
                        let ax = result[0].x;
                        let ay = result[0].y;
                        dists = getDistanceFromLatLonInKm(x,y,ax,ay)*1000;
                        if(dists/1000 > 0) dists = getDistanceFromLatLonInKm(x,y,ax,ay).toFixed(2)+'km';
                        else dists= parseInt(dists)+'m';
                        console.log(dists);
                        return;
                    }
                })
            } 
        });
        return dists;
    }


    // const initialRequest = () => {
    //     // 정규 표현식으로 구 추출
    //     const regex = /([가-힣]+구)/;

    //     const trimAddress = addr.address.match(regex) ? addr.address.match(regex)[0] : null;

    //     axios.post("http://localhost:9977/recommend/list", {
    //         menuCategory: selectedMenu[0],
    //         address: trimAddress
    //     })
    //         .then(function (response) {

    //         })
    //         .catch(function (error) {

    //         });
    // }

    useEffect(() => {
        if (addr.address != undefined) {
            reqeustToServer();
        }
    }, [lastestSelectedMenu]);

    const [recommendResultId, setRecommendResultId] = useState([]);
    const [selectedRecommendId, setSelectedRecommendId] = useState(0);
    const navigate = useNavigate();

    function onClickDetail(){
        navigate('/findInfo',{state: {id: selectedRecommendId}})
    }
    function getDistanceFromLatLonInKm(lat1,lng1,lat2,lng2) {
        function deg2rad(deg) {
            return deg * (Math.PI/180)
        }
        var R = 6371;
        var dLat = deg2rad(lat2-lat1);
        var dLon = deg2rad(lng2-lng1);
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = R * c;
        return d; 
      }
    function reqeustToServer() {
        // 정규 표현식으로 구 추출
        const regex = /([가-힣]+구)/;

        const trimAddress = addr.address.match(regex) ? addr.address.match(regex)[0] : null;

        let x = '';

        for(var i=0; i<selectedMenu.length; i++) x+=selectedMenu[i]+'/';

        axios.get("http://localhost:9977/recommend/list?menuCategory="+x+'&address='+trimAddress)
            .then(function (response) {
                console.log(response.data);
                for (let i = 1; i <= 4; i++) {
                    if(i===1) {
                        setRest_info({distance:calcDist(response.data[i-1].location),name:response.data[i-1].name,
                            category:response.data[i-1].categoryOne, id:response.data[i-1].id, location:response.data[i-1].location
                            ,rating:response.data[i-1].rating, wish:response.data[i-1].wishCount, hit:response.data[i-1].hit, review:response.data[i-1].reviewCount
                        });
                    }
                    if(i===2) {
                        setRest_info_two({distance:calcDist(response.data[i-1].location),name:response.data[i-1].name,
                            category:response.data[i-1].categoryOne, id:response.data[i-1].id, location:response.data[i-1].location
                            ,rating:response.data[i-1].rating, wish:response.data[i-1].wishCount, hit:response.data[i-1].hit, review:response.data[i-1].reviewCount
                        });
                    }
                    if(i===3) {
                        setRest_info_three({distance:calcDist(response.data[i-1].location),name:response.data[i-1].name,
                            category:response.data[i-1].categoryOne, id:response.data[i-1].id, location:response.data[i-1].location
                            ,rating:response.data[i-1].rating, wish:response.data[i-1].wishCount, hit:response.data[i-1].hit, review:response.data[i-1].reviewCount
                        });
                    }
                    if(i===4) {
                        setRest_info_four({distance:calcDist(response.data[i-1].location),name:response.data[i-1].name,
                            category:response.data[i-1].categoryOne, id:response.data[i-1].id, location:response.data[i-1].location
                            ,rating:response.data[i-1].rating, wish:response.data[i-1].wishCount, hit:response.data[i-1].hit, review:response.data[i-1].reviewCount
                        });
                    }
                    /*
                    const imgElement = document.getElementsByClassName("recommendResult")[i - 1].querySelector("img");
                    imgElement.src = '/img/find/' + response.data[i - 1].categoryOne + '.png';
                    const nameElement = document.getElementsByClassName("recommendResult")[i - 1].querySelector(".restaurantName");
                    nameElement.innerHTML = response.data[i - 1].name;
                    const addressElement = document.getElementsByClassName("recommendResult")[i - 1].querySelector(".restaurantAddress");
                    addressElement.innerHTML = response.data[i - 1].location;*/
                    setRecommendResultId(prev => {
                        const newState = [...prev];
                        newState[i - 1] = response.data[i - 1].id;
                        return newState;
                    });
                }
            })
            .catch(function (error) {

            });
    }

    const refreshResult = () => {
        resetResultStyle();
        reqeustToServer();
    }

    const resetResultStyle = () => {
        document.querySelectorAll(".recommendResult").forEach((element) => {
            element.style.backgroundColor = "white";
        });

        setSelectedRecommendId(0);
    }

    const clickRecommendElement = (event) => {
        document.querySelectorAll(".recommendResult").forEach((element) => {
            element.style.backgroundColor = "white";
        });

        const parentElement = event.currentTarget;
        const siblings = parentElement.parentNode.children;
        const index = Array.from(siblings).indexOf(parentElement);
        parentElement.style.backgroundColor = 'lightgray';
        setSelectedRecommendId(recommendResultId[index]);
    }

    return (
        <Faded>
            <div className="top-recommend-container">
                <div className="recommend-container">
                    <div className="menu-container">
                        <div className="left-menu-container" style={{ position: 'relative' }}>
                            <div className="menu-image" id="left-menu-image" onMouseOut={() => setLeft_hover(false) }  onMouseOver={() => setLeft_hover(true)}>
                                <img src={menuImage.leftImage} style={{ width: '100%', height: '100%', objectFit: 'cover',filter: left_hover && 'blur(5px)', transition:'all 0.8s'}} alt="" />
                                { left_hover &&
                                <div className="menu-detail" style={{width:'0',height:'0'}} id="left-menu-detail">
                                    <span className='all-button' id='left-select-button-eat' onClick={()=>selectMenu('left')}>&nbsp;EAT!!&nbsp;</span>
                                <span className='all-button' id='left-select-button-kick' onClick={()=>kickMenu('left')}>KICK!!</span>
                                </div>
                                }
                            </div>
                            <div className="menu-detail" id="left-menu-detail"></div>
                        </div>
                        <div className="right-menu-container" style={{ position: 'relative' }}>
                            <div className="menu-image" id="right-menu-image" onMouseOut={() => setRight_hover(false) } onMouseOver={() => setRight_hover(true)}>
                                <img src={menuImage.rightImage} style={{ width: '100%', height: '100%', objectFit: 'cover',filter: right_hover && 'blur(5px)', transition:'all 0.8s'}} alt="" />
                                { right_hover &&
                                <div className="menu-detail" style={{width:'0',height:'0'}} id="right-menu-detail">
                                <span className='all-button' id='right-select-button-eat' onClick={()=>selectMenu('right')}>&nbsp;EAT!!&nbsp;</span>
                                <span className='all-button' id='right-select-button-kick' onClick={()=>kickMenu('right')}>KICK!!</span>
                                </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className='select-menu-container'>
                        <div className='kickEatListText'>나의 KICK EAT 메뉴</div>
                        <div className="select-menu" id="select-menu1" style={{ backgroundImage: '' }}>
                            <img src={emptyImage} id="select-menu-image1" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'none', opacity: '1' }} alt="" />
                        </div>
                        <div className="select-menu" id="select-menu2" style={{ backgroundImage: '' }}>
                            <img src={emptyImage} id="select-menu-image2" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'none', opacity: '1' }} alt="" />
                        </div>
                        <div className="select-menu" id="select-menu3" style={{ backgroundImage: '' }}>
                            <img src={emptyImage} id="select-menu-image3" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'none', opacity: '1' }} alt="" />
                        </div>
                        <div className="select-menu" id="select-menu4" style={{ backgroundImage: '' }}>
                            <img src={emptyImage} id="select-menu-image4" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'none', opacity: '1' }} alt="" />
                        </div>
                        <button className='kickEatListButton' id='kickEatListButton' style={{ backgroundImage: `url(${disabledLogo})` }} onClick={showRecommendList}></button>
                    </div>
                </div>
                   <div id="recommend-list">
                  { rest_info.category != '' && <div id="locationSearch">
                        <input id="locationSearchBox" type="text" value={addr.address} disabled></input>
                        <button id="locationSearchButton" onClick={handleComplete}>찾기</button>
                        <button id="locationSearchButton" onClick={refreshResult}>갱신</button>
                    </div>}
                    { rest_info.category != '' &&    <div className='find-rec-list' id="find-list">
                        <div className='recommendResult' onClick={onClickDetail}>
                        <img src={`/img/find/${rest_info.category}.png`}/>
                            <div className='restaurantName'>{rest_info.name}</div>
                            <div className='restaurantAddress'>{rest_info.location}</div>
                        </div>
                        <div className='recommendResult' onClick={onClickDetail}>
                            {<img src={`/img/find/${rest_info_two.category}.png`}/>}
                            <div className='restaurantName'>{rest_info_two.name}</div>
                            <div className='restaurantAddress'>{rest_info_two.location}</div>
                        </div>
                        <div className='recommendResult' onClick={onClickDetail}>
                        <img src={`/img/find/${rest_info_three.category}.png`}/>
                            <div className='restaurantName'>{rest_info_three.name}</div>
                            <div className='restaurantAddress'>{rest_info_three.location}</div>
                        </div>
                        <div className='recommendResult' onClick={onClickDetail}>
                            <img src={`/img/find/${rest_info_four.category}.png`}/>
                            <div className='restaurantName'>{rest_info_four.name}</div>
                            <div className='restaurantAddress'>{rest_info_three.location}</div>
                        </div>
                    </div>}
                </div>
            </div>
        </Faded>
    )
}

export default Recommend;

// 이미 선택된 이미지 클릭했을땐 아무반응 없게
// 카카오맵 길찾기 추가하기