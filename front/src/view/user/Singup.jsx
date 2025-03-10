import '../../css/user/signup.css';
import Faded from '../../effect/Faded'

function Signup(){
    return(
        <Faded>
            <div className="signup-container">
            <div id="signup-title">Sign Up</div>
                <form name="signupForm" method="post" action="signUpChk">
                    <div id="signup-box">
                        <div id="signup-left"><div id="idpw">ID</div><div id="hidden-height">I</div></div> <div id="signup-right"><input type="text" id="userid" name="userid"/><div id="alert-id">Invalid ID</div></div>
                        <div id="signup-left"><div id="idpw">PW</div><div id="hidden-height">I</div></div> <div id="signup-right"><input type="password" id="userpw" name="userpw"/><div id="alert-pw">Invalid PW</div></div>
                        <div id="signup-left"><div id="idpw">PWCHECK</div><div id="hidden-height">I</div></div> <div id="signup-right"><input type="password" id="userpw_chk" name="userpw_chk"/><div id="alert-pwchk">Invalid PW</div></div>
                        <div id="signup-left"><div id="idpw">NAME</div><div id="hidden-height">I</div></div> <div id="signup-right"><input type="text" id="username" name="username"/><div id="alert-name">Invalid NAME</div></div>
                        <div id="signup-left"><div id="idpw">EMAIL</div><div id="hidden-height">I</div></div> <div id="signup-right"><input type="text" id="email1" name="email1"/> @ <input type="text" id="email2" name="email2"/><div id="alert-email">Invalid EMAIL</div></div>
                        <div id="signup-left"><div id="idpw">TEL</div><div id="hidden-height">I</div></div> <div id="signup-right"><input type="text" id="tel1" name="tel1" maxLength='3'/> - <input type="text" id="tel2" name="tel2" maxLength='4'/> - <input type="text" id="tel3" name="tel3" maxLength='4'/><div id="alert-tel">Invalid TEL</div></div>
                        <div id="signup-left"><div id="idpw">ZIPCODE</div><div id="hidden-height">I</div></div> <div id="signup-right"><input type="text" id="zipcode" name="zipcode" readOnly/><button className="buttons" type="button">Find</button><div id="alert-zipcode">Invalid ZIPCODE</div></div>
                        <div id="signup-left"><div id="idpw">ADDRESS</div><div id="hidden-height">I</div></div> <div id="signup-right"><input type="text" id="addr" name="addr" readOnly/><div id="alert-addr">Invalid ADDRESS</div></div>
                        <div id="signup-left"><div id="idpw">DETAIL</div><div id="hidden-height">I</div></div> <div id="signup-right"><input type="text" id="addrdetail" name="addrdetail"/><div id="alert-addrdetail">Invalid DETAIL</div></div>
                        <div id="signup-left"><div id="idpw">CREDIT</div><div id="hidden-height">I</div></div> <div id="signup-right"><input type="text" id="credit1" name="credit1" maxLength='4'/> - <input type="text" id="credit2" name="credit2" maxLength='4'/> - <input type="text" id="credit3" name="credit3" maxLength='4'/> - <input type="text" id="credit4" name="credit4" maxLength='4'/><div id="alert-credit">Invalid CREDIT</div></div>
                    </div>
                    <input className="signup-submit" type="button" value="SignUp"/>
                </form>
            </div>
        </Faded>
    );
}

export default Signup;