import Vue = require("vue");
import Component from "vue-class-component";

@Component({
    template: require("./chat.html"),
    props: {
        message: String
    }
})
export default class ChatComponent extends Vue {
    message: string;

    msg: string = this.message || "Hello!";

    onClick (): void {
        window.alert(this.msg);
    }
}
