var express = require("express");
var http = require("http");
var bodyParser = require("body-parser");
var crypto = require("crypto");
var fs = require("fs");
var process = require("child_process");
var path = require("path");
var git = require("nodegit");

var app = express();
var server = http.Server(app);
var jsonParser = bodyParser.json();
var secret = fs.existsSync("SECRET") ? fs.readFileSync("SECRET", "utf8").trim() : "";

var verifySignature = function(req, res, next) {
    var hash = req.header("X-Hub-Signature");
    var hmac = crypto.createHmac("sha1", secret);

    req.on("data", function(data) {
        hmac.update(data);
    });

    req.on("end", function() {
        var crypted = hmac.digest("hex");
        if (crypted === hash) {
            return next();
        } else {
            return res.send("Invalid hash", { "Content-Type": "text/plain" }, 403);
        }
    });

    req.on("error", function(err) {
        return next(err);
    });
}

app.post("/notify", verifySignature, jsonParser, function(req, res) {
    console.log(req.body);
    process.spawnSync("forever", ["stop", "battleship"], { encoding: "utf8", shell: true });

    var repository;
    git.Repository.open(__dirname)
        .then(function(repo) {
            repository = repo;
            return repository.fetchAll({}, true);
        })
        .then(function() {
            repository.mergeBranches("master", "origin/master");
        });

    process.spawnSync("forever", ["start", "--uid", "battleship", "--killSignal", "SIGINT", "--append", "server.js"], { encoding: "utf8", shell: true });
    res.sendStatus(200);
});

server.listen(3001, function() {
    console.log("Listening on *:3001 ...");
});
