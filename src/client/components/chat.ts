import Vue = require("vue");
import Component from "vue-class-component";
import { Message} from "../clientmessages";

@Component({
    template: require("./chat.html"),
    props: {
        conversation: Array
    }
})
export default class ChatComponent extends Vue {
    message: string = "";

    conversation: Message[];

    sendMessage (): void {
        const msg = $.trim(this.message);
        this.message = "";
        if (msg) this.$emit("send-message", msg);
    }
}
