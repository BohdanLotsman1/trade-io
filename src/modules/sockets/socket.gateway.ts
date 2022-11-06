import {
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'dgram';
import { IsJsonString } from '../../lib/services/isJSON';
import socketAddEvents from '../../lib/services/socketEvents';
import { currPrice } from '../common/curPrice';
import { Server } from 'socket.io';
import { currencies, getConnectionsPool } from 'src/lib/enums/connectionPool';

@WebSocketGateway(7000)
export class SocketGateway implements OnGatewayConnection {
  @WebSocketServer() server: Server;

  handleConnection(client: Socket, ...args: any[]) {
    console.log('connected');
    
    for (let i = 0; i < currencies.length; i++) {
      socketAddEvents(getConnectionsPool()[currencies[i]], this.server);
    }
    client.on('message', (event: Buffer) => {
      if (IsJsonString(event.toString())) {
        const tradeObj = JSON.parse(event.toString());
        const currency = tradeObj.currency.replace('/', '');

        setTimeout(() => {
          tradeObj.direction == 'UP'
            ? currPrice[currency] >= tradeObj.close
              ? client.send('win')
              : client.send('lose')
            : currPrice[currency] <= tradeObj.close
            ? client.send('win')
            : client.send('lose');

          console.log('Sended');
        }, tradeObj.time * 60000);
      }
    });
  }
  @SubscribeMessage('message')
  handleMessage(@MessageBody() message: any): void {}
}
