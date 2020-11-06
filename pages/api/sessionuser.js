import {withIronSession} from 'next-iron-session';
import {connectToDatabase} from '../../util/mongodb';

export default withIronSession(
    async (req, res) => {
        const {db} = await connectToDatabase();
        if(req.method === "POST"){
            const {userName, userPass} = req.body;

            const user = await db.collection('users').find({userName: userName}).toArray();

            if(userPass === user[0].userPass){
                req.session.set("user", { userName, userType: user[0].userType });
                await req.session.save();
                return res.status(200).send("");
            }

            return res.status(403).send("");
            
        }
        return res.status(404).send("not found");
    },{
        cookieName: "USERCOOKIE",
        cookieOptions: {
            secure: process.env.NODE_ENV === "production" ? true : false
        },
        password: process.env.APPLICATION_SECRET
    }
);