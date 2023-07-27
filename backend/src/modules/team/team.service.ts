import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ServiceOptions } from 'src/shared-models/services';
import { AuditService } from '../audit/audit.service';
import { CustomerClicks } from '../audit/models/customer-clicks.model';
import { CustomerService } from '../customer/customer.service';
import { Customer } from '../customer/models/customer.model';
import { PrismaService } from '../prisma/prisma.service';
import { SelectOptions } from './models/select-options';
import { TeamWithAudit } from './models/team-with-audit.model';
import { Team } from './models/team.model';
import { UpdateTeamClicksDto } from './models/update-team-clicks.dto';

@Injectable()
export class TeamService {
  constructor(
    private prismaService: PrismaService,
    private customerService: CustomerService,
    private auditService: AuditService,
  ) {}

  private transformToTeamWithAudits(
    team: Team,
    audits: CustomerClicks[],
    customers: Customer[],
  ): TeamWithAudit {
    const auditsMap = new Map<string, number>(
      audits.map((a) => [a.customerId, a.clicks]),
    );

    return {
      ...team,
      customers: customers.map((c) => ({
        ...c,
        clicks: auditsMap.get(c.id) ?? 0,
      })),
    };
  }

  async getTeams(selectOptions?: SelectOptions): Promise<Team[]> {
    const { pagination } = selectOptions ?? {};
    const { skip, take } = pagination ?? {};

    try {
      return await this.prismaService.team.findMany({
        skip,
        take,
        orderBy: { clicks: 'desc' },
      });
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(
        err.message ?? 'Something went wrong during prisma query',
      );
    }
  }

  async getTeamByName(name: string): Promise<Team | null> {
    try {
      return await this.prismaService.team.findUnique({ where: { name } });
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(
        err.message ?? 'Something went wrong during prisma query',
      );
    }
  }

  async getTeamWithAuditByName(name: string): Promise<TeamWithAudit> {
    try {
      const team = await this.prismaService.team.findUnique({
        where: { name },
      });

      if (!team) {
        throw new NotFoundException('Team not found');
      }

      const teamCustomerClicks =
        await this.auditService.getCustomersClicksByTeamId(team.id);

      const customers = await this.customerService.getCustomersByIds(
        teamCustomerClicks.map((tcc) => tcc.customerId),
      );

      if (teamCustomerClicks.length !== customers.length) {
        throw new InternalServerErrorException(
          'There is some inconsistency between customers and audits in db',
        );
      }

      return this.transformToTeamWithAudits(
        team,
        teamCustomerClicks,
        customers,
      );
    } catch (err) {
      console.log(err);

      if (this.prismaService.isPrismaError(err)) {
        throw new InternalServerErrorException(
          err.message ?? 'Something went wrong during prisma query',
        );
      }

      throw err;
    }
  }

  async createTeam(name: string): Promise<Team> {
    try {
      return await this.prismaService.team.create({
        data: { name, clicks: 0 },
      });
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(
        err.message ?? 'Something went wrong during prisma query',
      );
    }
  }

  async getTeamByNameOrCreate(name: string): Promise<Team> {
    return (await this.getTeamByName(name)) ?? (await this.createTeam(name));
  }

  async updateTeamClicks(data: UpdateTeamClicksDto, options?: ServiceOptions) {
    const { teamName, clicksToAdd } = data;

    const { prismaTransaction } = options ?? {};

    try {
      return await (prismaTransaction ?? this.prismaService).team.update({
        where: { name: teamName },
        data: { clicks: { increment: clicksToAdd ?? 1 } },
      });
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(
        err.message ?? 'Something went wrong during prisma query',
      );
    }
  }
}
