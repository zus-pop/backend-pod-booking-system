import { Module } from '@nestjs/common';
import { PodModule } from './modules/pod/pod.module';
import { PrismaModule } from './shared/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { LoggerPipe } from './shared/pipes';
import { RedisModule } from './shared/redis/redis.module';
import { SlotModule } from './modules/slot/slot.module';
import { LuxonModule } from './shared/luxon/luxon.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PodModule,
    PrismaModule,
    RedisModule,
    SlotModule,
    LuxonModule,
    AuthModule,
    UserModule,
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
