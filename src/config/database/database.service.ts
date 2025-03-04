import { Injectable, type OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseService implements OnModuleInit {
  constructor(private readonly dataSource: DataSource) {}

  async onModuleInit() {
    if (this.dataSource.isInitialized) {
      console.log('Database connection established successfully 🌱');
    } else {
      console.error('Failed to connect to the database 🚨');
    }
  }
}
