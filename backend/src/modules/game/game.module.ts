import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { TeamModule } from '../team/team.module';
import { GameController } from './game.controller';
import { GameService } from './game.service';

@Module({
  imports: [PrismaModule, TeamModule],
  controllers: [GameController],
  providers: [GameService],
})
export class GameModule {}
