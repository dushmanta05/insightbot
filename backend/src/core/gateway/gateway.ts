import type { OnModuleInit } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import type { Server } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class ChatGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(socket.id);
      console.log('Socket connected.');
    });
  }

  @SubscribeMessage('newMessage')
  onNewMessage(@MessageBody() body: string) {
    console.log(body);
    this.server.emit('onMessage', {
      message: 'Hello Scam Altman',
    });
  }
}
