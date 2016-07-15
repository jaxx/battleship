var express = require("express");
var http = require("http");
var bodyParser = require("body-parser");
var crypto = require("crypto");
var fs = require("fs");
var process = require("child_process");
var git = require("nodegit");

var app = express();
var server = http.Server(app);
var secret = fs.existsSync("SECRET") ? fs.readFileSync("SECRET", "utf8").trim() : "";

var verifySignature = function(req, res, buf) {
    var hash = req.header("X-Hub-Signature").trim().split("=");
    var crypted = crypto.createHmac(hash[0], secret).update(buf).digest("hex");
    if (crypted !== hash[1]) throw new Error("Invalid hash");
};

var jsonParser = bodyParser.json({ verify: verifySignature });

app.post("/notify", jsonParser, function(req, res) {
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
