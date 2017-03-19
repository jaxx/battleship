import Vue = require("vue");
import { Component, Watch } from "vue-property-decorator";

import * as CommonMessages from "../../common/messages";
import * as ClientMessages from "../clientmessages";

import { store } from "../store";

@Component({
    store: store
})
export default class App extends Vue {
    socket = io();
    conversation: ClientMessages.Message[] = [];
    version: string = "";
    isConnected: boolean = false;

    sendMessage(msg: string) {
        this.socket.emit("chat message", msg);
    }

    mounted() {
        this.socket.on("user connected", (m: CommonMessages.UserMessage) => {
            this.conversation.push({ kind: "connect", message: m });
            this.socket.emit("list users");
        });

        this.socket.on("user disconnected", (m: CommonMessages.UserMessage) => {
            this.conversation.push({ kind: "disconnect", message: m })
            this.socket.emit("list users");
        });

        this.socket.on("chat message", (m: CommonMessages.UserMessage & CommonMessages.ChatMessage) => {
            if ($.trim(m.text)) {
                this.conversation.push({ kind: "chat", message: m });
            }
        });

        this.socket.on("server version", (version: string) => {
            this.isConnected = true;
            this.version = version;
            this.$emit("server-version", version);
        });
    }

    @Watch("isConnected")
    isConnectedChanged(value: boolean) {
        if (value) {
            $(".server-closed-alert").hide("slow");
        }
    }
    
    @Watch("version")
    versionChanged(value: string, oldValue: string) {
        if (!!oldValue) {
            $(".upgrade-alert").show("slow");
        }
    }
}
