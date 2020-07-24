// Type definitions for bipbop-websocket 1.1.1
// Definitions by: Lorhan Sohaky https://github.com/LorhanSohaky/

interface IOnMessage {
    (object: Object, event: MessageEvent): any
}

interface IOnOpen {
    (websocket: WebSocket): any
}

interface IOnSend {
    (websocket: BipbopWebSocket): any
}

interface IOnError {
    (args: [ErrorEvent]): any
}

interface IConfig {
    websocketAddress?: string,
    reconnectAfter?: number,
    start?: boolean,
    noretry?: boolean,
    ws: { onopen: IOnOpen, onerror: IOnError }
}

type QueueItem = [string | object, IOnSend]

declare class BipbopWebSocket {
    constructor(
        apiKey?: string,
        onMessage?: IOnMessage,
        onOpen?: IOnOpen,
        config?: IConfig
    );

    apiKey: string;
    onMessage: IOnMessage;
    onOpen: IOnOpen;
    queue: QueueItem[];
    config: IConfig;
    ws: WebSocket;

    static open(apiKey?: string, onMessage: IOnMessage, onConnect: IOnOpen): (data, onSend) => BipbopWebSocket;
    static promise(): Promise<BipbopWebSocket>;

    send(data: string | object, onSend: IOnSend): boolean;
    start(): undefined;
    close(): undefined;
}