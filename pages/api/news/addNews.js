import { connectToDatabase } from "../../../util/mongodb";

export default async (req, res) => {
  const { db } = await connectToDatabase();


  await db.collection("news").insertOne(
    { text: req.body.newsText, heading: req.body.newsHeading, createdAt: new Date().toString()},
    function (err, res) {
      if (err) throw err;
      console.log("doc created");
    }
  );

  res.status(200).send("news created");
};
