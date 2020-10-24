const expressApp = require('express')();
const server = require('http').Server(expressApp);
const io = require('socket.io')(server);
const next = require('next');

const PORT = 3000;
const dev = true;
const nextApp = next({dev});
const nextHandler = nextApp.getRequestHandler();

io.on('connection', (socket) => {
    console.log('socket connected');
    socket.emit('now', {
        message: 'Socket.io is on 😏'
    });

    socket.on('receive', (msg) => {
        socket.emit('send', {
            message: msg + ' from socket'
        });
        console.log('message: ' + msg);
    })

    socket.on('disconnect', () => {
        console.log('socket disconnected');
    })
});

nextApp.prepare().then(() => {
   /*  const reserveRoutes = require('./routes/reserve/index.js'); */
   /*  server.use('/api',reserveRoutes); */

   


    expressApp.get("*", (req, res) => {
        return nextHandler(req, res);
    });

    expressApp.post("*", (req, res) => {
        return nextHandler(req, res);
    })

    server.listen(PORT, (err) => {
        if(err) throw err;
        console.log(`Server running on ${PORT}.`);
    })
}).catch(ex => {
    console.error(ex.stack);
    process.exit(1);
})