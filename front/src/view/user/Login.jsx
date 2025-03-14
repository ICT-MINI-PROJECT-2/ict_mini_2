import { useState } from 'react';
import axios from 'axios';
import '../../css/user/login.css';
import Faded from '../../effect/Faded'

function Login(){
    const [data, setData] = useState({});

    const setFormData = (e) => {
        setData(p => {
            return {...p, [e.target.name]:e.target.value}
        })
    }

    document.addEventListener('keydown', function(event) {
        if (event.key == 'Enter') {
            loginChk();
        }
    });

    const doLogin = (dt) => {
        sessionStorage.setItem("loginStatus", "Y");
        sessionStorage.setItem("loginName",dt.username);
        sessionStorage.setItem("loginId",dt.userid);
        sessionStorage.setItem("id", dt.id);

        window.location.href = "/";
    }

    const loginChk = () => {
        var userid = data.userid;
        var userpw = data.userpw;
        var alert_id = document.getElementById("alert-id");
        var alert_pw = document.getElementById("alert-pw");
        alert_id.style.opacity = 0;
        alert_pw.style.opacity = 0;
        
        if(userid==="" || userid===undefined) {
            alert_id.innerHTML = "Please enter your ID";
            alert_id.style.opacity = 1;
        }
        else if(userpw===""||userpw===undefined){
            alert_pw.innerHTML = "Please enter your Password";
            alert_pw.style.opacity = 1;
        }
        else{
            axios.post('http://localhost:9977/user/loginChk', {
                userid:userid,
                userpw:userpw
            }).then(res => {
                if(res.data.id===-1){
                    alert_id.innerHTML = "Invalid ID";
                    alert_id.style.opacity = 1;
                } else if(res.data.id===-2){
                    alert_pw.innerHTML = "Invalid PW";
                    alert_pw.style.opacity = 1;
                } else{
                    doLogin(res.data);
                }		
            })
            .catch(err => console.log(err))
        }
    }

    return(
        <Faded>
            <div className="login-container">
                <div id="login-title">Login</div>
                <form name="loginForm" method="post">
                    <div id="signup-box">
                        <div id="login-left"><div id="idpw">ID</div><div id="hidden-height">I</div></div> <div id="login-right"><input type="text" id="userid" name="userid" onChange={setFormData}/><div id="alert-id">Invalid ID</div></div>
                        <div id="login-left"><div id="idpw">PW</div><div id="hidden-height">I</div></div> <div id="login-right"><input type="password" id="userpw" name="userpw" onChange={setFormData}/><div id="alert-pw">Invalid PW</div></div>
                    </div>
                    <input className="login-submit" type="button" onClick={loginChk} value="Login"/>
                </form>
            </div>
        </Faded>
    );
}

export default Login;