import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '../authentication/guards/auth.guard';
import { GameService } from './game.service';
import { TeamClickDto } from './models/team-click.dto';

@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}

  @Post('/team-click')
  @UseGuards(AuthGuard)
  async teamClick(@Body() data: TeamClickDto, @Req() req: Request) {
    // @ts-ignore
    await this.gameService.teamClick(data, req.user.sub);
  }
}
