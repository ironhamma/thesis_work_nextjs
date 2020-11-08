import { connectToDatabase } from "../../../util/mongodb";

export default async (req, res) => {
  const { db } = await connectToDatabase();

  const band = await db
    .collection("bands")
    .findOne({ bandName: req.body.bandName });

  await db
    .collection("bands")
    .updateOne(
      { bandName: req.body.bandName },
      {
        $set: {
          users: [
            ...band.users,
            { user: req.body.invited, status: 0, invitedBy: req.body.inviter },
          ],
        },
      },
      function (err, res) {
        if (err) throw err;
      }
    );

  res.status(200).send("updated");
};
