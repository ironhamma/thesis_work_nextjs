import {connectToDatabase} from '../../util/mongodb';
import FormData from "form-data";
import {applySession} from "next-iron-session";

export default async (req, res) => {
    
    
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Basic NTg5NzU2MDg1MDMxNDYwNzUzMzM6dnpYd2JqQ29aa2NiNGFUcUxqYjdJOWxOYm52OEZLYjFBeW5iWXBHeVBpUEowajFLSVJIUlBzZXJWUXBiYUdSYTY1M1RrOUgxaFhBZzcxcUY=");

    var formdata = new FormData();
    formdata.append("grant_type", "authorization_code");
    formdata.append("code", req.query.code);

    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: formdata,
    redirect: 'follow'
    };

    const resp = await fetch("https://auth.sch.bme.hu/oauth2/token", requestOptions);

    const act = JSON.parse(await resp.text()).access_token;

    const user = await (await fetch("https://auth.sch.bme.hu/api/profile/?access_token=" + act)).text();

    const userObj = JSON.parse(user);
    
    const {db} = await connectToDatabase();

    const userLogin = await db.collection('users').findOne({userName: userObj.linkedAccounts.schacc});
    
    if(userLogin !== null){
        await applySession(req, res, {
            cookieName: "USERCOOKIE",
            cookieOptions: {
                secure: process.env.NODE_ENV === "production" ? true : false
            },
            password: process.env.APPLICATION_SECRET
        });
        await req.session.set("user", {userName: userLogin.userName, userType: userLogin.userType});
        await req.session.save();
        res.writeHead(302, {
            'Location': "https://szabobenike.sch.bme.hu/"
        });
        res.end();
    } else {
        await db.collection('users').insertOne({
            userName: userObj.linkedAccounts.schacc,
            userPass: "asdf1234",
            userFirstName: userObj.givenName,
            userSecondName: userObj.sn,
            userMail: userObj.mail,
            userTel: userObj.mobile,
            fbLoggingIn: false,
            fbLoggedIn: false,
            userType: 4
        }, (err, res) => {
            if(err) throw err;
            console.log(`${req.body.userName} document inserted!`);
        });
    }
}