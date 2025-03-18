import { useEffect, useState } from 'react';
import '../../../css/page/recommend/recommend.css';
import Faded from '../../../effect/Faded';
import activatedLogo from '../../../img/kickeat_logo.png';
import disabledLogo from '../../../img/kickeat_logo_disabled.png';
import emptyImage from '../../../img/empty_select_menu.png';

function Recommend() {
    // var menuCategory = ["koreanFood", "japaneseFood", "asianFood", "bar", "buffet", "fastFood", "chineseFood", "westernFood", "flourBasedFood"];
    var menuCategory = ["koreanFood", "japaneseFood", "asianFood", "bar", "buffet"];
    const [menuArr, setMenuArr] = useState(new Array(menuCategory.length).fill([]).map(() => [0, 1, 2, 3, 4]));

    useEffect(() => {
        exceptMenu("koreanFood", 0);
        exceptMenu("koreanFood", 1);
        exceptMenu("koreanFood", 2);
        exceptMenu("koreanFood", 3);
        exceptMenu("koreanFood", 4);
        exceptMenu("japaneseFood", 0);
        exceptMenu("japaneseFood", 1);
        exceptMenu("japaneseFood", 2);
        exceptMenu("japaneseFood", 3);
        exceptMenu("japaneseFood", 4);
        exceptMenu("asianFood", 0);
        exceptMenu("asianFood", 1);
        exceptMenu("asianFood", 2);
        exceptMenu("asianFood", 3);
        exceptMenu("asianFood", 4);
        exceptMenu("buffet", 0);
        exceptMenu("buffet", 1);
        exceptMenu("buffet", 2);
        exceptMenu("buffet", 3);
        exceptMenu("bar", 0);
        exceptMenu("bar", 1);
        exceptMenu("bar", 2);
    }, []);

    useEffect(() => {

    }, [menuArr]);



    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    var randomMenuCategoryNumber = getRamdomNumberRangeCountN(0, menuCategory.length - 1, 2);
    var randomNumber = getRamdomNumberRangeCountN(0, 4, 2);
    function getRamdomNumberRangeCountN(min, max, N) {
        const uniqueNumbers = new Set();
        while (uniqueNumbers.size < N) {
            const randomNumber = Math.floor(Math.random() * (max - min + 1) + min);
            // if (!exceptNumber.includes(randomNumber)) {
            // }
            uniqueNumbers.add(randomNumber);
        }

        return Array.from(uniqueNumbers);
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////



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
        leftImage: '../../../img/recommend/menuCategory/' + menuCategory[randomMenuCategoryNumber[0]] + randomNumber[0] + '.png',
        rightImage: '../../../img/recommend/menuCategory/' + menuCategory[randomMenuCategoryNumber[1]] + randomNumber[1] + '.png'
    });

    const [logoState, setLogoState] = useState(false);
    const [isListPrinted, setIsListPrinted] = useState(false);
    const [isMenuSelected, setIsMenuSelected] = useState([false, false, false, false]);


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

                    setIsMenuSelected((prev) => {
                        const newState = [...prev];
                        newState[i - 1] = true;
                        return newState;
                    })

                    setTimeout(() => {
                        document.getElementById("select-menu" + i).querySelector("img").src = menuImage.leftImage;
                        document.getElementById("select-menu" + i).querySelector("img").style.opacity = 1;
                    }, 750);

                    setTimeout(() => {
                        document.getElementById("select-menu" + i).querySelector("img").style.transition = 'opacity 0s ease-in-out';
                    }, 1500);

                    if (i === 4) {
                        document.getElementById('kickEatListButton').style.backgroundImage = `url(${activatedLogo})`;
                        setLogoState(true);
                    }
                    break;
                } else if (option === 'right') {
                    document.getElementById("select-menu" + i).querySelector("img").style.transition = 'opacity 1s ease-in-out';
                    document.getElementById("select-menu" + i).querySelector("img").style.opacity = 0;

                    setIsMenuSelected((prev) => {
                        const newState = [...prev];
                        newState[i - 1] = true;
                        return newState;
                    })

                    setTimeout(() => {
                        document.getElementById("select-menu" + i).querySelector("img").src = menuImage.rightImage;
                        document.getElementById("select-menu" + i).querySelector("img").style.opacity = 1;
                    }, 750);

                    setTimeout(() => {
                        document.getElementById("select-menu" + i).querySelector("img").style.transition = 'opacity 0s ease-in-out';
                    }, 1500);

                    if (i === 4) {
                        document.getElementById('kickEatListButton').style.backgroundImage = `url(${activatedLogo})`;
                        setLogoState(true);
                    }
                    break;
                }
            }
        }

        setMenuImage((prev) => ({
            // 새로운 메뉴 이미지로 변경
            leftImage: 'https://kr.savorjapan.com/gg/content_image/tn0029_001.jpg',
            rightImage: '/img/recommend/pasta.jpg'
        }));

    }

    const clickSelectedMenu = (object) => {

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
    }

    const checkImageAndSort = () => {
        let imgSrc = [];

        for (var i = 1; i <= 4; i++) {
            if (document.getElementById("select-menu" + i).querySelector("img").src !== emptyImage) {
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

        document.getElementById('kickEatListButton').style.backgroundImage = `url(${disabledLogo})`;
        setLogoState(false);
    }

    const showRecommendList = () => {
        if (logoState) {
            var recommnedContainer = document.getElementsByClassName("recommend-container")[0];
            recommnedContainer.style.transition = 'all 1.5s';
            recommnedContainer.style.paddingTop = '75px';
            recommnedContainer.style.height = '0px';
        }

        // 테스트용 삭제할것
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

        setIsListPrinted(true);
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
                            <img src={emptyImage} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'none', opacity: '1' }} onClick={(event) => clickSelectedMenu(event.target)} alt="" />
                        </div>
                        <div className="select-menu" id="select-menu2" style={{ backgroundImage: '' }}>
                            <img src={emptyImage} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'none', opacity: '1' }} onClick={(event) => clickSelectedMenu(event.target)} alt="" />
                        </div>
                        <div className="select-menu" id="select-menu3" style={{ backgroundImage: '' }}>
                            <img src={emptyImage} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'none', opacity: '1' }} onClick={(event) => clickSelectedMenu(event.target)} alt="" />
                        </div>
                        <div className="select-menu" id="select-menu4" style={{ backgroundImage: '' }}>
                            <img src={emptyImage} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'none', opacity: '1' }} onClick={(event) => clickSelectedMenu(event.target)} alt="" />
                        </div>
                        <button className='kickEatListButton' id='kickEatListButton' style={{ backgroundImage: `url(${disabledLogo})` }} onClick={showRecommendList}></button>
                    </div>
                </div>
                <div id="recommend-list">
                </div>
            </div>
        </Faded>
    )
}

export default Recommend;