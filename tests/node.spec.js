/* global BipbopWebsocket */

'use strict';

const BipbopWebSocket = require("../index");

describe('BipbopWebsocket', function () {
  it('onMessage', function (cb) {
    new BipbopWebSocket('6057b71263c21e4ada266c9d4d4da613', function () {
      cb();
    }, function () {

    }, {
      websocketAddress: 'ws://irql.bipbop.com.br/ws',      
    });
  });

  it('onConnect', function (cb) {
    new BipbopWebSocket('6057b71263c21e4ada266c9d4d4da613', function () {

    }, function () {
      cb();
    }, {
      websocketAddress: 'ws://irql.bipbop.com.br/ws',      
    });
  });

  it('onSend', function (cb) {
    new BipbopWebSocket('6057b71263c21e4ada266c9d4d4da613', function () {
    }, function () {
    }).send('hello!', function () {
      cb();
    }, {
      websocketAddress: 'ws://irql.bipbop.com.br/ws',      
    });
  });

  it('onClose', function (cb) {
    new BipbopWebSocket('6057b71263c21e4ada266c9d4d4da613', function () {

    }, function () {

    }).send('hello!', function () {
      cb();
      this.close();
    }, {
      websocketAddress: 'ws://irql.bipbop.com.br/ws',      
    });
  });


});
