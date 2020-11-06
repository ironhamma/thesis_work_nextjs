import Sidebar from "../components/Sidebar/index";
import {useEffect, useState} from "react";
import { withIronSession } from 'next-iron-session';
import PageTitle from '../components/PageTitle';
import styles from "./ReservePage.module.css";
import { connectToDatabase } from '../util/mongodb';
import {Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import Select from "react-select";
import { useRouter } from "next/router";
import Button from "../components/Button";
const locales = {
  'en-US': require('date-fns/locale/en-GB'),
};
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export const getServerSideProps = withIronSession(
  async({req, res}) => {
    const user = req.session.get('user');

    if(!user) {
      res.statusCode = 404;
      res.end();
      return { props: {}};
    }

    const { db } = await connectToDatabase();
    const reservations = await db.collection('reservations').find({}).toArray();
    const bands = await db.collection('bands').find({users: {user: user.userName}}).toArray();
    return {
      props: {
        user,
        reservations: JSON.stringify(reservations),
        bands: JSON.stringify(bands)
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

function ReservePage({user, reservations, bands}) {
  const router = useRouter();
  const reservationData = JSON.parse(reservations);
  const bandsData = JSON.parse(bands);
  const bandOptions = bandsData.map(e => ({
    value: e.bandName,
    label: e.bandName
  }));

  const [selectedBand, setSelectedBand] = useState({selected: false, band: ""});

  const [events, setEvents] = useState(reservationData.map(e => ({
    title: e.bandName,
    start: new Date(e.reserveStartDate),
    end: new Date(e.reserveEndDate)
  })));


  const onDragEnd = async (dragevent) => {
    console.log(dragevent.start);
    console.log(dragevent.end);

    setEvents([...events, {
      title: selectedBand.band,
      start: dragevent.start,
      end: dragevent.end
    }]);

    const mappedInput = {
      start: dragevent.start,
      end: dragevent.end,
      bandName: selectedBand.band,
      user: user.userName
    };

    const response = await fetch("/api/reservation/makeReservation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...mappedInput }),
    });

    if (response.ok) {
      return router.push("/reserve");
    }
  
    console.log(events);
  }

  return (
    <div className="pageContainer">
      <Sidebar user={user}/>
      <div className={styles.root}>
        <PageTitle>Foglalás</PageTitle>
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
            <span>Melyik zenekarodnak foglalod?</span>
            <form>
              <Select options={bandOptions} onChange={(e) => setSelectedBand({selected: true, band: e.value})}/>
            </form>
          </div>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ width: "100%" }}
              defaultView="week"
              onSelectEvent={(event) => console.log(event)}
              onSelectSlot={onDragEnd}
              views={['week']}
              selectable={selectedBand.selected}
              step={60}
              timeslots={1}
            />
        </div>
      </div>
    </div>
  );
}

export default ReservePage;
