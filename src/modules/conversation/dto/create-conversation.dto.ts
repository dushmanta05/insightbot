import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class MessageDto {
  @IsString()
  @IsNotEmpty()
  sender: 'user' | 'agent';

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsNotEmpty()
  timestamp: Date;
}

export class CreateConversationDto {
  @IsUUID()
  @IsNotEmpty()
  sessionId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MessageDto)
  messages: MessageDto[];
}
