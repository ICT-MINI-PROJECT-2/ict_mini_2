import { useEffect, useState } from "react";
import Faded from "../../effect/Faded";
import axios from "axios";

function editEnter() {
    const id = sessionStorage.getItem("id");
    const userId = sessionStorage.getItem("loginId");
    const [data, setData] = useState({});

    useEffect(() => {
      setData({
        userid:userId,
        id:id
      });
    },[id, userId]);

    const setFormData = (e) => {
        setData(p => {
            return {...p, [e.target.name]:e.target.value}
        })
    }

    const doEdit = (de) =>{
      //대충 링크 들어갈 예정정
    }

  const editChk = () =>{
    var userpw = data.userpw;
    var alert_id = document.getElementById("alert-id");
    var alert_pw = document.getElementById("alert-pw");
    alert_id.style.opacity = 0;
    alert_pw.style.opacity = 0;

    if(userpw=""||userpw===undefined){
      alert_pw.innerHTML = "비밀번호를 입력하세요";
      alert_pw.style.opacity = 1;
    }else{
      axios.post('http://localhost:9977/user/editEnterChk', {
        userid:userid,
        userpw:userpw
      }).then(res => {
        if(res.data.id===-1){
          alert_id.innerHTML = "아이디를 확인하세요";
          alert_id.style.opacity = 1;
        }else if(res.data.id===-2){
          alert_pw.innerHTML = "비밀번호를 확인하세요(8~15글자,영문,숫자,특수문자)";
          alert_pw.style.opacity = 1;
        }else{
          doEdit(res.data);
        }
      })
      .catch(err => console.log(err))  
    }
  }

  return (
    <Faded>
    <div className="editEnter-container">
        <div id="editEnter-title">로그인</div>
        <form name="editEnterForm" method="post">
            <div id="editEnter-box">
                <div id="editEnter-left"><div id="idpw">아이디</div><div id="hidden-height">I</div></div> <div id="editEnter-right"><input type="text" id="userid" name="userid" placeholder={userId}/><div id="alert-id"></div></div>
                <div id="editEnter-left"><div id="idpw">비밀번호</div><div id="hidden-height">I</div></div> <div id="editEnter-right"><input type="password" id="userpw" name="userpw" onChange={setFormData}/><div id="alert-pw"></div></div>
            </div>
            <input className="editEnter-submit" type="button" value="Login"/>
            <div id="idpw-find">
                <div id="id-find"><a>아이디 찾기</a></div>
                <div id="pw-find"><a>비밀번호 찾기</a></div>
            </div>
        </form>
    </div>
</Faded>
  );
}
export default editEnter; 