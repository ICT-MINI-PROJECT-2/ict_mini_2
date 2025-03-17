import { Link } from "react-router-dom";

function FindListItem({rating_size, restaurant}) {

    const wait = (ms) => {
        return new Promise(res=>setTimeout(res,ms));
    }

    const favorite = async(e)=> {
        e.target.innerText = (e.target.innerText == '♡') ? '♥' : '♡';
        e.target.style.scale = '1.4';
        await wait(500);
        e.target.style.scale = '1.0';
    }

    return (
            <div className="find-list-item" style={{position: 'relative'}}>
                <div id="list-favorite" onClick={favorite}>♡</div>
                <div className="list-item-img"
                    style={{background:`url(${'/img/find/'+restaurant.categoryOne+'.png'}) center / 100%`}}>
                </div>
                <div>
                    <Link to={'/findInfo'} state={{id: restaurant.id}}>
                        <div id="rstr-name">{restaurant.name}</div>
                    </Link>
                    <div>{restaurant.location.substring(6)}</div>
                    <div><span className='star-rating'>
                            <span style ={{width:`${restaurant.rating*20}%`}}></span>
                            </span>&nbsp;{rating_size}명 참여</div>
                    <div>조회수 {restaurant.hit}</div>
                </div>
            </div>
        
    )
}

export default FindListItem;