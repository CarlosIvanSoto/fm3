import { Test, TestingModule } from '@nestjs/testing';
import { UploadLogoController } from './upload-logo.controller';
import { UploadLogoService } from './upload-logo.service';

describe('UploadLogoController', () => {
  let controller: UploadLogoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadLogoController],
      providers: [UploadLogoService],
    }).compile();

    controller = module.get<UploadLogoController>(UploadLogoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
