import * as express from "express";
import * as http from "http";
import * as io from "socket.io";
import * as process from "process";

export class Application {
    private app: express.Application;
    private server: http.Server;
    private io: SocketIO.Server;

    constructor() {
        this.app = express();
        this.server = http.createServer(this.app);
        this.io = io(this.server);

        this.routes();
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

    private routes() {
        this.app.use("/", this.static("wwwroot"));
        this.app.use("/js", this.static("node_modules/bootstrap/dist/js"));
        this.app.use("/js", this.static("node_modules/jquery/dist"));
        this.app.use("/js", this.static("node_modules/jquery-ui-dist"));
        this.app.use("/css", this.static("node_modules/bootstrap/dist/css"));
        this.app.use("/css", this.static("node_modules/jquery-ui-dist"));
        this.app.use("/fonts", this.static("node_modules/bootstrap/fonts"));
        this.app.get("/", (req, res) => res.sendFile("index.html"));
    }

    private static(path: string) {
        return express.static(__dirname + "/../../" + path);
    }
}
