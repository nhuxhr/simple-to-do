import consola from 'consola';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// Merge the console object with the consola object
Object.assign(console, consola);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
