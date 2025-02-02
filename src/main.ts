import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Load environment variables from the .env file
  dotenv.config();
  app.use(bodyParser.json());
  app.enableCors({
    origin: '*', // Frontend URL
    methods: 'GET, POST, PUT, DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  });
  app.setGlobalPrefix('api'); // Add this line
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
