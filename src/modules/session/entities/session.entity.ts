import { Site } from '../../site/entities/site.entity';
import { Conversation } from '../../conversation/entities/conversation.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  siteId: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  key: string;

  @Column({ type: 'jsonb', nullable: false })
  request: object;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => Site, (site) => site.sessions)
  site: Site;

  @OneToMany(() => Conversation, (conversation) => conversation.session)
  conversations: Conversation[];
}
