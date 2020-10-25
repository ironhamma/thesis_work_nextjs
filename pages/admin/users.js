import Sidebar from "../../components/Sidebar";
import { withIronSession } from "next-iron-session";
import { connectToDatabase } from "../../util/mongodb";
import { useRouter } from "next/router";

export const getServerSideProps = withIronSession(
  async ({ req, res }) => {
    const user = req.session.get("user");

    if (!user) {
      res.statusCode = 404;
      res.end();
      return { props: {} };
    }

    const { db } = await connectToDatabase();

    const sessUser = await db
      .collection("users")
      .findOne({ userName: user.userName });

    if (!sessUser.isAdmin) {
      res.statusCode = 403;
      res.end();
      return { props: {} };
    }

    const userArray = await db.collection("users").find({}).toArray();

    return {
      props: {
        userArray: JSON.parse(JSON.stringify(userArray)),
        user,
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

function UsersPage({ userArray, user }) {
  const router = useRouter();
  const toggleRole = async (userName) => {
    const response = await fetch("/api/users/modifyRole", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userName }),
    });

    if (response.ok) {
      return router.push("/admin/users");
    }
  };

  return (
    <div className="pageContainer">
      <Sidebar />
      <div className="mainSection">
        <h1 className="pageTitle">Felhasználók</h1>
        <div className="containerFlex">
          <ul>
            {userArray.map((e, index) =>
              e.isAdmin ? (
                e.userName === user.userName ? (
                  <li key={index}>
                    <span>{e.userName}</span>
                    <b>IS ADMIN</b>
                  </li>
                ) : (
                  <li key={index}>
                    <span>{e.userName}</span>
                    <button onClick={() => toggleRole(e.userName)}>
                      Admin jog elvétele
                    </button>
                  </li>
                )
              ) : (
                <li key={index}>
                  <span>{e.userName}</span>
                  <button onClick={() => toggleRole(e.userName)}>
                    Admin jog megadása
                  </button>
                </li>
              )
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default UsersPage;
