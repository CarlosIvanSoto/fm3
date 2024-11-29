import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { writeFileSync } from 'fs';
import { join } from 'path';
import * as sharp from 'sharp';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async compressImage(file: Express.Multer.File): Promise<string> {
    const dest = this.configService.get<string>('MULTER_DEST', 'uploads');
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
