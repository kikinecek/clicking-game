import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { TeamService } from '../team/team.service';
import { TeamClickDto } from './models/team-click.dto';

@Injectable()
export class GameService {
  constructor(
    private prismaService: PrismaService,
    private teamService: TeamService,
  ) {}

  async teamClick(clickData: TeamClickDto, clickedCustomerId: string) {
    const { teamName, numberOfClick } = clickData;

    const teamDb = await this.teamService.getTeamByNameOrCreate(teamName);

    // - Transaction is needed in this case because we dont want to update team clicks
    // without auditing AND we don't want to audit without updating team clicks.
    // - There could be no transaction in the case we are fine with updating team clicks
    // without auditing
    await this.prismaService.$transaction(
      async (prismaTransaction: PrismaClient) => {
        await this.teamService.updateTeamClicks(
          { teamName, clicksToAdd: numberOfClick },
          { prismaTransaction },
        );

        // since teamClick function can handle multiple clicks in 1 call then there has to
        // be createMany prisma function executed
        await prismaTransaction.clickAudit.createMany({
          data: Array.from({ length: numberOfClick ?? 1 }, (_, index) => ({
            clickedByTeamId: teamDb.id,
            clickedByCustomerId: clickedCustomerId,
            clicks: teamDb.clicks + index + 1,
          })),
        });
      },
    );
  }
}
