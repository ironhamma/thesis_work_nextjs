import Sidebar from "../components/Sidebar/index";
import { connectToDatabase } from "../util/mongodb";
import io from "socket.io-client";
import { useState, useEffect } from "react";
import { withIronSession } from "next-iron-session";
import { useRouter } from "next/router";
import styles from "./MessagesPage.module.css";
import MessageHeader from "../components/MessageHeader";
import UserListPanel from "../components/UserListPanel";
import Input from "../components/Input";
import Button from "../components/Button";
import cn from "clsx";

export const getServerSideProps = withIronSession(
  async ({ req, res}) => {
    const user = req.session.get("user");
    if (!user) {
      res.statusCode = 404;
      res.end();
      return { props: {} };
    }
    const { db } = await connectToDatabase();
    const users = await db.collection("users").find({}).toArray();

    return {
      props: {
        users: JSON.parse(JSON.stringify(users)),
        user
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

function MessagesPage({ users, user}) {
  const router = useRouter();
  const [messageState, setMessageState] = useState({
    message: "",
    from: user.userName,
    to: "",
  });
  const [chatState, setChatState] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");

  useEffect(() => {
    socket.on(
      `message${selectedUser}${user.userName}`,
      ({ from, to, message }) => {
        if (from === selectedUser && to === user.userName) {
          setChatState([...chatState, { from, to, message }]);
        }
      }
    );
  });

  const onTextChange = (e) => {
    setMessageState({ ...messageState, [e.target.name]: e.target.value });
  };

  const onMessageSubmit = async (e) => {
    e.preventDefault();
    const { from, to, message } = messageState;
    socket.emit("message", { from: user.userName, to: selectedUser, message });
    setChatState([...chatState, {from: user.userName, to: selectedUser, message}]);
    setMessageState({ message: "", from: user.userName, to: selectedUser });
    const response = await fetch("/api/messages/addMessage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ from: user.userName, to: selectedUser, message: message})
    });
    console.log(response);
  };

  const renderChat = () => {
    return chatState.map(({ from, to, message }, index) => (
      <div
        key={index}
        className={cn(styles.message, {
          [styles.inComing]: to === user.userName,
          [styles.outGoing]: to === selectedUser,
        })}
      >
        <div className={styles.messageInner}>
          <div className={styles.messageText}>{message}</div>
          <div className={styles.fromUser}>{from}</div>
        </div>
      </div>
    ));
  };

  const getMessages = async (username) => {
    setSelectedUser(username);
    const response = await fetch("/api/messages/getMessages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userone: username, usertwo: user.userName })
    });

    const data = await response.json();
    console.log(data);

    if (response.ok) {
      setChatState(data.messages === undefined ? [] : data.messages);
    }
  }

  console.log(chatState);

  return (
    <div className={styles.container}>
      <MessageHeader />
      <div className={styles.bodyContainer}>
        <UserListPanel users={users} onClick={getMessages} selectedUser={selectedUser}/>
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
    </div>
  );
}

export default MessagesPage;
