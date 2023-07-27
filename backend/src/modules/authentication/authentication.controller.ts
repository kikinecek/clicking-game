import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
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
    if (!body.email || !body.password) {
      throw new UnauthorizedException(
        'Email or password has not been provided',
      );
    }
    await this.authenticationService.signUp(body);
  }

  @Post('/sign-in')
  @UseGuards(AnonymousAuthGuard)
  async signIn(@Body() body: SignInDto) {
    if (!body.email || !body.password) {
      throw new UnauthorizedException(
        'Email or password has not been provided',
      );
    }
    return await this.authenticationService.signIn(body);
  }
}
