import Sidebar from "../components/Sidebar/index";
import { connectToDatabase } from '../util/mongodb';
import io from 'socket.io-client';
import {useState, useEffect} from 'react';
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
  const socket = io();

function MessagesPage({users, user}) {

    const [messageState, setMessageState] = useState({message: '', from: user.userName, to: ''});
    const [chatState, setChatState] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');

    useEffect(() => {
      socket.on(`message${user.userName}`, ({ from, to, message}) => {
        console.log(`${from} - ${to} - ${message}`);
        if(from === selectedUser){
          setChatState([...chatState, {from, to, message}]);
        }
      });
    });

    const onTextChange = e => {
      setMessageState({...messageState, [e.target.name]: e.target.value });
    };

    const onMessageSubmit = e => {
      e.preventDefault();
      const { from, to, message } = messageState;
      socket.emit('message', {from: user.userName, to: selectedUser, message});
      setMessageState({message: '', from: user.userName, to: selectedUser});
    };

    const renderChat = () => {
      return chatState.map(({from, to, message}, index) => (
        <div key={index}>
          {from === selectedUser && <h3>
            {from}: <span>{message}</span>
          </h3>}
        </div>
      ))
    };

  return (
    <div className="container">
            <div className="messageUsersPanel">
                <h1>Üzeneteim of {user.userName}</h1>
                <ul>
                    {
                        users.map((e) => e.userName === user.userName ? (
                            <li className="disabledUser">
                                {e.userName}
                            </li>
                        ) : (
                            <li onClick={() => setSelectedUser(e.userName)} className={e.userName === selectedUser ? "activeUser" : "nonActiveUser"}>
                                {e.userName}
                            </li>
                        ))
                    }
                </ul>
            </div>
            <div className="messageBodyContainer">
                <div className="messagesBody">
                    {renderChat()}
                </div>
                <form onSubmit={onMessageSubmit}>
                    <input type="text" onChange={e => onTextChange(e)} name="message" value={messageState.message} />   
                    <button type="submit">Küldés</button>
                </form>
            </div>
        </div>
  );
}

export default MessagesPage;
