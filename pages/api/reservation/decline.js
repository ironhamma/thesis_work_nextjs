import { connectToDatabase } from "../../../util/mongodb";
import { ObjectId } from "mongodb";

export default async (req, res) => {
  const { db } = await connectToDatabase();

  await db
    .collection("reservations")
    .updateOne(
      { _id: ObjectId(req.body.reservationId) },
      { $set: { status: 3 } },
      function (err, res) {
        if (err) throw err;
      }
    );

  res.status(200).send("declined");
};
