import {connectToDatabase} from '../../util/mongodb';

export default async(req, res) => {

    const {db} = await connectToDatabase();
    await db.collection('users').insertOne({
        userName: req.body.userName,
        userPass: req.body.userPass,
        userFirstName: req.body.userFirstName,
        userSecondName: req.body.userSecondName,
        userMail:  req.body.userMail,
        userTel: req.body.userTel,
        userDorm: req.body.userDorm,
        userRoom: req.body.userRoom,
        userInstitute: req.body.userInstitute,
        isAdmin: false
    }, (err, res) => {
        if(err) throw err;
        console.log(`${req.body.userName} document inserted!`);
    });

    return res.status(200).send("OK");
}