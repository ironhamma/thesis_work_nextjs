import { connectToDatabase } from "../../../util/mongodb";

export default async (req, res) => {
  const { db } = await connectToDatabase();

  const band = await db
    .collection("bands")
    .findOne({ bandName: req.body.band });

    console.log(band.users);

  await db
    .collection("bands")
    .update(
      { bandName: req.body.band },
      {
          $pull:{ users: {user: req.body.removed}}
      },
      function (err, res) { 
        if (err) throw err;
      }
    );

  res.status(200).send("removed");
};
