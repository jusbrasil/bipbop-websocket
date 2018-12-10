(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('ws')) :
	typeof define === 'function' && define.amd ? define(['ws'], factory) :
	(global.BipbopWebSocket = factory(global.WebSocket));
}(this, (function (WebSocket) { 'use strict';

WebSocket = WebSocket && WebSocket.hasOwnProperty('default') ? WebSocket['default'] : WebSocket;

/*
object-assign
(c) Sindre Sorhus
@license MIT
*/
/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

var objectAssign = shouldUseNative() ? Object.assign : function (target, source) {
	var arguments$1 = arguments;

	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments$1[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

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

var BipbopWebSocket = function BipbopWebSocket(apiKey, onMessage, onOpen, config) {
  if ( apiKey === void 0 ) apiKey = bipbopFreeKey;
  if ( onMessage === void 0 ) onMessage = function () {};
  if ( onOpen === void 0 ) onOpen = function () {};
  if ( config === void 0 ) config = {};

  this.apiKey = apiKey;

  this.onMessage = onMessage.bind(this);
  this.onOpen = onOpen.bind(this);

  this.queue = [];
  this.config = objectAssign(bipbop, config);
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
    if (onSend) { onSend.apply(this); }
    return true;
  }

  this.queue.push([data, onSend]);
  return false;
};

BipbopWebSocket.prototype.start = function start () {
    var this$1 = this;

  this.ws = new WebSocket(this.config.websocketAddress);

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

BipbopWebSocket.prototype.close = function close () {
  this.ws.onclose = null;
  this.ws.close();
};

return BipbopWebSocket;

})));
