import request from "request";
import superagent from "superagent";

let messagingPhase = 0;

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
        console.log(webhook_event);

        // Get the sender PSID
        let sender_psid = webhook_event.sender.id;
        console.log("Sender PSID: " + sender_psid);

        // Check if the event is a message or postback and
        // pass the event to the appropriate handler function
        if (webhook_event.message) {
          await handleMessage(sender_psid, webhook_event.message);
        } else if (webhook_event.postback) {
          console.log("else");
          await handlePostback(sender_psid, webhook_event.postback);
        }
      });
      res.status(200).send("EVENT RECEIVED!");
    } else {
      // Return a '404 Not Found' if event is not from a page subscription
      res.sendStatus(404);
      console.log("else");
    }
  }
};

async function handleMessage(sender_psid, received_message) {
  let response;

  switch (messagingPhase) {
    case 0:
      console.log(messagingPhase);
      if (received_message.text) {
        response = {
          text: `Próbaterem foglaláshoz kérlek add meg a foglalási azonosítódat!`,
        };
        messagingPhase++;
      }
      break;
    case 1:
      console.log(messagingPhase);
      if (received_message.text) {
        response = {
          attachment: {
            type: "template",
            payload: {
              template_type: "generic",
              elements: [
                {
                  title: "2020.10.26.",
                  subtitle: "Válassz dátumot!",
                  buttons: [
                    {
                      type: "postback",
                      title: "Kiválasztom!",
                      payload: "yes",
                    },
                  ],
                },
                {
                  title: "2020.10.26.",
                  subtitle: "Válassz dátumot!",
                  buttons: [
                    {
                      type: "postback",
                      title: "Kiválasztom!",
                      payload: "yes",
                    },
                  ],
                },
              ],
            },
          },
        };
        messagingPhase++;
      }
      break;
    case 2:
      console.log(messagingPhase);
      if (received_message.text) {
        response = {
          text: `You sent a text! This: ${received_message.text}`,
        };
      }
      break;
    case 3:
      break;
    case 4:
      break;
    case 5:
      break;
    case 6:
      break;
    case 7:
      break;
    default:
      break;
  }

  await callSendAPI(sender_psid, response);
}

function handlePostback(sender_psid, received_postback) {
  let response;

  // Get the payload for the postback
  let payload = received_postback.payload;

  // Set the response based on the postback payload
  if (payload === "yes") {
    response = { text: "Thanks!" };
  } else if (payload === "no") {
    response = { text: "Oops, try sending another box." };
  }
  // Send the message to acknowledge the postback
  callSendAPI(sender_psid, response);
}

async function callSendAPI(sender_psid, response) {
  console.log('I reached this');
  let request_body = {
    recipient: {
      id: sender_psid,
    },
    message: response,
  };

  /* const resp = await fetch("https://graph.facebook.com/v2.6/me/messages?access_token=EAAFMZAXKbBgwBADCFJ09P2wMk9qyZBEGkkdQPv92lH1vlQlP40JJ2wjHoYy6gem0ZCEvr4dv3q3s4e3v23CZBGKQDeUIHImnReMjXVxvZB7RFxYux1vU5sjGAEplYQZCeMxiTtQppMOqxNZBnNpgBcQGxwCE0bFJS6BdLfiObgwxZAG3d2AyWYRJ3ED4ldqXHGoZD", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request_body)
  });

  if(resp.ok){
    console.log('IT WORKED!');
  } */

  /* await request(
    {
      uri: "https://graph.facebook.com/v2.6/me/messages",
      qs: { access_token: process.env.FB_PAGE_TOKEN },
      method: "POST",
      json: request_body,
    },
    (err, res, body) => {
      console.log(res);
      console.log(body);
      if (!err) {
        console.log("Message sent!");
      } else {
        console.log("Unable to send message! " + err);
      }
    }
  ); */

  await superagent
  .post('https://graph.facebook.com/v2.6/me/messages')
  .query({access_token: process.env.FB_PAGE_TOKEN})
  .set({ "Content-Type": "application/json" })
  .send(JSON.stringify(request_body))
  .end((err, res) => {
    console.log("Elküldtem");
    console.log(res);
  });

  console.log('behivtam a fb-hez');
}
