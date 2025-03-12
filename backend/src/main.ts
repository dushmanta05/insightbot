import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  type NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  const configService = app.get(ConfigService);
  const allowedOrigins = configService.get<string[]>(
    'allowedOrigins.frontend',
    [],
  );
  const port = configService.get<number>('app.port', 3000);

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  await app.listen({ port: port }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server is running on ${address}`);
  });
}
bootstrap();
