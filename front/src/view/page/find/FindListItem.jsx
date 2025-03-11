function FindListItem({restaurant}) {

    return (
        <div className="find-list-item">
            <div className="list-item-img"></div>
            <div>
                <div>{restaurant.name}</div>
                <div>{restaurant.location}</div>
            </div>
        </div>
    )
}

export default FindListItem;