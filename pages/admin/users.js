import Sidebar from "../../components/Sidebar";
import { withIronSession } from "next-iron-session";
import { connectToDatabase } from "../../util/mongodb";
import { useRouter } from "next/router";
import PageTitle from "../../components/PageTitle";
import styles from "./UsersPage.module.css";
import UserList from "../../components/UserList";

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
      <Sidebar user={user} />
      <div className={styles.root}>
        <PageTitle>Felhasználók</PageTitle>
        <div className="containerFlex">
          <UserList
            currentUser={user.userName}
            onChildrenClick={toggleRole}
            users={userArray}
          />
        </div>
      </div>
    </div>
  );
}

export default UsersPage;
