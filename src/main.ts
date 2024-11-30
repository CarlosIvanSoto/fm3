import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { static as ExpressStatic } from 'express';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

function uploadDir(dest: string) {
  const uploadDir = join(process.cwd(), dest, 'compress');
  if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir, { recursive: true });
  }
}

function upsertMulterDir() {
  const dest = process.env.MULTER_DEST ?? 'uploads';
  uploadDir(dest);
  return dest;
}

function upsertLogoDir() {
  const dest = process.env.LOGO_DEST ?? 'logos';
  uploadDir(dest);
  return dest;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const multerDest = upsertMulterDir();
  const logoDest = upsertLogoDir();
  app.use(`/${multerDest}`, ExpressStatic(join(process.cwd(), multerDest)));
  app.use(`/${logoDest}`, ExpressStatic(join(process.cwd(), logoDest)));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
