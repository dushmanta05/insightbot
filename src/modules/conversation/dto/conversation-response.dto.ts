import { Exclude, Expose } from 'class-transformer';
import type { ContentType } from 'src/common/enums/content-type.enum';
import type { SenderType } from 'src/common/enums/sender-type.enum';

export class ConversationResponseDto {
  @Expose()
  id: string;

  @Expose()
  sessionId: string;

  @Expose()
  content: string;

  @Exclude()
  senderType: SenderType;

  @Exclude()
  contentType: ContentType;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}
