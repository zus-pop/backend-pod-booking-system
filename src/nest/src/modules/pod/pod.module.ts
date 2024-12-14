import { Module } from '@nestjs/common';
import { CloudStorage } from '../uploader/cloud.interface';
import { GoogleCloudService } from '../uploader/google-cloud-storage.service';
import { PodController } from './pod.controller';
import { PodService } from './pod.service';

@Module({
  controllers: [PodController],
  providers: [
    PodService,
    {
      provide: CloudStorage,
      useClass: GoogleCloudService,
    },
  ],
})
export class PodModule {}
