import Sidebar from "../components/Sidebar";
import { withIronSession } from "next-iron-session";
import { connectToDatabase } from "../util/mongodb";
import PageTitle from "../components/PageTitle";
import styles from "./ProfilePage.module.css";
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

    const sessUser = await db
      .collection("users")
      .find({ userName: user.userName })
      .toArray();

    return {
      props: {
        user,
        sessUser: { ...sessUser[0], _id: sessUser[0]._id.toString() },
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
  const router = useRouter();
  const { handleSubmit, errors, reset, control } = useForm({
    defaultValues: {
      userName: sessUser.userName,
      userFirstName: sessUser.userFirstName,
      userSecondName: sessUser.userSecondName,
      userMail: sessUser.userMail,
      userRoom: sessUser.userRoom,
      userTel: sessUser.userTel,
      userInstitute: sessUser.userInstitute,
      userDorm: sessUser.userDorm
    },
  });

  const {
    handleSubmit: handleReserve,
    errors: reserveErrors,
    reset: reserveReset,
    control: ReserveControl,
  } = useForm({
    defaultValues: {
      reserveCode: sessUser.reserveCode === undefined ? "Még nem használtad a Messenger chatbotot!" : sessUser.reserveCode,
    },
  });

  const onDataSubmit = async (result) => {
    console.log(sessUser);
    const updateData = {_id: sessUser._id, ...result}
    const response = await fetch("/api/users/modifyUser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...updateData }),
    });

    if (response.ok) {
      return router.push("/profile");
    }
  }

  console.log(sessUser.reserveCode);

  return (
    <div className="pageContainer">
      <Sidebar user={user} />
      <div className={styles.root}>
        <PageTitle>Profilom</PageTitle>
        <div className="containerFlex">
          <div className="profileInfoBox">
            <h2>Általános adataim</h2>
              <Controller
                name="userName"
                title="Felhasználónév"
                control={control}
                as={Input}
                disabled
              />
              <Controller
                name="userSecondName"
                title="Vezetéknév"
                control={control}
                as={Input}
                disabled
              />
              <Controller
                name="userFirstName"
                title="Keresztnév"
                control={control}
                as={Input}
                disabled
              />
              <Controller
                name="userMail"
                title="Email"
                control={control}
                as={Input}
              />
              <Controller
                name="userRoom"
                title="Szoba"
                control={control}
                as={Input}
              />
              <Controller
                name="userTel"
                title="Telefon"
                control={control}
                as={Input}
              />
              <Controller
                name="userInstitute"
                title="Kar"
                control={control}
                as={Input}
              />
              <Controller
                name="userDorm"
                title="Kollégium"
                control={control}
                as={Input}
              />
              <Button onClick={handleSubmit(onDataSubmit)}>Mentés</Button>
          </div>
          <div className="profileInfoBox">
            <h2>Foglalási adataim</h2>
              <Controller
                name="reserveCode"
                title="Foglalási kód"
                control={ReserveControl}
                as={Input}
                disabled={sessUser.reserveCode === undefined}
              />
              <Button onClick={handleReserve(onDataSubmit)}>Mentés</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
