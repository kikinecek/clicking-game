import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  isPrismaError(err: any): boolean {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return true;
    }

    return false;
  }
}
