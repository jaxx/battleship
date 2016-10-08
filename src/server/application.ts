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
}
