import * as express from "express";
import * as http from "http";
import * as io from "socket.io";
import * as process from "process";
import * as moment from "moment";

interface User {
    username: string;
    socket: SocketIO.Socket;
}

function getts() {
    return moment().format("DD.MM.YYYY HH:mm:ss");
}

export class Application {
    private app: express.Application;
    private server: http.Server;
    private io: SocketIO.Server;
    private version: string;

    private users: { [id: string]: User; } = {};

    constructor(version: string) {
        this.app = express();
        this.server = http.createServer(this.app);
        this.io = io(this.server);
        this.version = version;

        this.config();
        this.routes();
        this.handler();

        console.log("Battleship server: v%s", this.version);
    }

    public run() {
        this.server.listen(3000, () => {
            console.log("Listening on *:3000...");
        });

        process.on("SIGINT", () => {
            this.io.emit("server closed");
            process.exit(0);
        });
    }

    private config() {

    }

    private routes() {
        this.app.use("/", this.static("wwwroot"));
        this.app.use("/js", this.static("node_modules/bootstrap/dist/js"));
        this.app.use("/js", this.static("node_modules/jquery/dist"));
        this.app.use("/js", this.static("node_modules/jquery-ui-dist"));
        this.app.use("/js", this.static("node_modules/vue/dist"));
        this.app.use("/js", this.static("node_modules/vue-class-component/dist"))
        this.app.use("/css", this.static("node_modules/bootstrap/dist/css"));
        this.app.use("/css", this.static("node_modules/jquery-ui-dist"));
        this.app.use("/fonts", this.static("node_modules/bootstrap/fonts"));
        this.app.get("/", (req, res) => res.sendFile("index.html"));
    }

    private handler() {
        this.io.on("connection", (socket) => {
            console.log("connection opened [%s] ...", socket.id);
            socket.emit("server version", this.version);

            socket.on("identify", (username: string) => {
                socket.removeAllListeners("identify");
                this.users[username] = { username: username, socket: socket };

                console.log("user identified: %s [%s]", username, socket.id);
                this.io.emit("user connected", { username: username, time: getts() });
                socket.emit("users", Object.keys(this.users));

                socket.on("disconnect", () => {
                    delete this.users[username];
                    console.log("user `%s` disconnected", username);
                    this.io.emit("user disconnected", { username: username, time: getts() });
                });

                socket.on("chat message", (text: string) => {
                    if (text.trim()) {
                        this.io.emit("chat message", { username: username, text: text, time: getts() });
                    }
                });

                socket.on("list users", () => {
                    socket.emit("users", Object.keys(this.users));
                });
            });
        });
    }

    private static(path: string) {
        return express.static(__dirname + "/../" + path);
    }
}
