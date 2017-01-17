import * as $ from "jquery";
import * as io from "socket.io-client";
import * as msg from "../common/messages";

import Vue = require('vue');

import ChatComponent from "./components/chat";
import AppComponent from "./components/app";

Vue.component("chat", ChatComponent);
Vue.component("app", AppComponent);

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

    // Handles server closing event.
    socket.on("server closed", () => {
        $(".upgrade-alert").hide("slow");
        $(".server-closed-alert").show("slow");
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
});

new Vue({
    el: "#app",
    methods: {
        updateTitle(version) {
            document.title = `Battleship v${version}`;
        }
    }
})
