var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// redirects
app.use('/', express.static(__dirname + '/wwwroot'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));

// routing
app.get('/', function(req, res) {
    res.sendFile('index.html');
});

// sockets.io
io.on('connection', function(socket) {
    console.log('user connected...');

    socket.on('disconnect', function() {
        console.log('user disconnected');
    });

    socket.on('chat message', function(msg){
        io.emit('chat message', msg);
    });
});

// start server
http.listen(3000, function() {
    console.log('Listening on *:3000...');
});