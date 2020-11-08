import {connectToDatabase} from '../../../util/mongodb';

export default async(req, res) => {
    const {db} = await connectToDatabase();

    await db.collection('reservations').insertOne({
        created_at: new Date(),
        reserveStartDate: req.body.start,
        reserveEndDate: req.body.end,
        assignee: null,
        status: 1,
        bandName: req.body.bandName,
        reservedBy: req.body.user
    }, (err, res) => {
        if(err) throw err;
        console.log(`reserve document inserted!`);
    });

    return res.status(200).send("OK");
}