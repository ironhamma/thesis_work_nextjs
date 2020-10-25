import {useRef} from 'react';
import { useRouter } from 'next/router';

function RegisterPage() {

  const router = useRouter();
  const userNameInput = useRef();
  const userSecondNameInput = useRef();
  const userTelInput = useRef();
  const userDormInput = useRef();
  const userMailInput = useRef();
  const userFirstNameInput = useRef();
  const userInstituteInput = useRef();
  const userRoomInput = useRef();
  const userPassInput = useRef();
  const userPassReInput = useRef();


  const handleSubmit = async (e) => {
    e.preventDefault();

    const userName = userNameInput.current.value;
    const userSecondName = userSecondNameInput.current.value;
    const userTel = userTelInput.current.value;
    const userDorm = userDormInput.current.value;
    const userMail = userMailInput.current.value;
    const userFirstName = userFirstNameInput.current.value;
    const userInstitute = userInstituteInput.current.value;
    const userRoom = userRoomInput.current.value;
    const userPass = userPassInput.current.value;
    const userPassRe = userPassReInput.current.value;

    const response = await fetch("/api/registerUser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({userName, userPass, userSecondName, userTel, userDorm, userMail, userFirstName, userInstitute, userRoom, userPassRe})
    });

    if(response.ok){
      return router.push("/login");
    }
  }

  return (
    <div>
      <div id="mainBackVideo"></div>
      <div className="landerWrapper">
        <div className="landerWrapper__logo">
          <img id="landerLogo" src="/MMMK.png" alt="MMMK logo" />
        </div>
        <div className="landerWrapper__link">
          <div className="registerForm">
            <form onSubmit={handleSubmit}>
              <div className="half-width">
                <label htmlFor="userName">Felhasználónév</label>
                <input type="text" name="userName" id="userName"  ref={userNameInput}/>
                <label htmlFor="userSecondName">Vezetéknév</label>
                <input type="text" name="userSecondName" id="userSecondName"  ref={userSecondNameInput}/>
                <label htmlFor="userTel">Telefon</label>
                <input type="text" name="userTel" id="userTel" ref={userTelInput} />
                <label htmlFor="userDorm">Kollégium</label>
                <input type="text" name="userDorm" id="userDorm" ref={userDormInput} />
                <label htmlFor="userPass">Jelszó</label>
                <input
                  type="text"
                  name="userPass"
                  id="userPass"
                  type="password"
                  ref={userPassInput}
                />
              </div>
              <div className="half-width">
                <label htmlFor="userMail">Email cím</label>
                <input type="text" name="userMail" id="userMail"  ref={userMailInput}/>
                <label htmlFor="userFirstName">Keresztnév</label>
                <input type="text" name="userFirstName" id="userFirstName"  ref={userFirstNameInput}/>
                <label htmlFor="userInstitute">Kar</label>
                <input type="text" name="userInstitute" id="userInstitute" ref={userInstituteInput} />
                <label htmlFor="userRoom">Szobaszám</label>
                <input type="text" name="userRoom" id="userRoom" ref={userRoomInput} />
                <label htmlFor="userPassRe">Jelszó újra</label>
                <input
                  type="text"
                  name="userPassRe"
                  id="userPassRe"
                  type="password"
                  ref={userPassReInput}
                />
              </div>
              <div className="buttonWrapper">
                <button type="submit">Regisztrálok</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
