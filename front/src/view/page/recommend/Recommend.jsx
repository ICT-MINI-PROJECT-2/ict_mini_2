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

    const clickMenuImage = (option) => {

        if (option === "left") {

            if (document.getElementById("left-menu-image").style.filter === 'none') {
                document.getElementById("left-menu-image").style.filter = 'blur(5px)';
                document.getElementById("left-menu-image").style.opacity = 0.5;
                var leftDetail = document.getElementById("left-menu-detail");
                leftDetail.innerHTML = "<div>왼쪽 메뉴 세부 정보</div>";
                leftDetail.innerHTML += "<div>상세 정보A</div>";
                leftDetail.innerHTML += "<div>상세 정보B</div>";
                leftDetail.innerHTML += "<div>상세 정보C</div>";
                leftDetail.innerHTML += "<div><button id='left-select-button'>KICK EAT!!</button></div>";
                document.getElementById("left-select-button").addEventListener("click", (event) => {
                    event.stopPropagation();
                    selectMenu("left");
                });
            } else {
                document.getElementById("left-menu-image").style.filter = 'none';
                document.getElementById("left-menu-image").style.opacity = 1;
                document.getElementById("left-menu-detail").innerHTML = "";
            }
        } else if (option === "right") {
            if (document.getElementById("right-menu-image").style.filter === 'none') {
                document.getElementById("right-menu-image").style.filter = 'blur(5px)';
                document.getElementById("right-menu-image").style.opacity = 0.5;
                var rightDetail = document.getElementById("right-menu-detail");
                rightDetail.innerHTML = "오른쪽 메뉴 세부 정보";
                rightDetail.innerHTML += "<div>상세 정보A</div>";
                rightDetail.innerHTML += "<div>상세 정보B</div>";
                rightDetail.innerHTML += "<div>상세 정보C</div>";
                rightDetail.innerHTML += "<div><button id='right-select-button'>KICK EAT!!</button></div>";
                document.getElementById("right-select-button").addEventListener("click", (event) => {
                    event.stopPropagation();
                    selectMenu("right");
                });
            } else {
                document.getElementById("right-menu-image").style.filter = 'none';
                document.getElementById("right-menu-image").style.opacity = 1;
                document.getElementById("right-menu-detail").innerHTML = "";
            }
        }
    }

    const selectMenu = (option) => {
        if (document.getElementById("left-menu-image").style.filter !== 'none') {
            clickMenuImage("left");
        }

        if (document.getElementById("right-menu-image").style.filter !== 'none') {
            clickMenuImage("right");
        }

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

    const clickSelectedMenu = (object) => {
        if (!isListPrinted) {
            if (object.style.filter === 'none' && object.src !== emptyImage) {

                for (var i = 1; i <= 4; i++) {
                    if (document.getElementById("select-menu" + i).querySelector("button")) {
                        document.getElementById("select-menu" + i).querySelector("img").style.opacity = 1;
                        document.getElementById("select-menu" + i).querySelector("img").style.filter = 'none';
                        document.getElementById("select-menu" + i).querySelector("button").remove();
                    }
                }

                object.style.opacity = 0.5;
                object.style.filter = 'blur(5px)';
                const button = document.createElement("button");
                button.textContent = "X";
                button.addEventListener("click", () => {
                    object.style.opacity = 1;
                    object.style.filter = 'none';
                    object.src = emptyImage;
                    object.parentElement.querySelector("button").remove();
                    checkImageAndSort();
                });
                object.parentElement.append(button);
            } else {
                object.style.opacity = 1;
                object.style.filter = 'none';
                if (object.parentElement.querySelector("button")) {
                    object.parentElement.querySelector("button").remove();
                }
            }
        } else {
            var imageNum = object.id.substring(object.id.length - 1);
            if (isMenuSelected[imageNum - 1]) {
                for (let i = 1; i <= 4; i++) {
                    if (i == imageNum) {
                        document.getElementById("select-menu" + i).querySelector("img").style.filter = 'none';
                        setLastestSelectedMenu(selectedMenu[i - 1]);
                    } else {
                        document.getElementById("select-menu" + i).querySelector("img").style.filter = 'grayscale(100%)';
                    }
                }

                refreshResult();
            }
        }
    }

    const checkImageAndSort = () => {
        let imgSrc = [];

        for (var i = 1; i <= 4; i++) {
            if (!document.getElementById("select-menu" + i).querySelector("img").src.includes(emptyImage)) {
                imgSrc.push(document.getElementById("select-menu" + i).querySelector("img").src);
            }
        }

        for (i = 1; i <= 4; i++) {
            if (imgSrc[i - 1] != null) {
                document.getElementById("select-menu" + i).querySelector("img").src = imgSrc[i - 1];
            } else {
                document.getElementById("select-menu" + i).querySelector("img").src = emptyImage;
            }
        }

        setIsMenuSelected((prev) => {
            return prev.map((_, index) => imgSrc[index] !== undefined);
        });
    }

    const showRecommendList = () => {
        if (!document.getElementById("kickEatListButton").style.backgroundImage.includes("disable")) {
            var recommnedContainer = document.getElementsByClassName("recommend-container")[0];

            recommnedContainer = document.getElementsByClassName("recommend-container")[0];
            recommnedContainer.style.transition = 'all 1.5s';
            recommnedContainer.style.paddingTop = '75px';
            recommnedContainer.style.height = '0px';

            var recommendList = document.getElementById("recommend-list");
            recommendList.style.transition = 'height 1.5s';
            if (window.innerWidth > 1920) {
                recommendList.style.height = '576px';
            } else {
                recommendList.style.height = '30vw';
            }

            setTimeout(() => {
                recommendList.style.transition = 'height 0s';
            }, 1500);

            for (let i = 1; i <= 4; i++) {
                if (i == 1) {
                    document.getElementById("select-menu" + i).querySelector("img").style.filter = 'none';
                    document.getElementById("select-menu" + i).querySelector("img").style.opacity = 1;
                    setLastestSelectedMenu(selectedMenu[0]);
                } else {
                    document.getElementById("select-menu" + i).querySelector("img").style.filter = 'grayscale(100%)';
                    document.getElementById("select-menu" + i).querySelector("img").style.opacity = 1;
                }

                if (document.getElementById("select-menu" + i).querySelector("button")) {
                    document.getElementById("select-menu" + i).querySelector("button").remove();
                }
            }

            setIsListPrinted(true);

            setAddr({ address: "서울 중구 필동" });
        }
    }

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

            window.addEventListener('resize', handleResize);
        }
    }, [isListPrinted]);

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

    const [userLoc, setUserLoc] = useState({ lat: 0, longi: 0 });
    const [popup, setPopup] = useState(false);
    const [addr, setAddr] = useState({ addr: '' });
    const handleComplete = (data) => {
        setPopup(!popup);
    }

    useEffect(() => {
        if (addr.address != undefined) {
            // 주소-좌표 변환 객체를 생성합니다
            var geocoder = new kakao.maps.services.Geocoder();

            // 주소로 좌표 검색 후 위치 저장
            geocoder.addressSearch(addr.address, function (result, status) {
                if (status === kakao.maps.services.Status.OK) {
                    console.log(result);
                    console.log(addr);
                }
            });
            reqeustToServer();
        }

    }, [addr]);

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

    function reqeustToServer() {
        // 정규 표현식으로 구 추출
        const regex = /([가-힣]+구)/;

        const trimAddress = addr.address.match(regex) ? addr.address.match(regex)[0] : null;

        axios.post("http://localhost:9977/recommend/list", {
            menuCategory: lastestSelectedMenu,
            address: trimAddress
        })
            .then(function (response) {
                console.log(response.data);
                for (let i = 1; i <= 4; i++) {
                    var categoryName = response.data[i - 1].categoryOne;
                    const imgElement = document.getElementsByClassName("recommendResult")[i - 1].querySelector("img");
                    imgElement.src = '/img/find/' + response.data[i - 1].categoryOne + '.png';
                    const nameElement = document.getElementsByClassName("recommendResult")[i - 1].querySelector(".restaurantName");
                    nameElement.innerHTML = response.data[i - 1].name;
                    const addressElement = document.getElementsByClassName("recommendResult")[i - 1].querySelector(".restaurantAddress");
                    addressElement.innerHTML = response.data[i - 1].location;
                    setRecommendResultId(prev => {
                        const newState = [...prev];
                        newState[i - 1] = response.data[i - 1].id;
                        return newState;
                    });
                }
            })
            .catch(function (error) {
                alert("검색결과가 없습니다...");
                for (let i = 1; i <= 4; i++) {
                    const imgElement = document.getElementsByClassName("recommendResult")[i - 1].querySelector("img");
                    imgElement.src = '/img/recommend/menuCategory/empty_select_menu.png';
                    const nameElement = document.getElementsByClassName("recommendResult")[i - 1].querySelector(".restaurantName");
                    nameElement.innerHTML = "";
                    const addressElement = document.getElementsByClassName("recommendResult")[i - 1].querySelector(".restaurantAddress");
                    addressElement.innerHTML = "KICK EAT";
                }
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
                            <div className="menu-image" id="left-menu-image" style={{ filter: 'none' }} onClick={() => clickMenuImage("left")}>
                                <img src={menuImage.leftImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                            </div>
                            <div className="menu-detail" id="left-menu-detail" onClick={() => clickMenuImage("left")}></div>
                        </div>
                        <div className="right-menu-container" style={{ position: 'relative' }}>
                            <div className="menu-image" id="right-menu-image" style={{ filter: 'none' }} onClick={() => clickMenuImage("right")}>
                                <img src={menuImage.rightImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                            </div>
                            <div className="menu-detail" id="right-menu-detail" onClick={() => clickMenuImage("right")}></div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className='select-menu-container'>
                        <div className='kickEatListText'>나의 KICK EAT 메뉴</div>
                        <div className="select-menu" id="select-menu1" style={{ backgroundImage: '' }}>
                            <img src={emptyImage} id="select-menu-image1" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'none', opacity: '1' }} onClick={(event) => clickSelectedMenu(event.target)} alt="" />
                        </div>
                        <div className="select-menu" id="select-menu2" style={{ backgroundImage: '' }}>
                            <img src={emptyImage} id="select-menu-image2" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'none', opacity: '1' }} onClick={(event) => clickSelectedMenu(event.target)} alt="" />
                        </div>
                        <div className="select-menu" id="select-menu3" style={{ backgroundImage: '' }}>
                            <img src={emptyImage} id="select-menu-image3" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'none', opacity: '1' }} onClick={(event) => clickSelectedMenu(event.target)} alt="" />
                        </div>
                        <div className="select-menu" id="select-menu4" style={{ backgroundImage: '' }}>
                            <img src={emptyImage} id="select-menu-image4" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'none', opacity: '1' }} onClick={(event) => clickSelectedMenu(event.target)} alt="" />
                        </div>
                        <button className='kickEatListButton' id='kickEatListButton' style={{ backgroundImage: `url(${disabledLogo})` }} onClick={showRecommendList}></button>
                    </div>
                </div>
                <div id="recommend-list">
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <div id="locationSearch">
                            <input id="locationSearchBox" type="text" value={addr.address} disabled></input>
                            <button id="locationSearchButton" onClick={handleComplete}>찾기</button>
                            <button id="locationSearchButton" onClick={refreshResult}>갱신</button>

                        </div>
                        {popup && <div style={postBox}>
                            <button title="X" style={postButtonStyle} onClick={() => setPopup(false)}>X</button>
                            <Post addr={addr} setAddr={setAddr} setPopup={setPopup} /></div>}

                    </div>
                    <div style={{ display: 'flex'}}>
                        <div className='find-list' id="find-list" style={{ display: 'flex', flexDirection: 'column', gap: '1px', width: '50%' }}>
                            <div className='recommendResult' onClick={clickRecommendElement}>
                                <img></img>
                                <div>
                                    <div className='restaurantName'></div>
                                    <div className='restaurantAddress'></div>
                                </div>
                            </div>
                            <div className='recommendResult' onClick={clickRecommendElement}>
                                <img></img>
                                <div>
                                    <div className='restaurantName'></div>
                                    <div className='restaurantAddress'></div>
                                </div>
                            </div>
                            <div className='recommendResult' onClick={clickRecommendElement}>
                                <img></img>
                                <div>
                                    <div className='restaurantName'></div>
                                    <div className='restaurantAddress'></div>
                                </div>
                            </div>
                            <div className='recommendResult' onClick={clickRecommendElement}>
                                <img></img>
                                <div>
                                    <div className='restaurantName'></div>
                                    <div className='restaurantAddress'></div>
                                </div>
                            </div>
                        </div>
                        <div id="selectedResultDetail" style={{ width: '50%', borderTop: '1px solid black' }}>
                        {selectedRecommendId !== 0 && <div>MAP</div>}
                        {selectedRecommendId !== 0 && <div onClick={onClickDetail}>▶상세정보</div>}
                        </div>
                    </div>
                </div>
            </div>
        </Faded>
    )
}

export default Recommend;

// 이미 선택된 이미지 클릭했을땐 아무반응 없게
// 카카오맵 길찾기 추가하기