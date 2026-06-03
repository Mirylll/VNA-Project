import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DataSource } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const dataSource = app.get(DataSource);


  const { seed } = await import('./seeds/seed');
  await seed(dataSource);

  await app.listen(process.env.PORT ?? 3001);
}

bootstrap();