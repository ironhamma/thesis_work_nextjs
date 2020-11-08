import Sidebar from "../../../components/Sidebar/index";
import { connectToDatabase } from "../../../util/mongodb";
import io from "socket.io-client";
import { useState, useEffect } from "react";
import { withIronSession } from "next-iron-session";
import { useRouter } from "next/router";
import styles from "./MessagesPage.module.css";
import MessageHeader from "../../../components/MessageHeader";
import UserListPanel from "../../../components/UserListPanel";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import cn from "clsx";

export const getServerSideProps = withIronSession(
  async ({ req, res}) => {
    const user = req.session.get("user");
    console.log(req.query);

    if (!user) {
      res.statusCode = 404;
      res.end();
      return { props: {} };
    }
    const { db } = await connectToDatabase();
    const users = await db.collection("users").find({}).toArray();

    const messages = await db.collection("messages").find({between: `${user.userName}${req.query.username}`}).toArray();
    console.log(`${user.userName}${req.query.username}`);

    return {
      props: {
        users: JSON.parse(JSON.stringify(users)),
        messages: JSON.parse(JSON.stringify(messages)),
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

const socket = io();

function MessagesPage({ users, user, messages }) {
  const router = useRouter();
  const targetUser = router.query.username;
  const [messageState, setMessageState] = useState({
    message: "",
    from: user.userName,
    to: "",
  });
  const msgData = messages.messages === undefined ? [] : messages.messages;
  const [chatState, setChatState] = useState(msgData);

  console.log(messages);

  useEffect(() => {
    socket.on(
      `message${targetUser}${user.userName}`,
      ({ from, to, message }) => {
        if (from === targetUser && to === user.userName) {
          setChatState([...chatState, { from, to, message }]);
        }
      }
    );
  });

  const onTextChange = (e) => {
    setMessageState({ ...messageState, [e.target.name]: e.target.value });
  };

  const onMessageSubmit = (e) => {
    e.preventDefault();
    const { from, to, message } = messageState;
    socket.emit("message", { from: user.userName, to: targetUser, message });
    setChatState([...chatState, {from: user.userName, to: targetUser, message}]);
    setMessageState({ message: "", from: user.userName, to: targetUser });
  };

  const renderChat = () => {
    return chatState.map(({ from, to, message }, index) => (
      <div
        key={index}
        className={cn(styles.message, {
          [styles.inComing]: to === user.userName,
          [styles.outGoing]: to === targetUser,
        })}
      >
        <div className={styles.messageInner}>
          <div className={styles.messageText}>{message}</div>
          <div className={styles.fromUser}>{from}</div>
        </div>
      </div>
    ));
  };

  console.log(chatState);

  return (
    <div className={styles.container}>
      <MessageHeader />
      <div className={styles.bodyContainer}>
        <UserListPanel users={users} />
        <div className={styles.messagesBody}>
          <div className={styles.messages}>{renderChat()}</div>
          <div className={styles.messageForm}>
            <div className={styles.inputWrapper}>
              <Input
                onChange={(e) => onTextChange(e)}
                name="message"
                value={messageState.message}
              />
            </div>
            <Button onClick={(e) => onMessageSubmit(e)}>Küldés</Button>
          </div>
        </div>
      </div>
      {/* <form onSubmit={onMessageSubmit}>
                    <input type="text" onChange={e => onTextChange(e)} name="message" value={messageState.message} />   
                    <button type="submit">Küldés</button>
                </form> */}
    </div>
  );
}

export default MessagesPage;
