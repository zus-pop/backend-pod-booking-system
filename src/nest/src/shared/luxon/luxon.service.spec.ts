import { Test, TestingModule } from '@nestjs/testing';
import { LuxonService } from './luxon.service';

describe('LuxonService', () => {
  let service: LuxonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LuxonService],
    }).compile();

    service = module.get<LuxonService>(LuxonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
