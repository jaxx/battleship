<template>
    <div class="chat">
        <div class="chat__messages">
            <ul class="list-group">
                <template v-for="msg in conversation">
                    <li v-if="msg.kind === 'chat'" class="list-group-item">
                        <span class="badge">{{ msg.message.time }}</span>
                        <h4 class="list-group-item-heading">{{ msg.message.username }}</h4>
                        <p class="list-group-item-text">{{ msg.message.text | escapeHtml | activateLinks | emoticons }}</p>
                    </li>
                    <li v-else-if="msg.kind === 'connect'" class="list-group-item list-group-item-success">
                        <span class="badge">{{ msg.message.time }}</span>
                        <span class="glyphicon glyphicon-log-in"></span>
                        <strong>{{ msg.message.username }}</strong>
                        <span> logged on &hellip;</span>
                    </li>
                    <li v-else-if="msg.kind === 'disconnect'" class="list-group-item list-group-item-danger">
                        <span class="badge">{{ msg.message.time }}</span>
                        <span class="glyphicon glyphicon-log-out"></span>
                        <strong>{{ msg.message.username }}</strong>
                        <span> logged out &hellip;</span>
                    </li>
                    <li v-else>
                        <h1>Unknown</h1>
                    </li>
                </template>
            </ul>
        </div>
        <form class="chat__actions" @submit.prevent="sendMessage()">
            <div class="input-group">
                <input type="text" class="form-control" autocomplete="off" v-model="message" />
                <span class="input-group-btn">
                    <button class="btn btn-default" type="submit">Send</button>
                </span>
            </div>
        </form>
    </div>
</template>

<script lang="ts">
import Chat from "./chat.ts";
export default Chat;
</script>
