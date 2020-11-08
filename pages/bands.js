import Sidebar from "../components/Sidebar";
import { withIronSession } from "next-iron-session";
import { connectToDatabase } from "../util/mongodb";
import PageTitle from "../components/PageTitle";
import styles from "./BandsPage.module.css";
import BandCard from "../components/BandCard";
import Input from "../components/Input";
import { Controller, useForm } from "react-hook-form";
import Button from "../components/Button";
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

    const bands = await db
      .collection("bands")
      .find({ users: { $elemMatch: { user: user.userName } } })
      .toArray();

    const users = await db.collection("users").find({}).toArray();

    return {
      props: {
        user,
        bands: JSON.stringify(bands),
        users: JSON.stringify(users),
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

function BandsPage({ user, bands, users }) {
  const router = useRouter();
  const bandData = JSON.parse(bands);
  const usersData = JSON.parse(users);

  const onInvite = async (res, bandName) => {
    const response = await fetch("/api/bands/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        invited: res.invited.label,
        inviter: user.userName,
        bandName: bandName,
      }),
    });

    if (response.ok) {
      return router.push("/bands");
    }
  };

  const onRemove = async (band, removed) => {
    const response = await fetch("/api/bands/removeUser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ band, removed }),
    });

    if (response.ok) {
      return router.push("/bands");
    }
  };

  const onDelete = async (band) => {
    const response = await fetch("/api/bands/removeBand", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ band }),
    });

    if (response.ok) {
      return router.push("/bands");
    }
  };

  const onApprove = async (band, user) => {
    const response = await fetch("/api/bands/approveInv", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ band, user }),
    });

    if (response.ok) {
      return router.push("/bands");
    }
  };

  return (
    <div className={styles.pageContainer}>
      <Sidebar user={user} />
      <div className={styles.root}>
        <PageTitle>Zenekarjaim</PageTitle>
        <div className={styles.containerFlex}>
          {bandData.map((e, index) => (
            <BandCard
              currentUser={user}
              bandData={e}
              key={index}
              users={usersData}
              onInvite={onInvite}
              onRemove={onRemove}
              onDelete={onDelete}
              onApprove={onApprove}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default BandsPage;
