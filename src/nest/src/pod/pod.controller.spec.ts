import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { UploaderService } from '../uploader/uploader.service';
import { PodController } from './pod.controller';
import { PodService } from './pod.service';
import { ConfigService } from '@nestjs/config';

describe('PodController', () => {
  let controller: PodController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PodController],
      providers: [PodService, PrismaService, UploaderService, ConfigService],
    }).compile();

    controller = module.get<PodController>(PodController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
