import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtRequest } from 'src/shared-models/jwt';
import { AuthGuard } from '../authentication/guards/auth.guard';
import { GameService } from './game.service';
import { TeamClickDto } from './models/team-click.dto';

@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}

  @Post('/team-click')
  @UseGuards(AuthGuard)
  async teamClick(@Body() data: TeamClickDto, @Req() req: JwtRequest) {
    if (!data.teamName) {
      throw new BadRequestException('Team name has not been provided!');
    }

    await this.gameService.teamClick(data, req.customer.sub);
  }
}
