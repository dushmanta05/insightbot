// chat.gateway.ts
import { Injectable, type OnModuleInit } from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import type { Server } from 'socket.io';

@Injectable()
@WebSocketGateway()
export class ChatGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;
  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const corsOrigin = this.configService.get<string[]>(
      'allowedOrigins.frontend',
      [],
    );

    this.server.engine.opts.cors = { origin: corsOrigin };
    this.server.on('connection', (socket) => {
      console.log(`Socket connected: ${socket.id}`);
    });
  }

  @SubscribeMessage('newMessage')
  onNewMessage(@MessageBody() body: object) {
    console.log('New message received:', body);
    this.server.emit('onMessage', {
      message: 'Message received',
    });
  }
}
