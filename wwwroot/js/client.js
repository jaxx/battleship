$(document).ready(function() {
    var socket = io();

    // Reloads entire page when user clicks on refresh button.
    $("#server-upgrade").on("click", function() {
        location.reload();
    });

    // Sends login request with selected user name to server.
    $("#login").on("click", function(e) {
        e.preventDefault();
        var userName = $("#username").val().trim();
        if (userName) {
            $("#usernameModal").modal("hide");
            socket.emit("identify", userName);
        }
    });

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
                    .append($("<h4>").addClass("list-group-item-heading").text(msg.userName))
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
    socket.on("user connected", function(userName) {
        $("#messages")
            .append($("<li>")
            .addClass("list-group-item list-group-item-success")
            .append($("<span>").addClass("glyphicon glyphicon-log-in"))
            .append(" ")
            .append($("<strong>").text(userName))
            .append(" logged on &hellip;"));
    });

    // Handles user leaving event.
    socket.on("user disconnected", function(userName) {
        $("#messages")
            .append($("<li>")
            .addClass("list-group-item list-group-item-danger")
            .append($("<span>").addClass("glyphicon glyphicon-log-out"))
            .append(" ")
            .append($("<strong>").text(userName))
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
