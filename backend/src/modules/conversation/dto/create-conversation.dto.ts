import { IsString, IsNotEmpty, IsUUID, IsOptional } from 'class-validator';
import type { ContentType } from 'src/common/enums/content-type.enum';

export class CreateConversationDto {
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
