import { connectToDatabase } from "../../../util/mongodb";

export default async (req, res) => {
  const { db } = await connectToDatabase();

  let msg = await db.collection("messages").findOne({between: { $all: [req.body.userone, req.body.usertwo]}});

  if(msg === null){
      res.status(200).json([]);
  } else{
      res.status(200).json(msg);
  }
};
