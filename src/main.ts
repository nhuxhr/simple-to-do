import consola from 'consola';
import { NestFactory } from '@nestjs/core';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

// Merge the console object with the consola object
Object.assign(console, consola);

async function bootstrapSwagger(
  app: INestApplication,
  isSwaggerEnabled: boolean,
  path = '/',
) {
  if (!isSwaggerEnabled) return;
  const { SwaggerModule, DocumentBuilder } = await import('@nestjs/swagger');
  const options = new DocumentBuilder()
    .setTitle('Simple To-Do API')
    .setVersion('1.0')
    .addSecurity('jwt', {
      type: 'http',
      in: 'header',
      scheme: 'bearer',
    })
    .addTag('Main', 'Main operations.')
    .addTag('Auth', 'Authentication operations.')
    .addTag('Session', 'Operations related to user sessions.')
    .addTag('Task', 'Operations for managing tasks.')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(path, app, document, {
    swaggerOptions: { defaultModelsExpandDepth: -1 },
    customSiteTitle: 'Simple To-Do API',
    customCss: '.swagger-ui .topbar { display: none }',
  });
}

async function bootstrap() {
  // Create a new NestJS application instance
  const app = await NestFactory.create(AppModule);

  // Enable versioning
  app.enableVersioning();

  // Use validation pipe
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Get the cfg service
  const cfg = app.get(ConfigService<Cfg>);

  // Set rest API path
  const restPath = cfg.get('REST_PATH') as string;
  app.setGlobalPrefix(restPath);

  // Enable Swagger
  const swaggerEnabled = cfg.get('SWAGGER_ENABLED') as string;
  const swaggerPath = (cfg.get('SWAGGER_PATH') as string) || '/';
  const isSwaggerEnabled = ['true', '1', 'yes'].includes(swaggerEnabled);
  console.info(`Swagger is ${isSwaggerEnabled ? 'enabled' : 'disabled'}`);
  await bootstrapSwagger(app, isSwaggerEnabled, swaggerPath);

  // Get the port from environment variables, default to 3000 if not set
  const port = parseInt(cfg.getOrThrow('PORT'), 10) ?? 3000;

  // Start listening on the specified port
  await app.listen(port);

  // Log success message
  const hostUrl = cfg.get('HOST_URL') as string;
  console.info('=====================================');
  console.info(`Host:     ${hostUrl}`);
  console.info(`Port:     ${port}`);
  console.info(`Rest API: ${hostUrl}${restPath}`);
  if (isSwaggerEnabled) {
    console.info(`Swagger:  ${hostUrl}${swaggerPath}`);
  }
  console.info('=====================================');
  console.success('Server started successfully');
}

void bootstrap();
