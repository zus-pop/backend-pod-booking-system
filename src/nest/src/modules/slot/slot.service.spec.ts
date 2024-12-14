import { Test, TestingModule } from '@nestjs/testing';
import { SlotService } from './slot.service';
import { LuxonService } from '../../shared/luxon/luxon.service';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

describe('SlotService', () => {
  let service: SlotService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SlotService, PrismaService, LuxonService, ConfigService],
    }).compile();

    service = module.get<SlotService>(SlotService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
