import Sidebar from "../components/Sidebar/index";
import TableEntry from "../components/TableEntry/index";
import {useState} from "react";
import { withIronSession } from 'next-iron-session';

export const getServerSideProps = withIronSession(
  async({req, res}) => {
    const user = req.session.get('user');

    if(!user) {
      res.statusCode = 404;
      res.end();
      return { props: {}};
    }

    return {
      props: {
        user
      }
    }
  },{
    cookieName: "USERCOOKIE",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production" ? true : false
    },
    password: process.env.APPLICATION_SECRET
  }
);

function ReservePage({user}) {
    const tableContent = [
        {
          day: 0,
          hour: 3,
          name: "Random zenekar",
          status: "reserved",
          length: "single",
          duration: 1,
        },
        {
          day: 2,
          hour: 5,
          name: "Random zenekar2",
          status: "accepted",
          length: "double",
          duration: 2,
        },
        {
          day: 1,
          hour: 2,
          name: "Random zenekar3",
          status: "pending",
          length: "double",
          duration: 2,
        },
        {
          day: 4,
          hour: 4,
          name: "Random zenekar4",
          status: "accepted",
          length: "triple",
          duration: 3,
        },
      ];
    
      const tableRender = [];
      for (let x = 0; x < 8; x++) {
        let col = [];
        for (let i = 0; i < 24; i++) {
          let had = false;
          tableContent.forEach((el) => {
            if (el.day + 1 === x && el.hour === i) {
              col.push(el);
              had = true;
              if (el.length !== 1) {
                i += el.duration - 1;
              }
            }
          });
          if (!had) {
            col.push([]);
          }
        }
        tableRender.push(col);
      }
    
      const [selected, setSelected] = useState([]);
      console.log(user);
  return (
    <div className="pageContainer">
      <Sidebar />
      <div className="mainSection">
        <h1 className="pageTitle">Foglalás {user.userName}</h1>
        <div className="containerFlex">
          <div className="reserveHead">
            <p>
              Mielőtt új foglalást veszel fel válaszd ki a táblázat felett
              található legördülő menüből, hogy saját nevedben, vagy valamelyik
              bandád nevében történik a foglalás. Ezután jelöld be a szabad
              időpontok közül a foglalásra szántakat. Az MMMK szabályzatának
              megfelelően egy héten maximum 6 órát foglalhatsz, egy napon pedig
              maximum 3-at. Ezen foglalások zölddel jelölődnek be. Ezen felül
              csak feltételesen foglalhatod a termet, ezek a foglalások sárgával
              fognak megjelenni.
            </p>
          </div>
          <div className="reserveSelect">
            <span>Kinek a nevében foglalod?</span>
            <form>
              <select name="reserveSelect" id="reserveSelect">
                <option value="szabobeno">Szabó Benedek (szabobeno)</option>
                <option value="szabobeno2">Szabó Benedek (szabobeno2)</option>
                <option value="szabobeno3">Szabó Benedek (szabobeno3)</option>
              </select>
              <button type="submit">Küldés</button>
            </form>
          </div>
          <div className="reserveTableContainer">
            <div className="reserveTable" onClick={console.log(selected)}>
              {tableRender.map((col, index) => (
                <div className="reserveTable__col" key={index}>
                  <div className="reserveTable__colHead">Óra</div>
                  {col.map((entry, id) => (
                    <TableEntry 
                      item={entry}
                      key={id}
                      index={index}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReservePage;
