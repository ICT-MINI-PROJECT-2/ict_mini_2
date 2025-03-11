import { Link } from "react-router-dom";

function FindListItem({restaurant}) {

    return (
        <Link to={'/findInfo'} state={{
            id: restaurant.id
        }}>
            <div className="find-list-item">
                <div className="list-item-img"></div>
                <div>
                    <div>{restaurant.name}</div>
                    <div>{restaurant.location}</div>
                </div>
            </div>
        </Link>
    )
}

export default FindListItem;