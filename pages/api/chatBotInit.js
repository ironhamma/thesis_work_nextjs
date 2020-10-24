export default async(req, res) => {
    if(req.method === "GET"){
        if(req.query['hub.verify_token'] === "szabobeno") {
            res.send(req.query['hub.challenge']);
        }
        res.send('Wrong token');
    }
}