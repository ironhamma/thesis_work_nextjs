import {connectToDatabase} from '../../util/mongodb';

export default async (req, res) => {
  if (req.method === "GET") {
    console.log(req.method);

    const VERIFY_TOKEN = "szabobeno";
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode && token) {
      if (mode === "subscribe" && token === VERIFY_TOKEN) {
        console.log("Webhook verified!");
        res.status(200).send(challenge);
      } else {
        res.sendStatus(403);
      }
    }
  }

  if (req.method === "POST") {
    const body = req.body;

    if (body.object === "page") {
      await body.entry.forEach(async function (entry) {
        // Gets the body of the webhook event
        let webhook_event = entry.messaging[0];
        //console.log(webhook_event);

        // Get the sender PSID
        let sender_psid = webhook_event.sender.id;

        // Check if the event is a message or postback and
        // pass the event to the appropriate handler function
        if (webhook_event.message) {
          await handleMessage(sender_psid, webhook_event.message);
        } else if (webhook_event.postback) {
          await handlePostback(sender_psid, webhook_event.postback);
        }
      });
      res.status(200).send("EVENT RECEIVED!");
    } else {
      // Return a '404 Not Found' if event is not from a page subscription
      res.sendStatus(404);
    }
  }
};

async function handleMessage(sender_psid, received_message) {
  let response;
  const {db} = await connectToDatabase();
  const userWithId = await db.collection('users').findOne({reserveId: sender_psid});
  let userWithName = [];
  if(userWithId === null){
    userWithName = await db.collection('users').findOne({userName: received_message.text});
  }
  if (userWithId === null && userWithName === null){
    response = {
      text: `Szia! Úgy tűnik nem használtad még ezt a foglalási felületet. Kérlek add meg a felhasználóneved vagy regisztrálj az oldalon!`
    };
  } else if(userWithName !== null && userWithId === null){
    /* console.log(userWithName[0]); */
      response = {
        text: `Mivel a ${userWithName.userName} fiókkal még nem foglaltál itt, létrehoztunk neked egy foglalási számot. Ezt az MMMK oldalon találod a profilodban. Kérlek add meg!`
      };
      await db.collection('users').updateOne({"userName": received_message.text}, {$set: {"reserveId": sender_psid, "reserveCode": Math.floor(1000 + Math.random() * 9000).toString(), "fbLoggingIn": true}});
    }
  
  if(userWithId !== null && !userWithId.fbLoggingIn){
    response = {
      text: `Kérlek add meg a ${userWithId.userName} fiókhoz tartozó foglalási számodat!`
    };
    await db.collection('users').updateOne({"reserveId": sender_psid}, {$set: {"fbLoggingIn": true}});
  }
  
  if(userWithId !== null && userWithId.fbLoggingIn){
    const reservepass = await db.collection('users').findOne({"reserveId": sender_psid});
    console.log(parseInt(received_message.text));
    if(!isNaN(parseInt(received_message.text))){
      console.log(received_message.text);
      if(parseInt(received_message.text) === parseInt(reservepass.reserveCode)){
        response = {
          attachment: {
            type: "template",
            payload: {
              template_type:"button",
              text:`Siker! Mostmár foglalhatsz ${userWithId.userName} nevében.`,
              buttons:[
                {
                type:"postback",
                title:"Kiválasztom a zenekarom!",
                payload: "GET_BANDS"
              }]
            },
          },
        };
        await db.collection('users').updateOne({"reserveId": sender_psid}, {$set: {"fbLoggedIn": true}});
      } else{
        response = {
          text: `Hibás foglalási szám. Kérlek add meg újra.`
        };
      }
    } else {
      response = {
        text: `Kérlek add meg a foglalási számodat!`
      };
    }
  }

  await callSendAPI(sender_psid, response);
}

async function handlePostback(sender_psid, received_postback) {
  const {db} = await connectToDatabase();
  const user = await db.collection('users').findOne({"reserveId": sender_psid});

  let response;

  // Get the payload for the postback
  let payload = received_postback.payload;

  const availableDates = ["2020.11.16", "2020.11.17", "2020.11.18", "2020.11.19", "2020.11.20"];
  const mockHoursAM = ["2","3","4","5","6","7","8","9","10","11"];
  const mockHoursPM = ["12","13","14","15","16","17","18","19","20","21"];
  const mockBands = ["Mock band 1", "Mock band 2", "Mock band 3"];

  if(user.fbLoggedIn && new Date(payload.split("::")[1]) instanceof Date && !isNaN(new Date(payload.split("::")[1]).valueOf())){
    if(payload.split("::")[0] === "AM"){
      const hourOptions = mockHoursAM.map( e => ({
        title: `${e}:00 - ${parseInt(e) + 1}:00`,
        subtitle: payload.split("::")[1],
        buttons: [
          {
            type: "postback",
            title: "Kiválasztom!",
            payload: `${e}:00::${payload}`
          }
        ]
      }));
      response = {
        attachment: {
          type: "template",
          payload: {
            template_type: "generic",
            elements: hourOptions
          },
        },
      };
    } else if (payload.split("::")[0] === "PM"){
      const hourOptions = mockHoursPM.map( e => ({
        title: `${e}:00 - ${parseInt(e) + 1}:00`,
        subtitle: payload.split("::")[1],
        buttons: [
          {
            type: "postback",
            title: "Kiválasztom!",
            payload: `${e}:00::${payload}`
          }
        ]
      }));
      response = {
        attachment: {
          type: "template",
          payload: {
            template_type: "generic",
            elements: hourOptions
          },
        },
      };
    }
  }

  if(user.fbLoggedIn && payload === "GET_BANDS"){
    response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [
            {
              title: "Válassz zenekart!",
              buttons: mockBands.map(e => ({
                title: e,
                type: "postback",
                payload: "BAND::" + e
              }))
            }
          ]
        },
      },
    };
  }

  if(user.fbLoggedIn && payload.split("::")[0] === "BAND"){
    const messengerDateArray = availableDates.map(e => ({
      title: e,
      subtitle: `${payload.split("::")[1]} kiválasztva! Válassz dátumot!`,
      buttons: [
        {
          type: "postback",
          title: 'Délelőtt',
          payload: "AM::" + new Date(e).toString()
        },
        {
          type: "postback",
          title: 'Délután',
          payload: "PM::" + new Date(e).toString()
        }
      ]
    }));
    response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: messengerDateArray
        }
      }
    };
  }

  if(user.fbLoggedIn && payload.split("::").length === 3){
    response = {
      text: `Köszi, meg is vagyunk! :D Ha szeretnél újra foglalni, csak add meg a foglalási számod újra!`
    };
    await db.collection('users').updateOne({"reserveId": sender_psid}, {$set: {"fbLoggedIn": false, "fbLoggingIn": false}});
  }

  // Send the message to acknowledge the postback
  callSendAPI(sender_psid, response);
}

async function callSendAPI(sender_psid, response) {
  let request_body = {
    recipient: {
      id: sender_psid,
    },
    message: response,
  };

  const resp = await fetch("https://graph.facebook.com/v2.6/me/messages?access_token=EAAFMZAXKbBgwBADCFJ09P2wMk9qyZBEGkkdQPv92lH1vlQlP40JJ2wjHoYy6gem0ZCEvr4dv3q3s4e3v23CZBGKQDeUIHImnReMjXVxvZB7RFxYux1vU5sjGAEplYQZCeMxiTtQppMOqxNZBnNpgBcQGxwCE0bFJS6BdLfiObgwxZAG3d2AyWYRJ3ED4ldqXHGoZD", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request_body)
  });

  if(resp.ok){
    console.log("message delivered!");
  } else {
    console.log(resp);
  }
}
