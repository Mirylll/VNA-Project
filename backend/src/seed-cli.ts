import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  const { seed } = await import('./seeds/seed');
  await seed(dataSource);

  await app.close();
  console.log('✅ Seed complete');
}

bootstrap().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
