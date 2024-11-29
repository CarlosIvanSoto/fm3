import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { static as ExpressStatic } from 'express';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

function upsertDir() {
  const dest = process.env.MULTER_DEST ?? 'uploads';

  const uploadDir = join(process.cwd(), dest, 'compress');
  if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir, { recursive: true });
  }
  return dest;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const dest = upsertDir();
  app.use(`/${dest}`, ExpressStatic(join(process.cwd(), dest)));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
