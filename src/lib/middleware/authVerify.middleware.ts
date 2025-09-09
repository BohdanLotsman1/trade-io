import { Request, Response } from 'express';
import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// import { Connection, InjectConnection } from 'nestjs-objection';
import { UserModel } from '../../modules/user/models/user.model';
import { IToken } from '../models/token.model';
import { RequestHandler } from '@nestjs/common/interfaces';

export interface IAuthenticatedUser {
  id: string;
  email: string;
}

export interface AuthenticatedRequest extends Request {
  user: IAuthenticatedUser;
  access_token: string;
  refresh_token: string;
}

// Authentication facility
@Injectable()
export class authVerifyMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  async use(request: AuthenticatedRequest, _: Response, next: Function) {
    const token = request.cookies['access_token'];

    if ((request as any)?._parsedUrl?.pathname === '/auth/refresh-token') {
      return next();
    }
    const data = this.jwtService.decode(token) as IToken;

    try {
      await this.jwtService.verifyAsync(token);
    } catch (e) {
      throw new UnauthorizedException('Invalid token');
    }

    if (!data) {
      throw new UnauthorizedException('Invalid token');
    }

    if (!token) {
      throw new UnauthorizedException('Token does not exist');
    }

    const user_id = data.sub;

    if (!user_id) {
      throw new UnauthorizedException('Token does not contain user ID');
    }

    const user = await UserModel.query().findById(user_id);

    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }

    return next();
  }
}
