import Sidebar from "../components/Sidebar/index";
import { connectToDatabase } from '../util/mongodb';
import io from 'socket.io-client';
import {useState} from 'react';
import { withIronSession } from 'next-iron-session';

export const getServerSideProps = withIronSession(
    async({req, res}) => {
      const user = req.session.get('user');
        
      if(!user) {
        res.statusCode = 404;
        res.end();
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

function MessagesPage({users, user}) {

    const socket = io();
    const [messages, setMessages] = useState([]);
    const [userMessage, setUserMessage] = useState("");
    socket.on('send', data => {
        console.log(data);
        let tmp = messages;
        tmp.push({text: data.message});
        setMessages(tmp);
    });
    console.log(messages);
    console.log(userMessage);

  return (
    <div className="container">
            <div className="messageUsersPanel">
                <h1>Üzeneteim of {user.userName}</h1>
                <ul>
                    {
                        users.map((e) => (
                            <li>
                                {e.userName}
                            </li>
                        ))
                    }
                </ul>
            </div>
            <div className="messageBodyContainer">
                <div className="messagesBody">
                    {
                        messages.map((e) => (
                            <div className="message">
                                <div className="messageText">
                                    {e.text}
                                </div>
                            </div>
                        ))
                    }
                </div>
                <form>
                    <input type="text" onChange={(e) => setUserMessage(e.target.value)}/>   
                    <div onClick={() => socket.emit('receive', userMessage)}>Küldés</div>
                </form>
            </div>
        </div>
  );
}

export default MessagesPage;
