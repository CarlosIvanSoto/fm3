import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationTokenService } from './application-token.service';

describe('ApplicationTokenService', () => {
  let service: ApplicationTokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApplicationTokenService],
    }).compile();

    service = module.get<ApplicationTokenService>(ApplicationTokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
