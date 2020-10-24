export default async(req, res) => {
    console.log(req.query);
        if(req.query['hub.verify_token'] === "szabobeno") {
            res.send(req.query['hub.challenge']);
        }
        res.send('Wrong token');
}