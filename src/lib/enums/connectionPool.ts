import { w3cwebsocket } from "websocket";

export const currencies = [
  'btcusdt',
  'yfibtc',
  'ethbtc',
  'dashbtc',
  'adabusd',
  'ltcbusd',
  'atombnb',
  'lunausdt',
  'xrpusdt',
  'ethusdt',
  'dotbusd',
  'dashbusd',
  'dashusdt',
  'solusdt',
  'solbtc',
  'manausdt',
  'manabusd',
];

 export const getConnectionsPool = () => {
  const connectionsPool = {};
  currencies.map(item => {
    connectionsPool[item] =  new w3cwebsocket(
      `wss://stream.binance.com:9443/ws/${item}@kline_1m`
    );
  });
  return connectionsPool
 };