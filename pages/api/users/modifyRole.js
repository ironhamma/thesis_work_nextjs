import { connectToDatabase } from "../../../util/mongodb";
import {ObjectId} from "mongodb";


export default async (req, res) => {
  const { db } = await connectToDatabase();

  const user = await db
    .collection("users")
    .findOne({ userName: req.body.userName });

  await db.collection("users").updateOne(
    { _id: ObjectId(user._id) },
    { $set: { userType: [1,2,3].includes(user.userType) ? 4 : 1 } },
    function (err, res) {
      if (err) throw err;
    }
  );

  res.status(200).send("updated");
};
