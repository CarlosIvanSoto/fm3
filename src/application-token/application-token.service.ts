import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';

// Entidad de Token de Aplicación
interface ApplicationToken {
  id: string;
  token: string;
  name: string;
  lastUsed: Date;
  deletedAt?: Date | null;
  createdAt: Date;
}

@Injectable()
export class ApplicationTokenService {
  constructor(private prisma: PrismaService) {}

  async createApplicationToken(name: string): Promise<string> {
    const token = `fm3_${randomUUID()}`;
    try {
      await this.prisma.applicationToken.create({
        data: {
          name,
          token,
          lastUsed: new Date(),
        },
      });
    } catch (e: any) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // The .code property can be accessed in a type-safe manner
        if (e.code === 'P2002') {
          console.log(
            'There is a unique constraint violation, a new user cannot be created with this name',
          );
          throw new ConflictException();
        }
      }
      throw e;
    }
    return token;
  }

  async validateApplicationToken(
    token: string,
  ): Promise<ApplicationToken | null> {
    const appToken = await this.prisma.applicationToken.findUnique({
      where: { token, deletedAt: null },
    });

    if (!appToken) return null;

    // Actualizar última vez utilizado
    await this.prisma.applicationToken.update({
      where: { id: appToken.id },
      data: { lastUsed: new Date() },
    });

    return appToken;
  }

  async listApplicationTokens() {
    return this.prisma.applicationToken.findMany({
      select: {
        id: true,
        name: true,
        lastUsed: true,
        createdAt: true,
        deletedAt: true,
      },
    });
  }

  async disableApplicationToken(tokenId: string) {
    await this.prisma.applicationToken.update({
      where: { id: tokenId },
      data: { deletedAt: new Date() },
    });
  }
}
