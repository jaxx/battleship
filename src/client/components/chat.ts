import Vue = require("vue");
import { Component, Prop, Watch } from "vue-property-decorator";

import { Message} from "../clientmessages";

let emoticonMap: { [id: string]: string; } = {
    "(clap)": "clapping",
    "(doh)": "doh",
    "(drunk)": "drunk",
    "(facepalm)": "facepalm",
    "(highfive)": "highfive",
    "(monkey)": "monkey",
    "(nerd)": "nerd",
    "(party)": "party",
    "(rofl)": "rofl",
    "(smirk)": "smirk",
    "(wait)": "wait",
    "(wave)": "hi",
    "(yawn)": "yawning"
};

let entityMap: { [id: string]: string; } = { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" };

const escapeHtml = (html: string) => {
    return String(html).replace(/[&<>"']/g, function (s) {
        return entityMap[s];
    });
};

const activateLinks = (html: string) => {
    return html.replace(/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/g, m => {
        return "<a href=\"" + m + "\" target=\"_blank\">" + m + "</a>";
    });
};

const emoticons = (html: string) => {
    return html.replace(/\(\w+\)/g, m => {
        var img = emoticonMap[m];
        if (img) {
            return "<img alt=\"" + m + "\" src=\"https://az705183.vo.msecnd.net/onlinesupportmedia/onlinesupport/media/skype/screenshots/fa12330/emoticons/" + img + "_80_anim_gif.gif\" />";
        }
        return m;
    });
};

@Component({
    filters: {
        escapeHtml,
        activateLinks,
        emoticons
    }
})
export default class Chat extends Vue {
    message: string = "";

    @Prop({ type: Array })
    conversation: Message[];

    sendMessage (): void {
        const msg = $.trim(this.message);
        this.message = "";
        if (msg) this.$emit("send-message", msg);
    }

    @Watch("conversation")
    conversationChanged() {
        const container = $(".chat__messages");
        container.animate({ scrollTop: container[0].scrollHeight }, "slow");
    }
}
