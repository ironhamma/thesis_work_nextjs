import Sidebar from "../components/Sidebar";
import { withIronSession } from "next-iron-session";
import {connectToDatabase} from '../util/mongodb';


export const getServerSideProps = withIronSession(
  async ({ req, res }) => {
    const user = req.session.get("user");

    if (!user) {
      res.statusCode = 404;
      res.end();
      return { props: {} };
    }

    const {db} = await connectToDatabase();

    const sessUser = await db.collection('users').find({userName: user.userName}).toArray();

    console.log(user);
    console.log(sessUser[0]);

    return {
      props: {
        user,
        sessUser: {...sessUser[0], _id: sessUser[0]._id.toString()}
      },
    };
  },
  {
    cookieName: "USERCOOKIE",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production" ? true : false,
    },
    password: process.env.APPLICATION_SECRET,
  }
);

function ProfilePage({ user, sessUser }) {

  console.log(sessUser);
  
  return (
    <div className="pageContainer">
      <Sidebar />
      <div className="mainSection">
        <h1 className="pageTitle">Profilom</h1>
        <div className="containerFlex">
          <div className="profileInfoBox">
            <h2>Általános adataim</h2>
            <form>
              <div>Username: <span>{sessUser.userName}</span></div>
              <div>Családnév: <span>{sessUser.userSecondName}</span></div>
              <div>Vezetéknév: <span>{sessUser.userFirstName}</span></div>
              <label for="userMail">userMail</label>
              <input type="text" id="userMail" name="userMail" value={sessUser.userMail}/>
              <label for="userRoom">userRoom</label>
              <input type="text" id="userRoom" name="userRoom" value={sessUser.userRoom}/>
              <label for="userTel">userTel</label>
              <input type="text" id="userTel" name="userTel" value={sessUser.userTel}/>
              <label for="userInstitute">userInstitute</label>
              <input type="text" id="userInstitute" name="userInstitute" value={sessUser.userInstitute} />
              <label for="userDorm">userInstitute</label>
              <input type="text" id="userDorm" name="userDorm" value={sessUser.userDorm} />
              <button type="submit">Mentés</button>
            </form>
          </div>
          <div className="profileInfoBox">
            <h2>Foglalási adataim</h2>
            <form>
              <label for="reserveId">Foglalási azonosító</label>
              <input type="text" id="reserveId" name="reserveId" value={sessUser._id}/>
              <input type="text" />
              <input type="text" />
              <button type="submit">Mentés</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
