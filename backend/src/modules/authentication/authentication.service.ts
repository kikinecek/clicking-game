import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CustomerService } from '../customer/customer.service';
import { SignUpDto } from './models/sign-up.dto';
import { SignInDto } from './models/sign-in.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthenticationService {
  private readonly SALT = bcrypt.genSaltSync(10);

  constructor(
    private customerService: CustomerService,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async signUp(data: SignUpDto) {
    const { email, password } = data;
    if (await this.customerService.getCustomerByEmail(email)) {
      throw new Error('User already exists!');
    }

    const hashedPassword = await bcrypt.hash(password, this.SALT);
    await this.customerService.createCustomer({ email, hashedPassword });
  }

  async signIn(data: SignInDto) {
    const { email, password } = data;

    const customerDb = await this.customerService.getCustomerByEmail(email);
    if (!customerDb) {
      throw new UnauthorizedException('Incorrect email or password');
    }

    if (!(await bcrypt.compare(password, customerDb.hashedPassword))) {
      throw new UnauthorizedException('Incorrect email or password');
    }

    const jwtPayload = { sub: customerDb.id, email };
    return {
      access_token: await this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get<string>('JWT_SECRET'),
      }),
    };
  }
}
