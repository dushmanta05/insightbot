import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ApiService } from './api.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [ApiService],
  exports: [ApiService],
})
export class ApiModule {}
