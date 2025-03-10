import '../../css/user/login.css';
import Faded from '../../effect/Faded'

function Login(){
    return(
        <Faded>
            <div className="login-container">
                <div id="login-title">Login</div>
                <form name="loginForm" method="post">
                    <div id="signup-box">
                        <div id="login-left"><div id="idpw">ID</div><div id="hidden-height">I</div></div> <div id="login-right"><input type="text" id="userid" name="userid"/><div id="alert-id">Invalid ID</div></div>
                        <div id="login-left"><div id="idpw">PW</div><div id="hidden-height">I</div></div> <div id="login-right"><input type="password" id="userpw" name="userpw"/><div id="alert-pw">Invalid PW</div></div>
                    </div>
                    <input className="login-submit" type="button" value="Login"/>
                </form>
            </div>
        </Faded>
    );
}

export default Login;