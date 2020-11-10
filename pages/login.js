import Link from "next/link";
import { useRef } from "react";
import { useRouter } from "next/router";

function LoginPage() {
  const router = useRouter();
  const userNameInput = useRef();
  const passInput = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userName = userNameInput.current.value;
    const userPass = passInput.current.value;

    const response = await fetch("/api/sessionuser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userName, userPass }),
    });

    if (response.ok) {
      return router.push("/");
    }
  };

  return (
    <div>
      <div id="mainBackVideo"></div>
      <div className="landerWrapper">
        <div className="landerWrapper__logo">
          <img id="landerLogo" src="./MMMK.png" alt="MMMK logo" />
        </div>
        <div className="landerWrapper__link">
          <div className="loginForm">
            <form onSubmit={handleSubmit}>
              <label htmlFor="userName">Felhasználónév</label>
              <input
                type="text"
                name="userName"
                id="userName"
                ref={userNameInput}
              />
              <label htmlFor="userPass">Jelszó</label>
              <input
                type="password"
                name="userPass"
                id="userPass"
                ref={passInput}
              />
              <div className="buttonWrapper">
                <button type="submit">Belépés</button>
                  <a
                    href="https://auth.sch.bme.hu/site/login?response_type=code&client_id=58975608503146075333&state=sajt&scope=linkedAccounts+displayName+sn+givenName+mail+mobile"
                    className="schLogin"
                  >
                    Belépés SCH accounttal
                  </a>
                <button>Regisztráció</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
