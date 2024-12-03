import { Test, TestingModule } from '@nestjs/testing';
import { PodService } from './pod.service';
import { PrismaService } from '../prisma/prisma.service';
import { UploaderService } from '../uploader/uploader.service';
import { ConfigService } from '@nestjs/config';

describe('PodService', () => {
  let service: PodService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PodService, PrismaService, UploaderService, ConfigService],
    }).compile();

    service = module.get<PodService>(PodService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
