var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var process = require('process');
var config = require('./config');

// redirects
app.use('/', express.static(__dirname + '/wwwroot'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/fonts', express.static(__dirname + '/node_modules/bootstrap/fonts'));

// routing
app.get('/', function(req, res) {
    res.sendFile('index.html');
});

console.log('Battleship server: v%s', config.version);

// sockets.io
io.on('connection', function(socket) {
    console.log('connection opened [%s] ...', socket.id);
    socket.emit('server version', config.version);

    socket.on('identify', function(userName) {
        console.log("user identified: %s [%s]", userName, socket.id);
        io.emit('user connected', userName);

        socket.on('disconnect', function() {
            console.log('user `%s` disconnected', userName);
            io.emit('user disconnected', userName);
        });

        socket.on('chat message', function(text) {
            if (text.trim()) {
                io.emit('chat message', { userName: userName, text: text });
            }
        });
    });
});

// start server
http.listen(3000, function() {
    console.log('Listening on *:3000...');
});

process.on('SIGINT', function() {
    io.emit('server closed');
    process.exit(0);
});
