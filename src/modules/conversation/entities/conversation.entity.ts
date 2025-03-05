import { ContentType } from 'src/common/enums/content-type.enum';
import { SenderType } from 'src/common/enums/sender-type.enum';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Conversation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  sessionId: string;

  @Column({ type: 'enum', enum: SenderType, default: SenderType.User })
  senderType: SenderType;

  @Column({ type: 'text', nullable: false })
  content: string;

  @Column({ type: 'enum', enum: ContentType, nullable: true })
  contentType: ContentType;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
