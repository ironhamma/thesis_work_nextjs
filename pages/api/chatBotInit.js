export default async(req, res) => {
    console.log(req.query);
        if(req.query['hub.verify_token'] === "szabobeno") {
            await res.send(req.query['hub.challenge']);
        }
        await res.send('Wrong token');
}