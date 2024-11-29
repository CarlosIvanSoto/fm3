import {
  Controller,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UploadLogoService } from './upload-logo.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';

@Controller('upload')
export class UploadLogoController {
  constructor(
    private readonly configService: ConfigService,
    private readonly uploadLogoService: UploadLogoService,
  ) {}

  @Post('logo')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /png|jpg|webp/g,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ) {
    const fileName = await this.uploadLogoService.compressImage(file);
    const dest = this.configService.get<string>('LOGO_DEST', 'logos');
    return {
      originImage: `http://localhost:3000/${dest}/${fileName}`,
      compressImage: `http://localhost:3000/${dest}/compress/${fileName}`,
    };
  }
}
