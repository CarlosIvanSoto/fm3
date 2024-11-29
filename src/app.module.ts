import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { parse } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        storage: diskStorage({
          destination: (req, file, cb) =>
            cb(
              null,
              `./${configService.get<string>('MULTER_DEST', 'uploads')}`,
            ),
          filename: (req, file, cb) => {
            const filename: string = parse(file.originalname).name.replace(
              /\s/g,
              '-',
            );
            const extension: string = parse(file.originalname).ext;
            cb(null, `${filename}${extension}`);
          },
        }),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
