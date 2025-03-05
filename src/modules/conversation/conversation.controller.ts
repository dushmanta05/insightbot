import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { ConversationResponseDto } from './dto/conversation-response.dto';
import { plainToInstance } from 'class-transformer';

@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post()
  async create(
    @Body() createConversationDto: CreateConversationDto,
  ): Promise<ConversationResponseDto> {
    const conversation = await this.conversationService.create(
      createConversationDto,
    );
    return plainToInstance(ConversationResponseDto, conversation, {
      excludeExtraneousValues: true,
    });
  }

  @Get()
  async findAll(): Promise<ConversationResponseDto[]> {
    const conversations = await this.conversationService.findAll();
    return plainToInstance(ConversationResponseDto, conversations, {
      excludeExtraneousValues: true,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ConversationResponseDto> {
    const conversation = await this.conversationService.findOne(id);
    return plainToInstance(ConversationResponseDto, conversation, {
      excludeExtraneousValues: true,
    });
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateConversationDto: UpdateConversationDto,
  ): Promise<ConversationResponseDto> {
    const conversation = await this.conversationService.update(
      id,
      updateConversationDto,
    );
    return plainToInstance(ConversationResponseDto, conversation, {
      excludeExtraneousValues: true,
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.conversationService.remove(id);
  }
}
