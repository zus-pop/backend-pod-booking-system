import { Module } from '@nestjs/common';
import { PodModule } from './pod/pod.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { LoggerPipe } from './pipes';
import { UploaderModule } from './uploader/uploader.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PodModule,
    PrismaModule,
    UploaderModule,
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
