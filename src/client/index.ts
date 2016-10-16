import * as $ from "jquery";
import * as io from "socket.io-client";
import * as msg from "../common/messages";

declare global {
    interface String {
        populateEmoticons(): string;
    }
}

// Emoticon mappings:
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

String.prototype.populateEmoticons = function(this: string) {
    return this.replace(/\(\w+\)/g, m => {
        var img = emoticonMap[m];
        if (img) {
            return "<img alt=\"" + m + "\" src=\"https://az705183.vo.msecnd.net/onlinesupportmedia/onlinesupport/media/skype/screenshots/fa12330/emoticons/" + img + "_80_anim_gif.gif\" />";
        }
        return m;
    });
}

$(() => {
    let socket = io();

    // Reloads entire page when user clicks on refresh button.
    $("#server-upgrade").on("click", () => location.reload());

    // Sends login request with selected user name to server.
    $("#login").on("click", e => {
        e.preventDefault();
        let username = $("#username").val();
        if ($.trim(username)) {
            $("#usernameModal").modal("hide");
            socket.emit("identify", username);
            $("body").attr("data-username", username);
        } else {
            $("#username").wrap("<div class='has-error'>");
            $("#username").focus();
        }
    });

    // Snap to grid if draggable is over droppable
    // function snapToGrid(event, ui) {
    //     ui.draggable.draggable({
    //         grid: [30, 30]
    //     });
    // }

    // Make ship draggable
    $(".ship").draggable({
        containment: "document",
        cursor: "move",
        revert: true
    });

    // Handle how ship is dropped
    function dropShip(event: JQueryEventObject, ui: JQueryUI.DroppableEventUIParam) {
        let dragItemOffsetX = event.offsetX;
        let draggableCell = Math.floor(dragItemOffsetX / 30);
        let toLeft = draggableCell * 30;

        ui.draggable.position({
            of: $(this),
            my: "left top",
            at: "left-" + toLeft + " top"
        });

        ui.draggable.draggable({
            revert: false
        });
    }

    // Make board droppable
    $("#board td").droppable({
        tolerance: "pointer",
        drop: dropShip
    });

    // Send chat message (if anything is written in message box).
    $("form").submit(() => {
        let msg = $("#m").val();
        if ($.trim(msg)) {
            socket.emit("chat message", msg);
            $("#m").val("");
        }
        return false;
    });

    // Special characters that need escaping in user input.
    let entityMap: { [id: string]: string; } = { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" };

    function escapeHtml(html: string) {
        return String(html).replace(/[&<>"']/g, function (s) {
            return entityMap[s];
        });
    }

    // Handles incoming chat message.
    socket.on("chat message", (m: msg.UserMessage & msg.ChatMessage) => {
        let text = m.text;
        if ($.trim(text)) {
            text = escapeHtml(text).replace(/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/g, m => {
                return "<a href=\"" + m + "\" target=\"_blank\">" + m + "</a>";
            }).populateEmoticons();
            let $messages = $("#messages");
            $messages.append(
                $("<li>")
                    .addClass("list-group-item")
                    .append($("<span>").addClass("badge").text(m.time))
                    .append($("<h4>").addClass("list-group-item-heading").text(m.username))
                    .append($("<p>").addClass("list-group-item-text").html(text)));
            $messages.parent().animate({ scrollTop: $messages.parent()[0].scrollHeight }, "slow");
        }
    });

    // Handles server closing event.
    socket.on("server closed", () => {
        $(".upgrade-alert").hide("slow");
        $(".server-closed-alert").show("slow");
    });

    // Handles server version change.
    socket.on("server version", (version: string) => {
        document.title = `Battleship v${version}`;
        $(".server-closed-alert").hide("slow");
        var currentVersion = $("body").attr("data-battleship-version");
        if (!currentVersion) {
            $("body").attr("data-battleship-version", version);
        } else if (currentVersion !== version) {
            $("#server-version").text(version);
            $(".upgrade-alert").show("slow");
        }
    });

    // Handles new connecting user event.
    socket.on("user connected", (m: msg.UserMessage) => {
        $("#messages")
            .append($("<li>")
            .addClass("list-group-item list-group-item-success")
            .append($("<span>").addClass("badge").text(m.time))
            .append($("<span>").addClass("glyphicon glyphicon-log-in"))
            .append(" ")
            .append($("<strong>").text(m.username))
            .append(" logged on &hellip;"));
        socket.emit("list users");
    });

    // Handles user leaving event.
    socket.on("user disconnected", (m: msg.UserMessage) => {
        $("#messages")
            .append($("<li>")
            .addClass("list-group-item list-group-item-danger")
            .append($("<span>").addClass("badge").text(m.time))
            .append($("<span>").addClass("glyphicon glyphicon-log-out"))
            .append(" ")
            .append($("<strong>").text(m.username))
            .append(" logged out &hellip;"));
        socket.emit("list users");
    });

    // Handles list of identified users.
    socket.on("users", (users: string []) => {
        $("#users")
            .empty()
            .append($.map(users, user => { return $("<li>").text(user); }));
    });

    // Open login dialog after page is loaded.
    $("#usernameModal").modal({
        backdrop: "static",
        keyboard: false
    });

    // Resize chat area when window size changes (needs improvement).
    var $window = $(window);
    $window.on("resize", () => {
        $("#chat-container").height($window.height() - 100);
        $("#chat-container").css("max-height", $window.height() - 100);
    }).resize();
});
