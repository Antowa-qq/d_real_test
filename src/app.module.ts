import { AppConfigModule, AppConfigService } from '@libs/config';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClsModule } from 'nestjs-cls';

import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { CorrelationMiddleware } from './common/middlewares/correlation.middleware';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    AppConfigModule.forRoot(),
    ClsModule.forRoot({ global: true, middleware: { mount: true } }),
    TypeOrmModule.forRootAsync({
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => ({
        type: 'postgres',
        ...config.getDbConfig(),
        entities: [__dirname + '/**/*.entity.{ts,js}'],
        migrations: [__dirname + '/../migrations/*.{ts,js}'],
        synchronize: false,
        logging: !config.isProduction,
      }),
    }),
    UsersModule,
  ],
  providers: [{ provide: APP_FILTER, useClass: GlobalExceptionFilter }],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(CorrelationMiddleware).forRoutes('*');
  }
}
