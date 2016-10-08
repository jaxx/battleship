var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var process = require("process");
var config = require("./config");
var moment = require("moment");

console.log("Battleship server: v%s", config.version);

function getts() {
    return moment().format("DD.MM.YYYY HH:mm:ss");
}

var users = {};

// sockets.io
io.on("connection", function(socket) {
    console.log("connection opened [%s] ...", socket.id);
    socket.emit("server version", config.version);

    socket.on("identify", function(username) {
        socket.removeAllListeners("identify");
        users[username] = { username: username, socket: socket };

        console.log("user identified: %s [%s]", username, socket.id);
        io.emit("user connected", { username: username, time: getts() });
        socket.emit("users", Object.keys(users));

        socket.on("disconnect", function() {
            delete users[username];
            console.log("user `%s` disconnected", username);
            io.emit("user disconnected", { username: username, time: getts() });
        });

        socket.on("chat message", function(text) {
            if (text.trim()) {
                io.emit("chat message", { username: username, text: text, time: getts() });
            }
        });

        socket.on("list users", function() {
            socket.emit("users", Object.keys(users));
        });
    });
});

// start server
http.listen(3000, function() {
    console.log("Listening on *:3000...");
});

process.on("SIGINT", function() {
    io.emit("server closed");
    process.exit(0);
});
