import WebSocket from 'ws';
import objectAssign from 'object-assign';

import bipbopFreeKey from './free';
import bipbop from './config';

export default class BipbopWebSocket {
  static open(apiKey = bipbopFreeKey, onMessage, onConnect) {
    return (...args) => new BipbopWebSocket(apiKey, onMessage, onConnect).send(...args);
  }

  constructor(apiKey, onMessage, onOpen, config = {}) {
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
      this.ws.send(JSON.stringify(this.apiKey));
      while (this.queue.length) this.send(...this.queue.shift());
      if (this.onOpen) this.onOpen(this.ws);
    };

    this.ws.onerror = () => this.ws.close();
    this.ws.onclose = () => setTimeout(() => this.start(), bipbop.reconnectAfter);
  }

  close() {
    this.ws.onclose = null;
    this.ws.close();
  }
}
