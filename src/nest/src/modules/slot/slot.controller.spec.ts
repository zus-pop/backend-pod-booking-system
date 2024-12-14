import { Test, TestingModule } from '@nestjs/testing';
import { SlotController } from './slot.controller';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { SlotService } from './slot.service';
import { LuxonService } from '../../shared/luxon/luxon.service';

describe('SlotController', () => {
  let controller: SlotController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SlotController],
      providers: [PrismaService, SlotService, ConfigService, LuxonService],
    }).compile();

    controller = module.get<SlotController>(SlotController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
