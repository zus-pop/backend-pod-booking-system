import { Module } from '@nestjs/common';
import { PodService } from './pod.service';
import { PodController } from './pod.controller';
import { UploaderModule } from '../uploader/uploader.module';

@Module({
  imports: [UploaderModule],
  controllers: [PodController],
  providers: [PodService],
})
export class PodModule {}
