import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async generateChatResponse(
    messages: Array<{ role: string; content: string }>,
  ) {
    try {
      const apiUrl = this.configService.get<string>('modelConfig.url');
      const apiKey = this.configService.get<string>('modelConfig.token');
      const modelName = this.configService.get<string>('modelConfig.model');
      const response = await firstValueFrom(
        this.httpService.post(
          apiUrl,
          {
            model: modelName,
            stream: false,
            messages: messages,
          },
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      );
      const message = response?.data?.choices[0]?.message;
      return { success: true, data: message };
    } catch (error) {
      console.error(error?.message);
      return { success: false, message: 'Failed to fetch chat response.' };
    }
  }
}
