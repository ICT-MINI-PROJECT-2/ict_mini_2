import {useState } from "react";
import Faded from "../../effect/Faded";
import axios from "axios";
import EditPage from "./EditPage";
import EditCheckList from "./EditCheckList";
import { Link } from "react-router-dom";

function EnterEdit() {
    const [editWhere, setEditWhere] = useState(0);
    const [editParam, setEditParam] = useState({});
    const [pw, setPw] = useState('');

    const changePw = (e) => {
        setPw(e.target.value); 
    }

  const editChk = () =>{
    var alert_pw = document.getElementById("alert-pw");
    alert_pw.style.opacity = 0;
    if(pw===''||pw===undefined){
    
    }else{
      axios.post('http://localhost:9977/user/editEnterChk', {
        id:sessionStorage.getItem("id"),
        userpw:pw
      }).then(res => {
        console.log(res.data)
        if(res.data.id===-1){
            console.log("아이디오류");
        }else if(res.data.id=== -2){
          console.log("비밀번호 오류");
          alert_pw.innerHTML = "비밀번호를 확인하세요(8~15글자,영문,숫자,특수문자)";
          alert_pw.style.opacity = 1;
        }else{
         setEditParam(res.data);
         setEditWhere(1);
        }
      })
      .catch(err => console.log(err))  
    }
  }

  return (
    <Faded>
      {editWhere === 0 &&
    <div className="editEnter-container">
        <div id="editEnter-title">로그인</div>
        <form name="editEnterForm" method="post" onSubmit={(e) => { e.preventDefault(); editChk() }}>    
            <div id="editEnter-box">
                <div id="editEnter-left"><div id="idpw">아이디</div><div id="hidden-height">I</div></div> <div id="editEnter-right">{sessionStorage.getItem('loginId')}<div id="alert-pw"></div></div>
                <div id="editEnter-left"><div id="idpw">비밀번호</div><div id="hidden-height">I</div></div> <div id="editEnter-right"><input value={pw} type="password" id="userpw" name="userpw" onChange={changePw}/><div id="alert-pw"></div></div>
            </div>
            <input className="editEnter-submit" type='button' onClick={()=>editChk()} value="비밀번호 확인"/>
            <div id="idpw-find">
                <div id="id-find"><a>아이디 찾기</a></div>
                <div id="pw-find"><a>비밀번호 찾기</a></div>
            </div>
        </form>
    </div>
}
{editWhere === 1 &&
  <div className="editEnter-container">
    <EditPage editParam={editParam} setEditParam={setEditParam} editWhere={editWhere} setEditWhere={setEditWhere}/>
  </div>
}
{editWhere === 2 &&
  <div className="editEnter-container">
    <EditCheckList editParam={editParam} setEditParam={setEditParam} editwhere={editWhere} setEditWhere={setEditWhere}/>
  </div>
}
{
  editWhere === 3 &&
  <Link to ="/"/>
}
</Faded>
  );
}
export default EnterEdit; 