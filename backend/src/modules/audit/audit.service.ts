import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CustomerClicks } from './models/customer-clicks.model';

@Injectable()
export class AuditService {
  constructor(private prismaService: PrismaService) {}

  private transformToCustomersClicks(
    rawCustomersClicks: { clickedByCustomerId: string; _count: number }[],
  ): CustomerClicks[] {
    return rawCustomersClicks.map((cc) => ({
      customerId: cc.clickedByCustomerId,
      clicks: cc._count,
    }));
  }

  async getCustomersClicksByTeamId(teamId: string): Promise<CustomerClicks[]> {
    try {
      const customerClicks = await this.prismaService.clickAudit.groupBy({
        by: ['clickedByCustomerId'],
        where: { clickedByTeamId: teamId },
        _count: true,
      });

      return this.transformToCustomersClicks(customerClicks);
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(
        err.message ?? 'Something went wrong during prisma query',
      );
    }
  }
}
