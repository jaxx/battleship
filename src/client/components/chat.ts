import Vue = require("vue");
import Component from "vue-class-component";

@Component({
    template: `<button @click="onClick">Click!</button>`
})
export default class ChatComponent extends Vue {
    message: string = "Hello!";

    onClick (): void {
        window.alert(this.message);
    }
}
