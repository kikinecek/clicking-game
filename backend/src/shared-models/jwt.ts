import { Request } from 'express';

export class JwtPayload {
  sub: string;
  email: string;
}

export type JwtRequest = Request & { customer: JwtPayload };
