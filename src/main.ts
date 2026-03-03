import { AppConfigService } from '@libs/config';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WinstonModule } from 'nest-winston';
import { ClsServiceManager } from 'nestjs-cls';
import * as winston from 'winston';

import { AppModule } from './app.module';
import { ClassValidatorException } from './common/error/exceptions';

const winstonLogger = WinstonModule.createLogger({
  level: 'debug',
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, context }) => {
          const cls = ClsServiceManager.getClsService();
          const requestId = cls.get<string>('requestId') ?? 'no-request-id';
          const ctx = context ? ` [${context as string}]` : '';
          return `${timestamp as string} [${level}]${ctx} [${requestId}] ${message as string}`;
        }),
      ),
    }),
  ],
});

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: false }),
    { logger: winstonLogger },
  );

  const config = app.get(AppConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      exceptionFactory: (errors) => new ClassValidatorException(errors),
    }),
  );

  if (!config.isProduction) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Balance Service')
      .setDescription('API for managing user balances with payment history')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document);
  }

  const port = config.port;
  await app.listen(port, '0.0.0.0');
}

bootstrap().catch((err: unknown) => {
  console.error('Failed to start application:', err);
  process.exit(1);
});
