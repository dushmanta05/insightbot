import { Session } from '../../session/entities/session.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Conversation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  sessionId: string;

  @Column({ type: 'jsonb', nullable: false })
  messages: Array<{
    sender: 'user' | 'agent';
    message: string;
    timestamp: Date;
  }>;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => Session, (session) => session.id)
  session: Session;
}
