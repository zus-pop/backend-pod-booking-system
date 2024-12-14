import { Test, TestingModule } from '@nestjs/testing';
import { PodService } from './pod.service';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { GoogleCloudService } from '../uploader/google-cloud-storage.service';
import { ConfigService } from '@nestjs/config';

describe('PodService', () => {
  let service: PodService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PodService, PrismaService, GoogleCloudService, ConfigService],
    }).compile();

    service = module.get<PodService>(PodService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
