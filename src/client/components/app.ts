import Vue = require("vue");
import Component from "vue-class-component";
import * as CommonMessages from "../../common/messages";
import * as ClientMessages from "../clientmessages";

@Component({
    template: require("./app.html")
})
export default class AppComponent extends Vue {
    socket = io();
    conversation: ClientMessages.Message[] = [];

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

        // Handles incoming chat message.
        this.socket.on("chat message", (m: CommonMessages.UserMessage & CommonMessages.ChatMessage) => {
            if ($.trim(m.text)) {
                this.conversation.push({ kind: "chat", message: m });
                /*text = escapeHtml(text).replace(/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/g, m => {
                    return "<a href=\"" + m + "\" target=\"_blank\">" + m + "</a>";
                }).populateEmoticons();
                let $messages = $("#messages");
                $messages.append(
                    $("<li>")
                        .addClass("list-group-item")
                        .append($("<span>").addClass("badge").text(m.time))
                        .append($("<h4>").addClass("list-group-item-heading").text(m.username))
                        .append($("<p>").addClass("list-group-item-text").html(text)));
                $messages.parent().animate({ scrollTop: $messages.parent()[0].scrollHeight }, "slow");*/
            }
        });
    }
}
