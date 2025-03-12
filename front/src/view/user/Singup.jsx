import '../../css/user/signup.css';
import Faded from '../../effect/Faded'
import '../../js/user/signup.js';
import { useEffect, useRef, useState } from 'react';
import Post from './Post.jsx';
import axios from 'axios';



function Signup(){
    const mount = useRef(true);
    
    const [idOk, setIdOk] = useState(0);
    const [pwOk, setPwOk] = useState(0);
    const [pw_chkOk, setPwchkOk] = useState(0);
    const [nameOk, setNameOk] = useState(0);
    const [emailOk, setEmailOk] = useState(0);
    const [emailOk2, setEmailOk2] = useState(0);
    
    const [zipcodeOk, setZipcodeOk] = useState(0);
    const [telOk, setTelOk] = useState(0);
    
    const [addr, setAddr] = useState({addr:'',});

    const [popup, setPopup] = useState(false);

    const [idst, setIdst] = useState(0);

    const handleComplete = (data) => {
        setPopup(!popup);
    }

    useEffect(()=>{
        if(idOk===1) {
            let userid = document.getElementById("userid");
            var alert_id = document.getElementById("alert-id");
            axios.post("http://localhost:9977/user/idChk",{userid:userid.value})
            .then(res => {
                if(res.data===1) {
                    setIdOk(0);
                    alert_id.innerHTML = "이미 존재하는 아이디 입니다.";
                    alert_id.style.opacity = 1;
                }
            })
            .catch(err=>console.log(err))
        }
    },[idst]);

    useEffect(()=> {
        if(!mount.current){}
        else {
            mount.current=false;
            let userid = document.getElementById("userid");
            let userpw = document.getElementById("userpw");
            let userpw_chk = document.getElementById("userpw_chk");
            let username = document.getElementById("username");
            let email1 = document.getElementById("email1");
            let email2 = document.getElementById("email2");
            
            var alert_id = document.getElementById("alert-id");
            var alert_pw = document.getElementById("alert-pw");
            var alert_pwchk = document.getElementById("alert-pwchk");
            var alert_name = document.getElementById("alert-name");
            var alert_email = document.getElementById("alert-email");
            if(userid)
            userid.addEventListener("input",()=>{
                setIdst(userid.value.length);
                if(userid.value.length < 7) {
                    alert_id.innerHTML = "7자 이상 입력해주세요.";
                    alert_id.style.opacity = 1;
                    setIdOk(0);
                }
                if(userid.value.length>15) {
                        alert_id.innerHTML = "15자 이하 입력해주세요.";
                    alert_id.style.opacity = 1;
                    setIdOk(0);
                    }
                    else if(userid.value.length>6) {
                        alert_id.style.opacity = 0;
                        setIdOk(1);
                    }
            });
            var regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()])[a-zA-Z\d!@#$%^&*()]{8,15}$/;
            if(userpw)
            userpw.addEventListener("input",()=>{
                if(!regex.test(userpw.value)) {
                    alert_pw.innerHTML = "8~15자의 영문,숫자,특수문자의 조합 입력";
                    alert_pw.style.opacity = 1;
                    setPwOk(0);
                } else {
                    alert_pw.style.opacity = 0;
                    setPwOk(1);
                }
            });
            if(userpw_chk !== null)
                userpw_chk.addEventListener("input",()=>{
                    if(userpw_chk.value !== userpw.value) {
                        alert_pwchk.innerHTML = "비밀번호가 일치하지 않습니다.";
                        alert_pwchk.style.opacity = 1;
                        setPwchkOk(0);
                    } else {
                        alert_pwchk.style.opacity = 0;
                        setPwchkOk(1);
                    }
                });
            if(username)
            username.addEventListener("input",()=>{
                if(username.value.length < 3) {
                    alert_name.innerHTML = "3자 이상 입력해주세요.";
                    alert_name.style.opacity = 1;
                    setNameOk(0);
                } else if(username.value.length>15){
                    alert_name.innerHTML = "15자 이하 입력해주세요.";
                    alert_name.style.opacity = 1;
                    setNameOk(0);
                } else {
                    alert_name.style.opacity = 0;
                    setNameOk(1);
                }
            });
            
            var regex2 = /^[A-Za-z0-9-]+\.[A-za-z0-9-]+/;
            if(email2)
            email2.addEventListener("input",()=>{
                if(!regex2.test(email2.value)) {
                    alert_email.innerHTML = "올바르지 않은 도메인 주소입니다.";
                    alert_email.style.opacity = 1;
                    setEmailOk(0);
                } else {
                    alert_email.style.opacity = 0;
                    setEmailOk(1);
                }
            });
            if(email1)
            email1.addEventListener("input",()=>{
                if(email1.value.length<3) {
                    alert_email.innerHTML = "올바르지 않은 이메일입니다.";
                    alert_email.style.opacity = 1;
                    setEmailOk2(0);
                } else {
                    alert_email.style.opacity = 0;
                    setEmailOk2(1);
                }
            });
        }
    },[]);
    function signUpChk(){
        var zipcode = document.getElementById("zipcode");
        var alert_zipcode = document.getElementById("alert-zipcode");
        
        var tel1 = document.getElementById("tel1");
        var tel2 = document.getElementById("tel2");
        var tel3 = document.getElementById("tel3");
        var alert_tel = document.getElementById("alert-tel");
        
        
        if(zipcode.value === "") {
            alert_zipcode.innerHTML = "우편번호 찾기를 해주세요.";
            alert_zipcode.style.opacity = 1;
            setZipcodeOk(0);
        } else {
            alert_zipcode.style.opacity = 0;
            setZipcodeOk(1);
        }
        var regex_tel = /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})-?[0-9]{3,4}-?[0-9]{4}$/;
        if(!regex_tel.test(tel1.value+'-'+tel2.value+'-'+tel3.value)) {
            alert_tel.innerHTML = "올바른 전화번호를 입력해주세요.";
            alert_tel.style.opacity = 1;
            setTelOk(0);
        } else {
            alert_tel.style.opacity = 0;
            setTelOk(1);
        }
        var result = pwOk+pw_chkOk+nameOk+emailOk+zipcodeOk+idOk+telOk+emailOk2;
        if(result===8) {
            let userid = document.getElementById("userid");
            let userpw = document.getElementById("userpw");
            let username = document.getElementById("username");
            let email1 = document.getElementById("email1");
            let email2 = document.getElementById("email2");
            let zipcode = document.getElementById('zipcode');
            let addr = document.getElementById("addr");
            let addrdetail = document.getElementById('addrdetail');
            let tel1 = document.getElementById("tel1");
            let tel2 = document.getElementById("tel2");
           let tel3 = document.getElementById("tel3");
           axios.post('http://localhost:9977/user/signup',{
                userid:userid.value,
                userpw:userpw.value,
                username:username.value,
                email1:email1.value,
                email2:email2.value,
                zipcode:zipcode.value,
                addr:addr.value,
                addrdetail:addrdetail.value,
                tel1:tel1.value,
                tel2:tel2.value,
                tel3:tel3.value
           })
           .then(res => {
                if(res.data === 'ok') {
                    window.location.href='#/login';
                }
           })
           .catch(err => console.log(err))
        }
    }
    const postButtonStyle = {
        position:'absolute',
        top:'8px',
        right:'8px',
        width:'30px',
        height:'30px',
        fontSize:'20px'
    }
    const postBox={
        backgroundColor:'white',
        width:'800px',
        height:'450px',
        position:'fixed',
        left:'50%',
        top:'50%',
        transform:'translate(-50%,-50%)',
        border:'2px solid black',
        borderRadius:'5px'
    }
    return(
        <Faded>
            <div className="signup-container">
            <div id="signup-title">Sign Up</div>
                <form name="signupForm">
                    <div id="signup-box">
                        <div id="signup-left"><div id="idpw">ID</div><div id="hidden-height">I</div></div> <div id="signup-right"><input type="text" id="userid" name="userid"/><div id="alert-id">Invalid ID</div></div>
                        <div id="signup-left"><div id="idpw">PW</div><div id="hidden-height">I</div></div> <div id="signup-right"><input type="password" id="userpw" name="userpw"/><div id="alert-pw">Invalid PW</div></div>
                        <div id="signup-left"><div id="idpw">PWCHECK</div><div id="hidden-height">I</div></div> <div id="signup-right"><input type="password" id="userpw_chk" name="userpw_chk"/><div id="alert-pwchk">Invalid PW</div></div>
                        <div id="signup-left"><div id="idpw">NAME</div><div id="hidden-height">I</div></div> <div id="signup-right"><input type="text" id="username" name="username"/><div id="alert-name">Invalid NAME</div></div>
                        <div id="signup-left"><div id="idpw">EMAIL</div><div id="hidden-height">I</div></div> <div id="signup-right"><input type="text" id="email1" name="email1"/> @ <input type="text" id="email2" name="email2"/><div id="alert-email">Invalid EMAIL</div></div>
                        <div id="signup-left"><div id="idpw">TEL</div><div id="hidden-height">I</div></div> <div id="signup-right"><input type="text" id="tel1" name="tel1" maxLength='3'/> - <input type="text" id="tel2" name="tel2" maxLength='4'/> - <input type="text" id="tel3" name="tel3" maxLength='4'/><div id="alert-tel">Invalid TEL</div></div>
                        <div id="signup-left"><div id="idpw">ZIPCODE</div><div id="hidden-height">I</div></div> <div id="signup-right"><input type="text" value={addr.zonecode} id="zipcode" name="zipcode" readOnly/><button className="buttons" type="button" onClick={handleComplete}>Find</button><div id="alert-zipcode">Invalid ZIPCODE</div></div>
                        <div id="signup-left"><div id="idpw">ADDRESS</div><div id="hidden-height">I</div></div> <div id="signup-right"><input type="text" value={addr.address} id="addr" name="addr" readOnly/><div id="alert-addr">Invalid ADDRESS</div></div>
                        <div id="signup-left"><div id="idpw">DETAIL</div><div id="hidden-height">I</div></div> <div id="signup-right"><input type="text" id="addrdetail" name="addrdetail"/><div id="alert-addrdetail">Invalid DETAIL</div></div>
                        {popup && <div style={postBox}>
                            <button title="X" style = {postButtonStyle} onClick={() => setPopup(false)} >X</button> 
                            <Post addr={addr} setAddr={setAddr} setPopup={setPopup}/></div>}
                    </div>
                    <input className="signup-submit" onClick = {signUpChk} type="button" value="SignUp"/>
                </form>
            </div>
        </Faded>
    );
}

export default Signup;