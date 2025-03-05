import { Site } from '../../site/entities/site.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  OneToOne,
} from 'typeorm';

import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  16,
);

@Entity()
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  siteId: string;

  @Column({ type: 'varchar', length: 16, nullable: false, unique: true })
  key: string;

  @Column({ type: 'jsonb', nullable: false })
  request: object;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToOne(() => Site, (site) => site.id)
  site: Site;

  @BeforeInsert()
  generateKey() {
    this.key = nanoid();
  }
}
