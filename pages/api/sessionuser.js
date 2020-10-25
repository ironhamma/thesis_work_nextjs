import {withIronSession} from 'next-iron-session';
import {connectToDatabase} from '../../util/mongodb';

export default withIronSession(
    async (req, res) => {
        console.log(req.method);
        const {db} = await connectToDatabase();
        if(req.method === "POST"){
            console.log("hello post");
            const {userName, userPass} = req.body;

            const user = await db.collection('users').find({userName: userName}).toArray();

            if(userPass === user[0].userPass){
                req.session.set("user", { userName, isAdmin: user[0].isAdmin });
                await req.session.save();
                return res.status(200).send("");
            }

            return res.status(403).send("");
            
        }
        console.log("IM HERE");
        return res.status(404).send("not found");
    },{
        cookieName: "USERCOOKIE",
        cookieOptions: {
            secure: process.env.NODE_ENV === "production" ? true : false
        },
        password: process.env.APPLICATION_SECRET
    }
);