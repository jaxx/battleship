<template>
    <div>
        <div class="server-closed-alert alert alert-danger alert-dismissible" style="display: none;">
            <button type="button" class="close" data-dismiss="alert">&times;</button>
            <strong>Server Closed.</strong> Thank You! Come again!
        </div>
        <chat :conversation="conversation"></chat>
    </div>
</template>

<script lang="ts">
import App from "./app.ts";
export default App;
</script>
