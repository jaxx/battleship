import * as express from "express";
import * as http from "http";
import * as fs from "fs";
import * as crypto from "crypto";
import * as bodyParser from "body-parser";
import * as childProcess from "child_process";
import * as path from "path";

interface SimpleGit {
    then: (x: () => void) => SimpleGit;
    pull: () => SimpleGit;
}

let simpleGit: SimpleGit = require("simple-git")(path.join(__dirname, ".."));

let app = express();
let server = http.createServer(app);
let secret = fs.existsSync("SECRET") ? fs.readFileSync("SECRET", "utf8").trim() : "";

function verifySignature(req: express.Request, res: express.Response, buf: Buffer) {
    let hash = req.header("X-Hub-Signature").trim().split("=");
    let crypted = crypto.createHmac(hash[0], secret).update(buf).digest("hex");
    if (crypted !== hash[1]) throw new Error("Invalid hash");
}

let jsonParser = bodyParser.json({ verify: verifySignature });

app.post("/notify", jsonParser, (req, res) => {
    console.log(req.body);
    res.sendStatus(200);

    simpleGit
        .then(() => childProcess.spawnSync("yarn", ["run", "stop-server"], { encoding: "utf8", shell: true }))
        .pull()
        .then(() => childProcess.spawnSync("yarn", ["run", "start-server"], { encoding: "utf8", shell: true }));
});

server.listen(3001, () => {
    console.log("Listening on *:3001 ...");
});
