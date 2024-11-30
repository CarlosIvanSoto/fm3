import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { writeFileSync } from 'fs';
import { join } from 'path';
import * as sharp from 'sharp';

@Injectable()
export class UploadLogoService {
  constructor(private readonly configService: ConfigService) {}

  async compressImage(file: Express.Multer.File): Promise<string> {
    const dest = this.configService.get<string>('LOGO_DEST', 'logos');
    const outputDir = join(process.cwd(), `${dest}/compress`);
    const fileName = file.filename;
    const filePath = join(outputDir, file.filename);
    const compressedImageBuffer = await sharp(file.path)
      .webp({ quality: 75 })
      .toBuffer();
    writeFileSync(filePath, compressedImageBuffer);
    return fileName;
  }
}
