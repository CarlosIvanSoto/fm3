import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Post,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(
    private readonly configService: ConfigService,
    private readonly appService: AppService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @HttpCode(HttpStatus.OK)
  @Post('app/register/:appName')
  async registerApp(
    @Param('appName') appName: string,
    @Body() signDto: Record<string, any>,
  ) {
    const secret = this.configService.get<string>('SIGN_SECRET', 'fm3');
    if (signDto.secret !== secret) throw new UnauthorizedException();
    const token = await this.appService.generateNewAppToken(appName);
    return {
      appName,
      token,
    };
  }

  @Post('upload/image')
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
    const fileName = await this.appService.compressImage(file);
    const dest = this.configService.get<string>('MULTER_DEST', 'uploads');
    return {
      originImage: `http://localhost:3000/${dest}/${fileName}`,
      compressImage: `http://localhost:3000/${dest}/compress/${fileName}`,
    };
  }
}
