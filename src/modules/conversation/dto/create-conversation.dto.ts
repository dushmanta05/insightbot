import { IsString, IsNotEmpty, IsUUID, IsOptional } from 'class-validator';
import type { SenderType } from 'src/common/enums/sender-type.enum';
import type { ContentType } from 'src/common/enums/content-type.enum';

export class CreateConversationDto {
  @IsString()
  @IsNotEmpty()
  senderType: SenderType;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsUUID()
  @IsNotEmpty()
  sessionId: string;

  @IsOptional()
  @IsNotEmpty()
  contentType: ContentType;
}
