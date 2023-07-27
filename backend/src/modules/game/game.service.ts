import { Injectable, InternalServerErrorException } from '@nestjs/common';
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

  async teamClick(
    clickData: TeamClickDto,
    clickedCustomerId: string,
  ): Promise<void> {
    const { teamName, numberOfClicks } = clickData;

    const teamDb = await this.teamService.getTeamByNameOrCreate(teamName);

    // - Transaction is needed in this case because we don't want to update team clicks
    // without auditing AND we don't want to audit without updating team clicks.
    // - There could be no transaction in the case we are fine with updating team clicks
    // without auditing
    try {
      await this.prismaService.$transaction(
        async (prismaTransaction: PrismaClient) => {
          await this.teamService.updateTeamClicks(
            { teamName, clicksToAdd: numberOfClicks },
            { prismaTransaction },
          );

          // since teamClick function can handle multiple clicks in 1 call then there has to
          // be createMany prisma function executed
          await prismaTransaction.clickAudit.createMany({
            data: Array.from({ length: numberOfClicks ?? 1 }, (_, index) => ({
              clickedByTeamId: teamDb.id,
              clickedByCustomerId: clickedCustomerId,
              clicks: teamDb.clicks + index + 1,
            })),
          });
        },
      );
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(
        err.message ?? 'Something went wrong during prisma transaction',
      );
    }
  }
}
