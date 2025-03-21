import Faded from "../../effect/Faded";

function editEnter() {
    const [data, setData] = useState({});

  return (
    <Faded>
        <div className="editEnter-container">
            <h2>비밀번호 확인</h2>
            <form name="editEnterForm" method="post">
            <div id="editEnter-box">
            <div id="editEnter-left"><div id="idpw">아이디</div><div id="hidden-height">I</div></div> <div id="editEnter-right"><input type="text" id="userid" name="userid" placeholder={id}/><div id="alert-id"></div></div>
            <div id="editEnter-left"><div id="idpw">비밀번호</div><div id="hidden-height">I</div></div> <div id="editEnter-right"><input type="password" id="userpw" name="userpw" onChange={setFormData}/><div id="alert-pw"></div></div>
            </div>
            <input className="editEnter-btn" type="button" onClick={editEnterChk} value="로그인인"/>
            </form>
        </div>
    </Faded>    
  );
}
export default editEnter; 