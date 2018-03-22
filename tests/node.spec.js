/* global BipbopWebsocket */

'use strict';

const BipbopWebSocket = require("../index");

describe('BipbopWebsocket', function () {
  it('onMessage', function (cb) {
    new BipbopWebSocket('6057b71263c21e4ada266c9d4d4da613', function () {
      cb();
    }, function () {

    });
  });

  it('onConnect', function (cb) {
    new BipbopWebSocket('6057b71263c21e4ada266c9d4d4da613', function () {

    }, function () {
      cb();
    });
  });

  it('onSend', function (cb) {
    new BipbopWebSocket('6057b71263c21e4ada266c9d4d4da613', function () {

    }, function () {

    }).send('hello!', function () {
      cb();
    });
  });

  it('onClose', function (cb) {
    var webSocket = new BipbopWebSocket('6057b71263c21e4ada266c9d4d4da613', function () {

    }, function () {

    }).send('hello!', function () {
      cb();
      webSocket.close();
    });
  });


});
