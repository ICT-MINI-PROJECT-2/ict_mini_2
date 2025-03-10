import '../../css/page/search.css';
import Faded from '../../effect/Faded'
function Search(){
    return(
        <Faded>
            <div className="search-container">
                <div id="logo">로고</div>
                <div className='search-box'>
                    <input type="text" placeholder="검색어를 입력하세요."/>
                    <input type="button" value="검색"/>
                </div>
            </div>
        </Faded>
    )
}

export default Search;