import * as types from "../mutation-types";

import { Message } from "../../clientmessages";

const state = {
    conversation: new Array<Message>()
};

type State = typeof state;

const mutations = {
    [types.APPEND_MESSAGE] (state: State) {

    }
};

export default {
    state,
    mutations
};
