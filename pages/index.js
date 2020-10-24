import Link from "next/link";

function HomePage({data}) {


  
  return (
    <div>
      <div id="mainBackVideo"></div>
      <div className="landerWrapper">
        <div className="landerWrapper__logo" >
          <img id="landerLogo" src="./MMMK.png" alt="MMMK logo" />
        </div>
        <div className="landerWrapper__link">
          <Link href="/login">
            <a id="loginLink" href="/login">
              <h1>Belépés</h1>
            </a>
          </Link>
          <a id="registerLink" href="/register">
            <h1>Regisztráció</h1>
          </a>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
