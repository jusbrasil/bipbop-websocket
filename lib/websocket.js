import WebSocket from 'ws';
import objectAssign from 'object-assign';

import bipbopFreeKey from './free';
import bipbop from './config';

export default class BipbopWebSocket {
  static open(apiKey = bipbopFreeKey, onMessage, onConnect) {
    return (...args) => new BipbopWebSocket(apiKey, onMessage, onConnect).send(...args);
  }

  static promise(onMessage = () => {}, apiKey = bipbopFreeKey, config = {}) {
    return new Promise((onopen, onerror) => {
      const useConfig = Object.assign({}, config, { ws: { onopen, onerror }, noretry: true });
      return new BipbopWebSocket(apiKey, onMessage, () => {}, useConfig);
    });
  }

  constructor(apiKey = bipbopFreeKey, onMessage = () => {}, onOpen = () => {}, config = {
    start: true,
  }) {
    this.apiKey = apiKey;
    this.onMessage = onMessage.bind(this);
    this.onOpen = onOpen.bind(this);
    this.queue = [];
    this.config = objectAssign(bipbop, config);
    this.ws = null;
    this.start();
  }

  send(data, onSend) {
    if (typeof data === 'string') this.apiKey = data;

    if (this.ws && this.ws.readyState === 1) {
      this.ws.send(JSON.stringify(data));
      if (onSend) onSend.apply(this);
      return true;
    }

    this.queue.push([data, onSend]);
    return false;
  }

  start() {
    this.ws = new WebSocket(this.config.websocketAddress);

    this.ws.onmessage = (event) => {
      if (this.onMessage && event.data) this.onMessage(JSON.parse(event.data), event);
    };

    this.ws.onopen = () => {
      if (this.config.ws && this.config.ws.onopen) this.config.ws.onopen(this);
      this.ws.send(JSON.stringify(this.apiKey));
      while (this.queue.length) this.send(...this.queue.shift());
      if (this.onOpen) this.onOpen(this.ws);
    };

    this.ws.onerror = (...args) => {
      if (this.config.ws && this.config.ws.onerror) this.config.ws.onerror(args);
      this.ws.close();
    };
    this.ws.onclose = () => {
      if (this.config.noretry) return;
      setTimeout(() => this.start(), bipbop.reconnectAfter);
    };
  }

  close() {
    this.ws.onclose = null;
    this.ws.close();
  }
}
