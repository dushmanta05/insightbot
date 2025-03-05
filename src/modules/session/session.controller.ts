import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { SessionService } from './session.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { SessionResponseDto } from './dto/session-response.dto';
import { plainToInstance } from 'class-transformer';

@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post()
  async create(
    @Body() createSessionDto: CreateSessionDto,
    @Req() req: Request,
  ): Promise<SessionResponseDto> {
    const requestInfo = {
      userAgent: req.headers['user-agent'],
    };
    const session = await this.sessionService.create(
      createSessionDto,
      requestInfo,
    );
    return plainToInstance(SessionResponseDto, session, {
      excludeExtraneousValues: true,
    });
  }

  @Get()
  findAll() {
    return this.sessionService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<SessionResponseDto> {
    const session = await this.sessionService.findOne(id);

    return plainToInstance(SessionResponseDto, session, {
      excludeExtraneousValues: true,
    });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSessionDto: UpdateSessionDto) {
    return this.sessionService.update(id, updateSessionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sessionService.remove(id);
  }
}
