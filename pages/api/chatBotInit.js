import request from 'request';

export default (req, res) => {
    
    if(req.method === 'GET'){
        console.log(req.method);

        const VERIFY_TOKEN = "szabobeno"
        const mode = req.query['hub.mode'];
        const token = req.query['hub.verify_token'];
        const challenge = req.query['hub.challenge'];
    
        if(mode && token){
            if (mode === 'subscribe' && token === VERIFY_TOKEN){
                console.log('Webhook verified!');
                res.status(200).send(challenge);
            } else {
                res.sendStatus(403);
            }
        }
    }


    if(req.method === 'POST'){
        const body = req.body;

        if(body.object === 'page'){
            body.entry.forEach(function(entry) {

                // Gets the body of the webhook event
                let webhook_event = entry.messaging[0];
                console.log(webhook_event);
    
    
                // Get the sender PSID
                let sender_psid = webhook_event.sender.id;
                console.log('Sender PSID: ' + sender_psid);
    
                // Check if the event is a message or postback and
                // pass the event to the appropriate handler function
                if (webhook_event.message) {
                    handleMessage(sender_psid, webhook_event.message);
                } else if (webhook_event.postback) {
                    handlePostback(sender_psid, webhook_event.postback);
                }
    
            });

            res.status(200).send('EVENT_RECEIVED');
        } else {
            // Return a '404 Not Found' if event is not from a page subscription
            res.sendStatus(404);
        }
    }
}

function handleMessage(sender_psid, received_message){
    let response;

    if(received_message.text === "Szia"){
        response = {
            "attachment": {
              "type": "template",
              "payload": {
                "template_type": "generic",
                "elements": [{
                  "title": "Is this the right box?",
                  "subtitle": "Tap a button to answer.",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "Yes!",
                      "payload": "yes",
                    },
                    {
                      "type": "postback",
                      "title": "No!",
                      "payload": "no",
                    }
                  ],
                }]
              }
            }
          }
    } else {
        response = {
            "text" : `You sent a text! This: ${received_message.text}`
        }
    }

    callSendAPI(sender_psid, response);
}

function handlePostback(sender_psid, received_postback){
    let response;
  
    // Get the payload for the postback
    let payload = received_postback.payload;
  
    // Set the response based on the postback payload
    if (payload === 'yes') {
      response = { "text": "Thanks!" }
    } else if (payload === 'no') {
      response = { "text": "Oops, try sending another box." }
    }
    // Send the message to acknowledge the postback
    callSendAPI(sender_psid, response);
}

function callSendAPI(sender_psid, response){
    let request_body = {
        "recipient" : {
            "id" : sender_psid
        },
        "message" : response
    }
    request({
        "uri": "https://graph.facebook.com/v2.6/me/messages",
        "qs": {"access_token": process.env.FB_PAGE_TOKEN},
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if(!err){
            console.log('Message sent!');
        } else {
            console.log("Unable to send message! " + err);
        }
    })
}

/* 
function handleMessage(sender_psid, message) {
    //handle message for react, like press like button
    // id like button: sticker_id 369239263222822

    if( message && message.attachments && message.attachments[0].payload){
        callSendAPI(sender_psid, "Thank you for watching my video !!!");
        callSendAPIWithTemplate(sender_psid);
        return;
    }

    let entitiesArr = [ "wit$greetings", "wit$thanks", "wit$bye" ];
    let entityChosen = "";
    entitiesArr.forEach((name) => {
        let entity = firstTrait(message.nlp, name);
        if (entity && entity.confidence > 0.8) {
            entityChosen = name;
        }
    });

    if(entityChosen === ""){
        //default
        callSendAPI(sender_psid,`The bot is needed more training, try to say "thanks a lot" or "hi" to the bot` );
    }else{
       if(entityChosen === "wit$greetings"){
           //send greetings message
           callSendAPI(sender_psid,'Hi there! This bot is created by Hary Pham. Watch more videos on HaryPhamDev Channel!');
       }
       if(entityChosen === "wit$thanks"){
           //send thanks message
           callSendAPI(sender_psid,`You 're welcome!`);
       }
        if(entityChosen === "wit$bye"){
            //send bye message
            callSendAPI(sender_psid,'bye-bye!');
        }
    }
}

let callSendAPIWithTemplate = (sender_psid) => {
    // document fb message template
    // https://developers.facebook.com/docs/messenger-platform/send-messages/templates
    let body = {
        "recipient": {
            "id": sender_psid
        },
        "message": {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [
                        {
                            "title": "Want to build sth awesome?",
                            "image_url": "https://www.nexmo.com/wp-content/uploads/2018/10/build-bot-messages-api-768x384.png",
                            "subtitle": "Watch more videos on my youtube channel ^^",
                            "buttons": [
                                {
                                    "type": "web_url",
                                    "url": "https://bit.ly/subscribe-haryphamdev",
                                    "title": "Watch now"
                                }
                            ]
                        }
                    ]
                }
            }
        }
    };

    request({
        "uri": "https://graph.facebook.com/v6.0/me/messages",
        "qs": { "access_token": process.env.FB_PAGE_TOKEN },
        "method": "POST",
        "json": body
    }, (err, res, body) => {
        if (!err) {
            // console.log('message sent!')
        } else {
            console.error("Unable to send message:" + err);
        }
    });
};

function firstTrait(nlp, name) {
    return nlp && nlp.entities && nlp.traits[name] && nlp.traits[name][0];
}

function callSendAPI(sender_psid, response) {
    // Construct the message body
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message": { "text": response }
    };

    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v7.0/me/messages",
        "qs": { "access_token": process.env.FB_PAGE_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('message sent!');
        } else {
            console.error("Unable to send message:" + err);
        }
    });
}

function handlePostback(sender_psid, received_postback) {
    let response;

    // Get the payload for the postback
    let payload = received_postback.payload;

    // Set the response based on the postback payload
    if (payload === 'yes') {
        response = { "text": "Thanks!" }
    } else if (payload === 'no') {
        response = { "text": "Oops, try sending another image." }
    }
    // Send the message to acknowledge the postback
    callSendAPI(sender_psid, response);
} */