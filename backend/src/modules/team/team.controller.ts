import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../authentication/guards/auth.guard';
import { TeamService } from './team.service';

@Controller('teams')
export class TeamController {
  constructor(private teamService: TeamService) {}

  @Get('/leaderboard')
  @UseGuards(AuthGuard)
  async getLeaderboard() {
    return await this.teamService.getTeams();
  }

  @Get(':name')
  @UseGuards(AuthGuard)
  async getTeamByName(@Param('name') name: string) {
    return await this.teamService.getTeamByName(name);
  }
}
