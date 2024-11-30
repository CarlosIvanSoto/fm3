import { ApplicationTokenGuard } from './application-token.guard';
import { Module } from '@nestjs/common';
import { ApplicationTokenService } from './application-token.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PrismaModule, ConfigModule],
  providers: [ApplicationTokenService, ApplicationTokenGuard],
  exports: [ApplicationTokenService, ApplicationTokenGuard],
})
export class ApplicationTokenModule {}
