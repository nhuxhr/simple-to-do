import consola from 'consola';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

// Merge the console object with the consola object
Object.assign(console, consola);

async function bootstrap() {
  // Create a new NestJS application instance
  const app = await NestFactory.create(AppModule);

  // Get the cfg service
  const cfg = app.get(ConfigService<Cfg>);

  // Get the port from environment variables, default to 3000 if not set
  const port = parseInt(cfg.getOrThrow('PORT'), 10) ?? 3000;

  // Start listening on the specified port
  await app.listen(port);

  // Log success message
  console.success(`Server running on http://localhost:${port}`);
}

void bootstrap();
