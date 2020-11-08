import { connectToDatabase } from "../../../util/mongodb";
import {ObjectId} from "mongodb";


export default async (req, res) => {
  const { db } = await connectToDatabase();

    const {_id, ...rest} = req.body;

    const updateData = rest;

  await db.collection("users").updateOne(
    { _id: ObjectId(_id) },
    { $set: { ...updateData } },
    function (err, res) {
      if (err) throw err;
    }
  );

  res.status(200).send("updated");
};
