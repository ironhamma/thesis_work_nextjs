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
import Spacer from "../components/Spacer";
import FancyList from "../components/FancyList";
import { useRouter } from "next/router";
const locales = {
  'en-US': require('date-fns/locale/en-GB'),
};
import "react-big-calendar/lib/css/react-big-calendar.css";
import Modal from "../components/Modal";

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
    const bands = await db.collection('bands').find({users: {$elemMatch: {user: user.userName}}}).toArray();
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

  const [modalOpen, setModalOpen] = useState(false);

  const [selectedBand, setSelectedBand] = useState({selected: false, band: ""});
  const [myReserve, setMyReserve] = useState(reservationData.filter(e => e.reservedBy === user.userName));

  const [events, setEvents] = useState(reservationData.map(e => ({
    title: e.bandName,
    start: new Date(e.reserveStartDate),
    end: new Date(e.reserveEndDate),
    status: e.status
  })));


  const onDragEnd = async (dragevent) => {
    setEvents([...events, {
      title: selectedBand.band,
      start: dragevent.start,
      end: dragevent.end,
      status: 1
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
  
  }

  const addClass = (event) => {
    switch (event.status){
      case 1:
        return {
          className: styles.status_inprogress,
        }
        break;
      case 2:
        return {
          className: styles.status_accepted,
        }
        break;
      case 3:
        return {
          className: styles.status_declined,
        }
        break;
      default:
        return {}
        break;
    }
  };

  const onModalToggle = () => {
    setModalOpen(!modalOpen);
    console.log("hello");
  }

  return (
    <div className={styles.pageContainer}>
      <Sidebar user={user}/>
      <div className={styles.root}>
        <PageTitle>Foglalás</PageTitle>
        <div className={styles.containerFlex}>
          <div className={styles.reserveHead}>
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
          <div className={styles.reserveSelect}>
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
              onSelectEvent={() => onModalToggle()}
              onSelectSlot={onDragEnd}
              views={['week']}
              selectable={selectedBand.selected}
              step={60}
              timeslots={1}
              eventPropGetter={addClass}
            />
            {myReserve.length !== 0 && (
              <>
                <h2 style={{margin: "3rem 0 1rem 0"}}>Foglalásaim:</h2>
                <FancyList listData={myReserve} vanilla/>
              </>
            )}
        </div>
      </div>
      <Modal open={modalOpen} setOpen={setModalOpen}/>
    </div>
  );
}

export default ReservePage;
