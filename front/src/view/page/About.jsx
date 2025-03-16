import '../../css/page/about.css';
import Faded from '../../effect/Faded'
import logo from '../../img/kickeat_logo.png'

function About(){
    return(
        <Faded>
            <div className="about-container">
                <div>
                    <img src={logo}/>
                </div>
                <div>
                    <img src={logo}/>
                </div>
            </div>
        </Faded>
    )
}

export default About;
