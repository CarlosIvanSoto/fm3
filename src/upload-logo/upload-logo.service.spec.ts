import { Test, TestingModule } from '@nestjs/testing';
import { UploadLogoService } from './upload-logo.service';

describe('UploadLogoService', () => {
  let service: UploadLogoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UploadLogoService],
    }).compile();

    service = module.get<UploadLogoService>(UploadLogoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
