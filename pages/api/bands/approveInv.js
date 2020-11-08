import { connectToDatabase } from "../../../util/mongodb";

export default async (req, res) => {
  const { db } = await connectToDatabase();

  const band = await db
    .collection("bands")
    .findOne({ bandName: req.body.band });

  await db
    .collection("bands")
    .updateOne(
      { bandName: req.body.band, "users.user": req.body.user },
      {
        $set: {
          "users.$.status": 1
        }
      },
      function (err, res) {
        if (err) throw err;
      }
    );

  res.status(200).send("accepted");
};
