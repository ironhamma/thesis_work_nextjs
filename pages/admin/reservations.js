import Sidebar from "../../components/Sidebar";
import { withIronSession } from "next-iron-session";
import { connectToDatabase } from "../../util/mongodb";
import { useRouter } from "next/router";
import PageTitle from "../../components/PageTitle";
import FancyList from "../../components/FancyList";
import Spacer from "../../components/Spacer";
import styles from "./ReservationsPage.module.css";
import { useState } from "react";

export const getServerSideProps = withIronSession(
  async ({ req, res }) => {
    const user = req.session.get("user");

    if (!user) {
      res.statusCode = 404;
      res.end();
      return { props: {} };
    }

    const { db } = await connectToDatabase();

    if (![1,2,3].includes(user.userType)) {
      res.statusCode = 403;
      res.end();
      return { props: {} };
    }

    const reservationArray = await db.collection("reservations").find({}).toArray();

    return {
      props: {
        reservations: JSON.parse(JSON.stringify(reservationArray)),
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

function ReservationsPage({ reservations, user }) {
  const router = useRouter();
  const [reserveData, setReserveData] = useState(reservations.sort((a,b) => new Date(a.reserveStartDate) - new Date(b.reserveStartDate)));
  const [myReserves, setMyReserves] = useState(reserveData.filter(e => e.assignee === user.userName));

  const onAccept = async (reservationId) => {
    reserveData.find(e => e._id === reservationId).status = 2;
    setReserveData(reserveData);

    const response = await fetch("/api/reservation/accept", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reservationId: reservationId }),
    });

    if (response.ok) {
      return router.push("/admin/reservations");
    }
  };

  const onDecline = async (reservationId) => {
    reserveData.find(e => e._id === reservationId).status = 3;
    setReserveData(reserveData);

    const response = await fetch("/api/reservation/decline", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reservationId: reservationId }),
    });

    if (response.ok) {
      return router.push("/admin/reservations");
    }
  };

  const onLetIn = async (reservationId) => {
    reserveData.find(e => e._id === reservationId).assignee = user.userName;
    reserveData.find(e => e._id === reservationId).status = 2;
    setReserveData(reserveData);
    setMyReserves([...myReserves, reserveData.find(e => e._id === reservationId)].sort((a,b) => new Date(a.reserveStartDate) - new Date(b.reserveStartDate)));

    const response = await fetch("/api/reservation/assignLetIn", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reservationId: reservationId, assignee: user.userName }),
    });

    if (response.ok) {
      return router.push("/admin/reservations");
    }
  };

  const onCancel = async (reservationId) => {
    reserveData.find(e => e._id === reservationId).assignee = null;
    reserveData.find(e => e._id === reservationId).status = 1;
    setReserveData(reserveData);
    setMyReserves(myReserves.filter(e => e._id !== reservationId));

    const response = await fetch("/api/reservation/assignLetIn", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reservationId: reservationId, assignee: null }),
    });

    if (response.ok) {
      return router.push("/admin/reservations");
    }
  }
  

  return (
    <div className="pageContainer">
      <Sidebar user={user} />
      <div className={styles.root}>
        <PageTitle>Foglalások</PageTitle>
        <div className="containerFlex">
        {
          myReserves.length !== 0 && (
            <>
            <h2>Beengedéseim:</h2>
            <FancyList ordered listData={myReserves} cancelable onCancel={onCancel} />
            <Spacer y={3} />
            <h2 style={{width: "100%"}}>Egyéb foglalások:</h2>
            </>
          )
        }
          <FancyList ordered listData={reserveData} onAccept={onAccept} onDecline={onDecline} onLetIn={onLetIn} userType={user.userType}/>
        </div>
      </div>
    </div>
  );
}

export default ReservationsPage;
