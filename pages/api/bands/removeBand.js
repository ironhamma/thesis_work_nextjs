import { connectToDatabase } from "../../../util/mongodb";

export default async (req, res) => {
  const { db } = await connectToDatabase();

  await db
    .collection("bands")
    .removeOne({ bandName: req.body.band }, function (err, res) {
      if (err) throw err;
    });

  res.status(200).send("removed");
};
