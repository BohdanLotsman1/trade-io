import { Server } from 'socket.io';
import { currPrice } from 'src/modules/common/curPrice';

async function socketAddEvents(websocket, wsServer) {

  websocket.onopen = () => {
    //console.log('opened');
  };

  websocket.onmessage = (message) => {
    let obj = JSON.parse(message.data);

    currPrice[obj.s] = obj.k.c;
    
    if (Array.from(wsServer.clients).length > 0)
      Array.from(wsServer.clients).forEach((client: any) => {
        client.send(message.data);
      });
  };
}
export default socketAddEvents;
