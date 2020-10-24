export default (req, res) => {
    console.log(req.method);
    if(req.method === 'GET'){
    console.log(req.query);
        if(req.query['hub.verify_token'] === "szabobeno") {
            res.send(req.query['hub.challenge']);
        }
    }
    if(req.method === 'POST'){
        const messaging_events = req.body.entry[0].messaging_events;
        console.log(messaging_events);
        for(let i = 0; i < messaging_events.length; ++i){
            let event = messaging_events[i];
            let sender = event.sender.id;
            if(event.message && event.message.text){
                let text = event.message.text
                fetch("https://graph.facebook.com/v2.6/me/messages", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({recipient: {id: sender}, message: text}),
                    headers: {access_token: "EAAJJRzK9rB4BADZBSbKnHZAD2aFOZBjkse3lZA1KNils5ZBp0nYE8ePcdjACXADOp3ZATDIi5ZBdpqtyHTzYl8ilGpurystyhZCbGRZCrOKQZAYbJDuGR5hZB37Wn37Nwmwo0wTkCekUleLf4K69cTmHqzgOKwnmfMigHtwZCf1twyBjXp9u7ZCce4OMyODaOkp2ZCuOoZD"}
                  });
            }
        }
        res.status(200).send('OK');
    }
}