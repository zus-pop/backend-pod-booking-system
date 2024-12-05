import { Module } from '@nestjs/common';
import { PodModule } from './modules/pod/pod.module';
import { PrismaModule } from './shared/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { LoggerPipe } from './shared/pipes';
import { UploaderModule } from './modules/uploader/uploader.module';
import { RedisModule } from './shared/redis/redis.module';
import { SlotModule } from './modules/slot/slot.module';
import { LuxonModule } from './shared/luxon/luxon.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PodModule,
    PrismaModule,
    UploaderModule,
    RedisModule,
    SlotModule,
    LuxonModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useClass: LoggerPipe,
    },
  ],
})
export class AppModule {}
