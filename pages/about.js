import { withIronSession } from 'next-iron-session';
import { connectToDatabase } from '../util/mongodb';
import Sidebar from "../components/Sidebar/index";
import PageTitle from '../components/PageTitle';
import styles from "./AboutPage.module.css";

export const getServerSideProps = withIronSession(
  async({req, res}) => {
    const user = req.session.get('user');
      
    if(!user) {
      return { props: {}};
    }
    const { db } = await connectToDatabase();

    const users = await db.collection('users').find({}).toArray();
    return {
      props: {
        users: JSON.parse(JSON.stringify(users)),
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

function AboutPage({user}) {
  return (
    <div className="pageContainer">
      <Sidebar user={user} />
      <div className={styles.root}>
        <PageTitle>Rólunk</PageTitle>
        <div className="containerFlex">
          <img
            className="aboutImg"
            src="/group.jpg"
            alt=""
            onClick={() => alert("hello")}
          />
          <div className="aboutBack half">
            <div className="aboutText">
              <h1>Muzsika Mívelő Mérnökök Klubja</h1>
              Az MMMK lényegében egy zenekari próbatermet üzemeltet a kollégium
              első emeletén, a 119-es teremben, ami fel van szerelve sok jó
              dologgal a gyakorláshoz.
              <br />
              Vannak gitárerősítők, mikrofonok, és van dob. Előre megadott
              időpontokra lehet jelentkezni a honlapunkon, utána lehet menni
              próbálni - akár egyénileg akár egész zenekarral.
              <br />
              Emellett a kör több zenés rendezvényt is szokott szervezni a
              kollégiumon belül, amiken az élőzenét kedvelő kollégisták
              kielégíthetik vágyaikat.
            </div>
          </div>
          <div className="aboutBack">
            <div className="aboutText title">
              <h2>Körvezetőség</h2>
            </div>
            <div className="aboutText leaders">
              <div className="leaderFlex">
                <div className="titles">
                  <p>Körvezető:</p>
                  <p>Beengedőfőnök:</p>
                  <p>Gazdaságis:</p>
                </div>
                <div className="names">
                  <p>Koenig Benedek</p>
                  <p>Szurovcsják Ádám</p>
                  <p>Várszegi Júlia</p>
                </div>
              </div>
              (elérhetőség lásd taglista)
            </div>
          </div>
          <div className="aboutBack">
            <div className="aboutText title">
              <h2>Eszközök</h2>
            </div>
            <div className="aboutText items half">
              <h3>Ludwig dobcucc</h3>
              <h4>Testek átmérői</h4>
              <ul>
                <li>Pergő: 14"</li>
                <li>Tamok: 10" felső, 12" felső, 14" álló</li>
                <li>lábdob: 22"</li>
                <li>
                  Cinek: (Változó, attól függően, éppen melyik repedt/tört
                  szanaszét)
                </li>
                <li>Lábcin, Két crash, Splash, Ride, Kínai</li>
              </ul>
              <h4>Egyéb</h4>
              <ul>
                <li>Duplázó, Kolomp (best thing ever), Állványok mindenhez</li>
              </ul>
            </div>
            <div className="aboutText items half">
              <h3>Peavey Valveking 112 Gitárerősítő Combo</h3>
              <ul>
                <li>50 Wattos</li>
                <li>Full csöves</li>
                <li>3 db 12AX7-es előfok</li>
                <li>2 db 6L6GC-es végfok (2015 márciusban cserélve újakra)</li>
                <li>1 db 12-es hangszóró</li>
                <li>Két csatorna: Clean, Lead</li>
                <li>Csatornánként 3 sávos EQ, Volume, Leaden Gain is</li>
                <li>Effect loop</li>
                <li>Zengető</li>
              </ul>
            </div>
            <div className="aboutText items half">
              <h3>Line6 Spider III 120 Gitárerősítő Combo</h3>
              <ul>
                <li>Digitális</li>
                <li>120 Wattos</li>
                <li>
                  12 erősítőmodell: Clean, Twang, Blues, Crunch, Metal, Insane
                  (2 verzió mindegyikből)
                </li>
                <li>
                  Végtelen digitális effekt: Phaser, Chorus/Flanger, Tremolo,
                  Delay, Sweep Echo, Tape Echo, Reverb
                </li>
                <li>250 + 150 gyári preset</li>
                <li>36 saját preset</li>
                <li>4 csatornás lábkapcsoló</li>
                <li>2 db 10-es Custom Celestion hangszóró</li>
              </ul>
            </div>
            <div className="aboutText items half">
              <h3>Gallien-Krueger Backline 600 Basszus erősítőfej</h3>
              <ul>
                <li>300 Watt @ 4 ohm</li>
                <li>4 sávos EQ</li>
                <li>2 csatorna</li>
                <li>Contour poti</li>
                <li>Effect loop</li>
                <li>XLR, hangoló kimenet</li>
              </ul>
            </div>
            <div className="aboutText items half">
              <h3>Gallien-Krueger GLX Basszusláda</h3>
              <ul>
                <li>400 Watt @ 8 ohm</li>
                <li>4 db 10"-es hangszóró</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
