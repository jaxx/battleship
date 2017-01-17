import * as CommonMessages from "../common/messages";

export interface ChatMessage {
    kind: "chat",
    message: CommonMessages.UserMessage & CommonMessages.ChatMessage;
}

export interface ConnectMessage {
    kind: "connect";
    message: CommonMessages.UserMessage;
}

export interface DisconnectMessage {
    kind: "disconnect";
    message: CommonMessages.UserMessage;
}

export type Message = ChatMessage | ConnectMessage | DisconnectMessage;
