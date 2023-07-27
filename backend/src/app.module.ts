import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { GameModule } from './modules/game/game.module';
import { TeamModule } from './modules/team/team.module';

@Module({
  imports: [
    AuthenticationModule,
    GameModule,
    TeamModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
})
export class AppModule {}
