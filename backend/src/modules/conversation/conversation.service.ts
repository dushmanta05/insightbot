import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from './entities/conversation.entity';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { UserType } from 'src/common/enums/sender-type.enum';
import { ApiService } from 'src/core/api/api.service';
import { ChatGateway } from 'src/core/gateway/chat.gateway';

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    private readonly apiService: ApiService,
    private readonly chatGateway: ChatGateway,
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

    this.processAIResponse(formattedMessages, createConversationDto.sessionId);

    return savedUserConversation;
  }

  private async processAIResponse(
    messages: Array<{ role: string; content: string }>,
    sessionId: string,
  ) {
    try {
      const { success, data } =
        await this.apiService.generateChatResponse(messages);

      if (!success) {
        throw new Error('Failed to generate chat response.');
      }

      const agentConversation = this.conversationRepository.create({
        content: data.content,
        role: UserType.ASSISTANT,
        sessionId: sessionId,
      });
      const savedAgentConversation =
        await this.conversationRepository.save(agentConversation);

      this.chatGateway.server.emit('assistantResponse', {
        content: savedAgentConversation.content,
        sessionId: sessionId,
        messageId: savedAgentConversation.id,
      });

      return savedAgentConversation;
    } catch (error) {
      console.error('Error processing AI response:', error);

      this.chatGateway.server.emit('assistantResponse', {
        content: 'Sorry, I encountered an error generating a response.',
        sessionId: sessionId,
        error: true,
      });

      throw error;
    }
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
