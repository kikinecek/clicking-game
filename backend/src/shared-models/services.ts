import { PrismaClient } from '@prisma/client';

export class ServiceOptions {
  prismaTransaction?: PrismaClient;
}
