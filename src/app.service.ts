import { Injectable } from '@nestjs/common';
import { writeFileSync } from 'fs';
import { join } from 'path';
import * as sharp from 'sharp';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async compressImage(file: Express.Multer.File): Promise<string> {
    const outputDir = join(process.cwd(), 'uploads/compress');
    const fileName = file.filename;
    const filePath = join(outputDir, file.filename);
    const compressedImageBuffer = await sharp(file.path)
      .webp({ quality: 75 })
      .toBuffer();
    writeFileSync(filePath, compressedImageBuffer);
    return fileName;
  }
}
