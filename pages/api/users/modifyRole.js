import { connectToDatabase } from "../../../util/mongodb";
import {ObjectId} from "mongodb";


export default async (req, res) => {
  const { db } = await connectToDatabase();

  const user = await db
    .collection("users")
    .findOne({ userName: req.body.userName });

  await db.collection("users").updateOne(
    { _id: ObjectId(user._id) },
    { $set: { isAdmin: !user.isAdmin } },
    function (err, res) {
      if (err) throw err;
    }
  );

  res.status(200).send("updated");
};
