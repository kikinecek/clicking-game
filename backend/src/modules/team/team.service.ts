import { Injectable } from '@nestjs/common';
import { ServiceOptions } from 'src/shared-models/services';
import { PrismaService } from '../prisma/prisma.service';
import { Team } from './models/team.model';
import { UpdateTeamClicksDto } from './models/update-team-clicks.dto';

@Injectable()
export class TeamService {
  constructor(private prismaService: PrismaService) {}

  async getTeams(): Promise<Team[]> {
    return await this.prismaService.team.findMany();
  }

  async getTeamByName(name: string): Promise<Team | null> {
    return await this.prismaService.team.findUnique({ where: { name } });
  }

  async createTeam(name: string): Promise<Team> {
    return await this.prismaService.team.create({ data: { name, clicks: 0 } });
  }

  async getTeamByNameOrCreate(name: string): Promise<Team> {
    return (await this.getTeamByName(name)) ?? (await this.createTeam(name));
  }

  async updateTeamClicks(data: UpdateTeamClicksDto, options?: ServiceOptions) {
    const { teamName, clicksToAdd } = data;

    const { prismaTransaction } = options ?? {};

    return await (prismaTransaction ?? this.prismaService).team.update({
      where: { name: teamName },
      data: { clicks: { increment: clicksToAdd ?? 1 } },
    });
  }
}
