import Sidebar from "../components/Sidebar/index";
import { withIronSession } from 'next-iron-session';
import { connectToDatabase } from '../util/mongodb';
import PageTitle from '../components/PageTitle';
import styles from "./RulesPage.module.css";

export const getServerSideProps = withIronSession(
  async({req, res}) => {
    let user = req.session.get('user');
    if(user === undefined){
      user = null;
    }

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

function RulesPage({user}) {
  return (
    <div className={styles.pageContainer}>
      <Sidebar user={user} />
      <div className={styles.root}>
        <PageTitle>Szabályzat</PageTitle>
        <div className={styles.containerFlex}>
          <div className={styles.ruleContainer}>
            <div className={styles.title}>
              <h2>Általános tudnivalók</h2>
            </div>
            <p>
              A próbatermet csak olyan zenekarok használhatják, melyeknek van
              legalább egy volt vagy jelenlegi BME-s tagja.
              <br />
              Ha olyan problémád van, melyet a lent leírtak nem fednek, úgy a
              körvezetőt / beengedőfönököt kell keresni.
            </p>
            <div className={styles.title}>
              <h2>Próbaterem használatához szükséges teendők</h2>
            </div>
            <ol>
              <li>Regisztrálj az mmmk.sch.bme.hu weboldalon.</li>
              <li>
                Iratkozz fel a levlistánkra.
                https://lists.sch.bme.hu/wws/subscribe/probaterem
              </li>
              <li>
                Töltsd ki a profilod. Ha korábban regisztráltál, ellenőrizd,
                hogy az elérhetőségeid még aktuálisak-e!
              </li>
              <li>Jelentkezz időszakra a profilodon.</li>
              <li>
                Ha nem csak egyedül szeretnél próbálni, akkor regisztráld
                zenekarodat a beengedőfőnökünknél emailben. Miután létrejött a
                zenekarod, már a banda nevében is foglalhatsz időpontot.
              </li>
            </ol>
            <p>
              A fentiekkel kapcsolatban bármilyen probléma esetén írjatok a
              levlistára.
            </p>
            <div className={styles.title}>
              <h2>Bejutás a koliba</h2>
            </div>
            <ol>
              <li>
                Ha van SCH-s tag, akkor vendégül tudja fogadni a többieket.
              </li>
              <li>
                Ha van VIK-es diákigazolványod, akkor azzal is be tudsz jönni.
              </li>
              <li>A külsősöket a beengedő tudja fogadni.</li>
            </ol>
            <div className={styles.title}>
              <h2>Próbarend</h2>
            </div>
            <ol>
              <li>
                Ha bandával akarsz próbálni, minden tag regisztrációja és
                jelentkezésének elfogadása után írj a beengedőfőnöknek egy
                e-mailt a banda nevével és a tagok listájával, létrehozás után
                minden tag tud a banda nevében foglalni.
              </li>
              <li>
                Első próba alkalmával jelezd a beengedődnek, hogy mondja el a
                szükséges tudnivalókat a terem használatával kapcsolatban.
                Ezeket a beengedők bármikor szívesen elmondják újra, kérdezd
                őket bátran!
              </li>
              <li>
                Csak elfogadott jelentkezéssel rendelkező tagok használhatják a
                próbatermet. Ez alól még egy szám erejéig sem lehet kivételt
                tenni.
              </li>
              <li>
                Időpontot a weblapon tudsz foglalni. Ezt minél hamarabb
                elintézed, annál esélyesebb, hogy lesz beengedőd. Amennyiben
                nincs, írj a listánkra!
              </li>
              <li>
                Egy héten összesen 6 óra, naponta pedig 3 óra foglalható fixen.
                Természetesen foglalhatsz többet is, de az már feltételes
                foglalás lesz, ami azt jelenti, hogy bárki ráfoglalhat erre az
                időpontra (akár Te is másokéra). Figyeljetek rá, hogy az egyéni
                tagok foglalásai nem ekvivalensek a bandák foglalásaival (lásd:
                Szankciók).
              </li>
              <li>
                A próba időpontjában a weben kiírt beengedőt kell keresni, hogy
                kinyissa a termet. A beengedő elérhetőségei szintén a honlapon
                találhatóak (szobaszám, mobilszám).
              </li>
              <li>
                Ha lefoglalsz egy időpontot, igyekezz pontosan megjelenni, mert
                10 perces késés esetén a beengedő nem köteles beengedni.
              </li>
              <li>
                A beengedő segít beállítani a felszerelést, ha próba közben
                bármi kérdés vagy gond van, akkor hozzá kell fordulni.
              </li>
              <li>
                A teremfelszerelést a próba végeztével tedd a helyére, oda, és
                olyan állapotban, ahogy azt találtad, vagy a beengedővel
                megbeszélted. Ha a beengedő úgy találja, hogy a terem nincs
                rendben, kötelezhet téged az újbóli rendrakásra.
              </li>
              <li>
                Figyelj rá, hogy a terem pontban a foglalásod végeztével
                átadható állapotban legyen. Tapasztalatunk szerint egy bandának
                az összepakoláshoz kb. 15 perc szükséges.
              </li>
              <li>
                A termet a próba végeztével a beengedő jelenléte és jóváhagyása
                nélkül semmilyen esetben sem hagyhatod el.
              </li>
              <li>
                A próbaterem területén az alkoholfogyasztás és a teljes épület
                területén a dohányzás tilos.
              </li>
              <li>
                A próbateremben tilos szemetelni (papírzsepi, törött dobverő,
                stb.), ezeket a próba végén dobd ki a szemetesbe.
              </li>
            </ol>
            <div className={styles.title}>
              <h2>Szerkók</h2>
            </div>
            <ul>
              <li>
                A próbaterem felszereléseinek kölcsönadására nincs lehetőségünk!
              </li>
              <li>
                Az eszközökre tilos nyitott tetejű edényben bármilyen
                folyadékot, ételt rakni!
              </li>
            </ul>
            <div className={styles.title}>
              <h2>Dobcucc</h2>
            </div>
            <ul>
              <li>
                Vigyázz, hogy ne érjenek egymáshoz a dobtestek és a cintányérok
                se érjenek hozzá a falhoz!
              </li>
              <li>
                Figyelj a cintányérok helyes beállítására, használat során
                mindig láss rá a tetejükre.
              </li>
              <li>
                Ne húzd túl a szárnyas csavarokat, mert könnyen megszakadhat a
                menet!
              </li>
              <li>
                Ha végeztél, engedd le a sodronyt a pergőn, és engedd le a
                lábcint, hogy ne feszüljenek a rugók!
              </li>
            </ul>
            <div className={styles.title}>
              <h2>Basszuserősítő</h2>
            </div>
            <ul>
              <li>Ki- és bekapcsolásnál a hangerő legyen nullán!</li>
              <li>
                Bekapcsolás előtt győződj meg róla, hogy a láda nem ér a falhoz,
                a csatlakoztatott kábel feje nem feszül a fal és a láda közé.
              </li>
              <li>A ládát a helyéről ne mozgasd el, illetve ne ülj rá.</li>
              <li>
                Figyelj rá, hogy a fej szellőző nyílása szabadon maradjon a
                tetején.
              </li>
              <li>
                Ne tekerdd túl a hangerőt, ha villog a peek led, vegyél vissza!
              </li>
              <li>Kikapcsolás után kapcsold le a hálózati elosztót!</li>
            </ul>
            <div className={styles.title}>
              <h2>Peavey</h2>
            </div>
            <ul>
              <li>
                Ki-be kapcsolásnál a hangerők (tiszta és torzított csatorna)
                legyen lecsavarva!
              </li>
              <li>
                Bekapcsolásnál a jobb oldali kapcsolót (Power) kapcsold fel
                először, ez fűti a csöveket, majd csak 1-2 perccel később
                kapcsold fel a másikat (Standby) is!
              </li>
              <li>
                Kikapcsolásnál fordított sorrendben kapcsold ki a kapcsolókat:
                először a Standby-t, és várj fél percet, mielőtt lekapcsolod a
                Powert is.
              </li>
              <li>Kikapcsolás után kapcsold le a hálózati elosztót!</li>
            </ul>
            <div className={styles.title}>
              <h2>Line6</h2>
            </div>
            <ul>
              <li>Ki-be kapcsolásnál a master hangerő legyen lecsavarva!</li>
              <li>Kikapcsolás után kapcsold le a hálózati elosztót!</li>
            </ul>
            <div className={styles.title}>
              <h2>Keverő és hangfalak</h2>
            </div>
            <p>
              Ezeket az eszközöket kizárólag a beengedők kezelhetik. A próbátok
              elején jelezzétek, ha szükségetek van rá.
            </p>
            <div className={styles.title}>
              <h2>Szankciók</h2>
            </div>
            <p>
              A büntetések szintjei: szóbeli figyelmeztetés (1), állandó időpont
              megvonás (2), minden foglalásod feltételessé válik (3), foglalási
              jog megvonása (5).
            </p>
            <p>
              Az kihágások megítélésében a beengedőknek abszolút joga van, ha
              nem érzed igazságosnak, keresd meg a körvezetőt! A szankciók
              jogosságát a körvezetőség ítéli meg.
            </p>
            <br />
            <p>
              <b>
                Néhány kihágás és az értük járó büntetőpont, a teljesség igénye
                nélkül:
              </b>
            </p>
            <ul>
              <li>
                A terem késedelmes átadása (akár a rendrakási kötelezettség
                miatt) – 1 pont / 5 perc
              </li>
              <li>A terem állapotának megrongálása – 1-2 pont</li>
              <li>
                A terem felszerelésének megrongálása – 1-5 pont (a
                rendeltetésszerű használatból eredő károkért nem számolunk fel
                büntetőpontot
              </li>
              <li>
                Észrevehető kár jelentésének elmulasztása – 2 pont
                (rendeltetésszerű használat esetén is)
              </li>
              <li>
                Időpontban nem megjelenés, előzetes értesítés nélkül – 2 pont
              </li>
              <li>
                A terem elhagyása nem átadható állapotban a próba végeztével a
                beengedő jelenlétében – 3 pont
              </li>
              <li>A terem elhagyása a beengedő jelenléte nélkül – 4 pont</li>
              <li>
                A vezetőség engedélye nélkül a próbálón/bandán kívüli személyek
                terembe való beengedése - 5 pont
              </li>
              <li>Nyitott belső ajtó mellett való próba - 2 pont</li>
              <li>A próbaterem külső ajtajának nyitva hagyása - 2 pont</li>
            </ul>
            <br />
            <p>
              Egyéb kihágásokért a körvezetőség egyéni megítélése szerint járhat
              büntetőpont.
              <br />A szabályzat megváltoztatásának jogát fenntartjuk.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RulesPage;
