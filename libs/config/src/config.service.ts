import { Injectable } from '@nestjs/common';

import { AppConfig } from './config.schema';

@Injectable()
export class AppConfigService {
  constructor(private readonly config: AppConfig) {}

  get port(): number {
    return this.config.PORT;
  }

  get nodeEnv(): string {
    return this.config.NODE_ENV;
  }

  get isProduction(): boolean {
    return this.config.NODE_ENV === 'production';
  }

  getDbConfig() {
    return {
      host: this.config.DB_HOST,
      port: this.config.DB_PORT,
      database: this.config.DB_NAME,
      username: this.config.DB_USER,
      password: this.config.DB_PASSWORD,
    };
  }
}
