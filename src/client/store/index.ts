import Vuex = require("vuex");

import chat from "./modules/chat";

const store = new Vuex.Store({
    state: {
        count: 0
    },
    mutations: {
        increment(state) {
            state.count++;
        }
    },
    modules: {
        chat
    }
});

export {
    store
}
