$(document).ready(function() {
    var socket = io();

    // Reloads entire page when user clicks on refresh button.
    $("#server-upgrade").on("click", function() {
        location.reload();
    });

    // Sends login request with selected user name to server.
    $("#login").on("click", function(e) {
        e.preventDefault();
        var username = $("#username").val();
        if ($.trim(username)) {
            $("#usernameModal").modal("hide");
            socket.emit("identify", username);
        } else {
            $("#username").wrap("<div class='has-error'>");
            $("#username").focus();
        }
    });

    // Make ship draggable
    $(function() {
        $(".ship").draggable({
            containment: "parent",
            cursor: "move",
            revert: true
        });
    });
    
    // Make board droppable
    $(function() {
        $("#board td").droppable({
            drop: dropShip,
            over: snapToGrid,
            out: function(event, ui) {
                ui.draggable.draggable({
                    grid: false
                });
            }
        });
    });

    // Snap to grid if draggable is over droppable
    function snapToGrid(event, ui) {
        ui.draggable.draggable({
            grid: [30, 30]
        });
    }
    
    // Handle how ship is dropped
    function dropShip(event, ui) {
        ui.draggable.position({
            of: $(this),
            my: "left top",
            at: "left top"
        });
        
        ui.draggable.draggable({
            revert: false
        });
    }

    // Send chat message (if anything is written in message box).
    $("form").submit(function() {
        var msg = $("#m").val();
        if ($.trim(msg)) {
            socket.emit("chat message", msg);
            $("#m").val("");
        }
        return false;
    });

    // Special characters that need escaping in user input.
    var entityMap = { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" };

    function escapeHtml(string) {
        return String(string).replace(/[&<>"']/g, function (s) {
            return entityMap[s];
        });
    }

    // Emoticon mappings:
    var emoticonMap = {
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

    String.prototype.populateEmoticons = function() {
        return this.replace(/\(\w+\)/g, function(m) {
            var img = emoticonMap[m];
            if (img) {
                return '<img alt="' + m + '" src="https://az705183.vo.msecnd.net/onlinesupportmedia/onlinesupport/media/skype/screenshots/fa12330/emoticons/' + img + '_80_anim_gif.gif" />';
            }
            return m;
        });
    }

    // Handles incoming chat message.
    socket.on("chat message", function(msg) {
        var text = msg.text;
        if ($.trim(text)) {
            text = escapeHtml(text).replace(/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/g, function(m) {
                return '<a href="' + m + '" target="_blank">' + m + '</a>';
            }).populateEmoticons();
            var $messages = $("#messages");
            $messages.append(
                $("<li>")
                    .addClass("list-group-item")
                    .append($("<span>").addClass("badge").text(msg.time))
                    .append($("<h4>").addClass("list-group-item-heading").text(msg.username))
                    .append($("<p>").addClass("list-group-item-text").html(text)));
            $messages.parent().animate({ scrollTop: $messages.parent()[0].scrollHeight }, "slow");
        }
    });

    // Handles server closing event.
    socket.on("server closed", function() {
        $(".upgrade-alert").hide("slow");
        $(".server-closed-alert").show("slow");
    });

    // Handles server version change.
    socket.on("server version", function(version) {
        $(".server-closed-alert").hide("slow");
        var currentVersion = $("body").attr("data-battleship-version");
        if (!currentVersion) {
            $("body").attr("data-battleship-version", version);
        } else if (currentVersion != version) {
            $("#server-version").text(version);
            $(".upgrade-alert").show("slow");
        }
    });

    // Handles new connecting user event.
    socket.on("user connected", function(msg) {
        $("#messages")
            .append($("<li>")
            .addClass("list-group-item list-group-item-success")
            .append($("<span>").addClass("badge").text(msg.time))
            .append($("<span>").addClass("glyphicon glyphicon-log-in"))
            .append(" ")
            .append($("<strong>").text(msg.username))
            .append(" logged on &hellip;"));
    });

    // Handles user leaving event.
    socket.on("user disconnected", function(msg) {
        $("#messages")
            .append($("<li>")
            .addClass("list-group-item list-group-item-danger")
            .append($("<span>").addClass("badge").text(msg.time))
            .append($("<span>").addClass("glyphicon glyphicon-log-out"))
            .append(" ")
            .append($("<strong>").text(msg.username))
            .append(" logged out &hellip;"));
    });

    // Open login dialog after page is loaded.
    $(window).on("load", function() {
        $("#usernameModal").modal({
            backdrop: "static",
            keyboard: false
        });
    }).load();

    // Resize chat area when window size changes (needs improvement).
    $(window).on("resize", function() {
        $("#chat-container").height($(this).height() - 100);
        $("#chat-container").css("max-height", $(this).height() - 100);
    }).resize();
});
