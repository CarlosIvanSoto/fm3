import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { static as ExpressStatic } from 'express';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);
  const DEST = configService.get<string>('MULTER_DEST', 'uploads');

  const uploadDir = join(process.cwd(), DEST, 'compress');
  if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir, { recursive: true });
  }
  app.use(`/${DEST}`, ExpressStatic(join(process.cwd(), DEST)));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
