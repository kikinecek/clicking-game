import { Module } from '@nestjs/common';
import { AuditModule } from '../audit/audit.module';
import { CustomerModule } from '../customer/customer.module';
import { PrismaModule } from '../prisma/prisma.module';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';

@Module({
  imports: [PrismaModule, CustomerModule, AuditModule],
  controllers: [TeamController],
  providers: [TeamService],
  exports: [TeamService],
})
export class TeamModule {}
