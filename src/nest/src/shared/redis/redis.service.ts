import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService extends Redis implements OnModuleInit {
  private readonly logger = new Logger(RedisService.name);

  constructor(configService: ConfigService) {
    super({
      host: configService.get<string>('REDIS_HOST'),
      retryStrategy: () => {
        // reconnect after
        return 5000; // reconnect after 5 seconds
      },
    });
  }
  onModuleInit() {
    this.on('connect', () => {
      this.logger.log('Connected to Redis');
    }).on('error', (err) => {
      this.logger.error('Error connecting to Redis:', err.message);
    });
  }
}
