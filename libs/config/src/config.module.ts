import { DynamicModule, Module } from '@nestjs/common';
import * as dotenv from 'dotenv';

import { configSchema, AppConfig } from './config.schema';
import { AppConfigService } from './config.service';

export const APP_CONFIG = Symbol('APP_CONFIG');

@Module({})
export class AppConfigModule {
  static forRoot(envFilePath?: string): DynamicModule {
    dotenv.config({ path: envFilePath ?? '.env' });
    const parsed = configSchema.safeParse(process.env);

    if (!parsed.success) {
      const errors = parsed.error.errors
        .map((e) => `  ${e.path.join('.')}: ${e.message}`)
        .join('\n');
      throw new Error(`Configuration validation failed:\n${errors}`);
    }

    return AppConfigModule.buildModule(parsed.data);
  }

  static forRootAsync(envFilePath?: string): DynamicModule {
    return AppConfigModule.forRoot(envFilePath);
  }

  private static buildModule(config: AppConfig): DynamicModule {
    return {
      module: AppConfigModule,
      global: true,
      providers: [
        {
          provide: APP_CONFIG,
          useValue: config,
        },
        {
          provide: AppConfigService,
          useFactory: (cfg: AppConfig) => new AppConfigService(cfg),
          inject: [APP_CONFIG],
        },
      ],
      exports: [AppConfigService],
    };
  }
}
