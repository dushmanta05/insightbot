import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from './entities/conversation.entity';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
  ) {}

  async create(
    createConversationDto: CreateConversationDto,
  ): Promise<Conversation> {
    const conversation = this.conversationRepository.create(
      createConversationDto,
    );
    return await this.conversationRepository.save(conversation);
  }

  async findAll(): Promise<Conversation[]> {
    return await this.conversationRepository.find();
  }

  async findOne(id: string): Promise<Conversation> {
    const conversation = await this.conversationRepository.findOne({
      where: { id },
    });
    if (!conversation) {
      throw new NotFoundException(`Conversation with ID ${id} not found`);
    }
    return conversation;
  }

  async update(
    id: string,
    updateConversationDto: UpdateConversationDto,
  ): Promise<Conversation> {
    const conversation = await this.findOne(id);
    this.conversationRepository.merge(conversation, updateConversationDto);
    return await this.conversationRepository.save(conversation);
  }

  async remove(id: string): Promise<void> {
    const conversation = await this.findOne(id);
    await this.conversationRepository.remove(conversation);
  }
}
