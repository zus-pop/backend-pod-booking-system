import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { GoogleCloudService } from '../uploader/google-cloud-storage.service';
import { PodController } from './pod.controller';
import { PodService } from './pod.service';
import { ConfigService } from '@nestjs/config';

describe('PodController', () => {
  let controller: PodController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PodController],
      providers: [PodService, PrismaService, GoogleCloudService, ConfigService],
    }).compile();

    controller = module.get<PodController>(PodController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
