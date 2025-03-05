import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from './entities/conversation.entity';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { UserType } from 'src/common/enums/sender-type.enum';
import { ApiService } from 'src/common/api/api.service';

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    private readonly apiService: ApiService,
  ) {}

  async create(
    createConversationDto: CreateConversationDto,
  ): Promise<Conversation> {
    const conversation = this.conversationRepository.create(
      createConversationDto,
    );
    const savedUserConversation =
      await this.conversationRepository.save(conversation);

    const sessionMessages = await this.conversationRepository.find({
      where: { sessionId: createConversationDto.sessionId },
      select: ['role', 'content'],
      order: { createdAt: 'ASC' },
    });

    const formattedMessages = sessionMessages.map((message) => ({
      role: message.role,
      content: message.content,
    }));

    formattedMessages.push({
      role: savedUserConversation.role,
      content: savedUserConversation.content,
    });

    const { success, data } =
      await this.apiService.generateChatResponse(formattedMessages);

    if (!success) {
      throw new Error('Failed to generate chat response.');
    }

    const agentConversation = this.conversationRepository.create({
      content: data.content,
      role: UserType.ASSISTANT,
      sessionId: createConversationDto.sessionId,
    });

    await this.conversationRepository.save(agentConversation);

    return agentConversation;
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
