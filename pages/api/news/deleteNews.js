import { connectToDatabase } from "../../../util/mongodb";
import {ObjectId} from "mongodb";

export default async (req, res) => {
  const { db } = await connectToDatabase();

  console.log(req.body);

  await db.collection("news").deleteOne(
    { _id: ObjectId(req.body.newsId)},
    function (err, res) {
      if (err) throw err;
      console.log("doc deleted");
    }
  );

  res.status(200).send("news deleted");
};
