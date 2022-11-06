import { Response } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Connection, InjectConnection } from 'nestjs-objection';
import { AuthenticatedRequest } from './authVerify.middleware';
import { IToken } from '../models/token.model';

export interface AuthorizedRequest extends AuthenticatedRequest {}

@Injectable()
export class userVerifyMiddleware implements NestMiddleware {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    private jwtService: JwtService,
  ) {}

  async use(request: AuthorizedRequest, response: Response, next: Function) {
    const token = request.header('Authorization')?.replace('Bearer ', '');
    const data = this.jwtService.decode(token) as IToken;
    return next();
  }
}
