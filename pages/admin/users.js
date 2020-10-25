import Sidebar from "../../components/Sidebar";
import { withIronSession } from "next-iron-session";
import { connectToDatabase } from "../../util/mongodb";

export const getServerSideProps = withIronSession(
  async ({ req, res }) => {
    const user = req.session.get("user");

    if (!user) {
      res.statusCode = 404;
      res.end();
      return { props: {}};
    }

    const { db } = await connectToDatabase();

    const userArray = await db
      .collection("users")
      .find({})
      .toArray();

    return {
      props: {
        userArray: JSON.parse(JSON.stringify(userArray)),
        user
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

function UsersPage({ user, userArray }) {
  return (
    <div className="pageContainer">
      <Sidebar />
      <div className="mainSection">
        <h1 className="pageTitle">Felhasználók</h1>
        <div className="containerFlex">
          <ul>
            {userArray.map(e => (
              <li>{e.userName}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default UsersPage;