import Sidebar from "../components/Sidebar/index";

function NewsPage(props) {
  return (
    <div className="pageContainer">
      <Sidebar />
      <div className="mainSection">
       <h1 className="pageTitle">Hírek {props.myParams.id}</h1>
        <div className="newsFlex">
          <div className="newsItem">
            <h2 className="newsItem__title">Hurrá, újra nyit a próbaterem</h2>
            <p className="newsItem__text">
              Sziasztok!
              <br />
              2020. 01. 13-án az MMMK próbaterem megnyitja kapuit a zenélni
              vágyó hölgyek és urak előtt!
              <br />
              Üdvözlettel, Szurovcsják Ádám (+36308330662) MMMK beengedőfőnök
            </p>
            <p className="newsItem__date">2020.09.20. - 15:38</p>
          </div>
          <div className="newsItem">
            <h2 className="newsItem__title">Hurrá, újra nyit a próbaterem</h2>
            <p className="newsItem__text">
              Sajnálatal kell közölnünk, hogy a vírus miatt kialakult helyzetben
              próbatermünket
              <br />
              kénytelenek vagyunk határozatlan időre bezárni.
              <br />
              Amint javul a helyzet, levelezőlistáinkon értesítünk titeket a
              fejleményekről.
            </p>
            <p className="newsItem__date">2020.09.20. - 15:38</p>
          </div>
          <div className="newsItem">
            <h2 className="newsItem__title">Hurrá, újra nyit a próbaterem</h2>
            <p className="newsItem__text">
              Sziasztok!
              <br />
              2020. 01. 13-án az MMMK próbaterem megnyitja kapuit a zenélni
              vágyó hölgyek és urak előtt!
              <br />
              Üdvözlettel, Szurovcsják Ádám (+36308330662) MMMK beengedőfőnök
            </p>
            <p className="newsItem__date">2020.09.20. - 15:38</p>
          </div>
          <div className="newsItem">
            <h2 className="newsItem__title">Hurrá, újra nyit a próbaterem</h2>
            <p className="newsItem__text">
              Sajnálatal kell közölnünk, hogy a vírus miatt kialakult helyzetben
              próbatermünket
              <br />
              kénytelenek vagyunk határozatlan időre bezárni.
              <br />
              Amint javul a helyzet, levelezőlistáinkon értesítünk titeket a
              fejleményekről.
            </p>
            <p className="newsItem__date">2020.09.20. - 15:38</p>
          </div>
        </div>
      </div>
    </div>
  );
}

NewsPage.getInitialProps = ({query}) => {
  return {myParams: query};
}

export default NewsPage;
