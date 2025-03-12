import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from './entities/conversation.entity';
import { ApiModule } from 'src/core/api/api.module';
import { GatewayModule } from 'src/core/gateway/gateway.module';

@Module({
  imports: [TypeOrmModule.forFeature([Conversation]), ApiModule, GatewayModule],
  controllers: [ConversationController],
  providers: [ConversationService],
})
export class ConversationModule {}
