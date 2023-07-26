import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AnonymousAuthGuard } from './guards/anonymous-auth.guard';
import { SignInDto } from './models/sign-in.dto';
import { SignUpDto } from './models/sign-up.dto';

@Controller('auth')
export class AuthenticationController {
  constructor(private authenticationService: AuthenticationService) {}

  @Post('/sign-up')
  @UseGuards(AnonymousAuthGuard)
  async signUp(@Body() body: SignUpDto) {
    await this.authenticationService.signUp(body);
  }

  @Post('/sign-in')
  @UseGuards(AnonymousAuthGuard)
  async signIn(@Body() body: SignInDto) {
    return await this.authenticationService.signIn(body);
  }
}
