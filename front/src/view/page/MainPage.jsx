import {useState} from 'react';
import '../../css/page/mainpage.css';
import Faded from '../../effect/Faded';
import axios from 'axios';

function MainPage(){
    const [tt,setTt] = useState('');
    const test = () =>{
        axios.get('http://localhost:9977/test')
        .then(res => {
            setTt(res.data);
        })
        .catch(err => console.log(err));
    }
    return(
        <Faded>
            <div className="main-container">
                <button onClick={test} style={{marginTop:'300px'}}>TEST</button>
                {tt}
            </div>
        </Faded>
    )
}

export default MainPage;