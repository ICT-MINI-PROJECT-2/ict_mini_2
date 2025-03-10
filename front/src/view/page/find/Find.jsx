import '../../../css/page/find/find.css';
import Faded from '../../../effect/Faded';
import plusImg from '../../../img/plus.png';
import searchImg from '../../../img/search.png';

function Find(){
    return(
        <Faded>
            <div className="find-container">
                <div id="logo"></div>
                <div id="logo-text">KICK EAT</div>
                <div className='find-box'>
                    <div id="plus-btn"><img src={plusImg} width='40'/></div>
                    <input type="text" placeholder="검색어를 입력하세요."/>
                    <div id="search-btn"><img src={searchImg} width='40'/></div>
                </div>
                <div className='find-list'>

                </div>
            </div>
        </Faded>
    )
}

export default Find;