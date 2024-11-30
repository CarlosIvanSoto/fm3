import { Module } from '@nestjs/common';
import { UploadLogoService } from './upload-logo.service';
import { UploadLogoController } from './upload-logo.controller';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { diskStorage } from 'multer';
import { parse } from 'path';
import { ApplicationTokenModule } from 'src/application-token/application-token.module';

@Module({
  imports: [
    ConfigModule,
    ApplicationTokenModule,
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        storage: diskStorage({
          destination: (req, file, cb) =>
            cb(null, `./${configService.get<string>('LOGO_DEST', 'logos')}`),
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
  controllers: [UploadLogoController],
  providers: [UploadLogoService],
})
export class UploadLogoModule {}
