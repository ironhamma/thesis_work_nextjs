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

            console.log(req.body)
            console.log(user[0].userPass);
            console.log(userPass)

            if(userPass === user[0].userPass){
                req.session.set("user", { userName });
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