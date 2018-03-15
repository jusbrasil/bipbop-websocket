(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.BipbopWebSocket = factory());
}(this, (function () { 'use strict';

/**
 * Chave de API grátis da BIPBOP
 * @global
 * @constant
 * @name BIPBOP_FREE
 */
var bipbopFreeKey = '6057b71263c21e4ada266c9d4d4da613';

/**
 * Arquivo de Configuração da BIPBOP
 * @var
 * @type {object}
 * @name bipbop
 * @global
 */

/**
 * Endereço do WebSocket
 * @type {string}
 * @name websocketAddress
 * @memberof bipbop
 */

/**
 * Intervalo de Reconexão
 * @type {number}
 * @name reconnectAfter
 * @memberof bipbop
 */

var bipbop = {
  websocketAddress: 'wss://irql.bipbop.com.br/ws',
  reconnectAfter: 3000,
};

/* globals WebSocket */

var BipbopWebSocket = function BipbopWebSocket(apiKey, onMessage, onOpen) {
  this.apiKey = apiKey;

  this.onMessage = onMessage;
  this.onOpen = onOpen;

  this.queue = [];
  this.ws = null;
  this.start();
};

BipbopWebSocket.open = function open (apiKey, onMessage, onConnect) {
    if ( apiKey === void 0 ) apiKey = bipbopFreeKey;

  return function () {
      var ref;

      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];
      return (ref = new BipbopWebSocket(apiKey, onMessage, onConnect)).send.apply(ref, args);
    };
};

BipbopWebSocket.prototype.send = function send (data, onSend) {
  if (typeof data === 'string') { this.apiKey = data; }

  if (this.ws && this.ws.readyState === 1) {
    this.ws.send(JSON.stringify(data));
    if (onSend) { onSend(); }
    return true;
  }

  this.queue.push([data, onSend]);
  return false;
};

BipbopWebSocket.prototype.start = function start () {
    var this$1 = this;

  this.ws = new WebSocket(bipbop.websocketAddress);

  this.ws.onmessage = function (event) {
    if (this$1.onMessage && event.data) { this$1.onMessage(JSON.parse(event.data), event); }
  };

  this.ws.onopen = function () {
      var ref;

    this$1.ws.send(JSON.stringify(this$1.apiKey));
    while (this$1.queue.length) { (ref = this$1).send.apply(ref, this$1.queue.shift()); }
    if (this$1.onOpen) { this$1.onOpen(this$1.ws); }
  };

  this.ws.onerror = function () { return this$1.ws.close(); };
  this.ws.onclose = function () { return setTimeout(function () { return this$1.start(); }, bipbop.reconnectAfter); };
};

return BipbopWebSocket;

})));
