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

export default {
  websocketAddress: 'wss://irql.bipbop.com.br/ws',
  reconnectAfter: 3000,
};
