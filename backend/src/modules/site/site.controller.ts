import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SiteService } from './site.service';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { SiteResponseDto } from './dto/site-response.dto';
import { plainToInstance } from 'class-transformer';

@Controller('site')
export class SiteController {
  constructor(private readonly siteService: SiteService) {}

  @Post()
  async create(@Body() createSiteDto: CreateSiteDto): Promise<SiteResponseDto> {
    const site = await this.siteService.create(createSiteDto);
    return plainToInstance(SiteResponseDto, site, {
      excludeExtraneousValues: true,
    });
  }

  @Get()
  async findAll(): Promise<SiteResponseDto[]> {
    const sites = await this.siteService.findAll();
    return plainToInstance(SiteResponseDto, sites, {
      excludeExtraneousValues: true,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<SiteResponseDto> {
    const site = await this.siteService.findOne(id);
    return plainToInstance(SiteResponseDto, site, {
      excludeExtraneousValues: true,
    });
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSiteDto: UpdateSiteDto,
  ): Promise<SiteResponseDto> {
    const site = await this.siteService.update(id, updateSiteDto);
    return plainToInstance(SiteResponseDto, site, {
      excludeExtraneousValues: true,
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    await this.siteService.remove(id);
  }
}
