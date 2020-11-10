import { connectToDatabase } from "../../../util/mongodb";

export default async (req, res) => {
  const { db } = await connectToDatabase();

    const chat = await db.collection("messages").findOne({between: { $all: [req.body.from, req.body.to] }});

    if(chat === null){
        await db.collection("messages").insertOne({
            between: [req.body.from, req.body.to],
            messages: [{sent_at: new Date(), from: req.body.from, to: req.body.to, message: req.body.message}]
        });
    } else {
        await db.collection("messages").updateOne(
            { between: { $all: [req.body.from, req.body.to] } },
            {
            $push: { messages: {
                            sent_at: new Date(),
                            from: req.body.from,
                            to: req.body.to,
                            message: req.body.message
                        }
                    }
            },
            function (err, res) {
                if (err) throw err;
            }
        );
    }

  res.status(200).send("Message added");
};
