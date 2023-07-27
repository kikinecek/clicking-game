import { Body, Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../authentication/guards/auth.guard';
import { SelectOptions } from './models/select-options';
import { TeamService } from './team.service';

@Controller('team')
export class TeamController {
  constructor(private teamService: TeamService) {}

  @Get('/leaderboard')
  @UseGuards(AuthGuard)
  async getLeaderboard(@Body('selectOptions') selectOptions?: SelectOptions) {
    return await this.teamService.getTeams(selectOptions);
  }

  @Get(':name')
  @UseGuards(AuthGuard)
  async getTeamByName(@Param('name') name: string) {
    return await this.teamService.getTeamWithAuditByName(name);
  }
}
