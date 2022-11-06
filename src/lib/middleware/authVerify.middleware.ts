import { Request, Response } from 'express';
import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Connection, InjectConnection } from 'nestjs-objection';
import { AuthService } from '../../modules/auth/services/auth.service';
import { UserModel } from '../../modules/user/models/user.model';
import { IToken } from '../models/token.model';

export interface IAuthenticatedUser {
  id: string;
  email: string;
}

export interface AuthenticatedRequest extends Request {
  user: IAuthenticatedUser;
  access_token: string;
}

// Authentication facility
@Injectable()
export class authVerifyMiddleware implements NestMiddleware {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    private jwtService: JwtService,
    private authService: AuthService,
  ) {}

  async use(request: AuthenticatedRequest, response: Response, next: Function) {
    const token = request.header('Authorization')?.replace('Bearer ', '');
    const data = this.jwtService.decode(token) as IToken;

    try {
      await this.jwtService.verifyAsync(token);
    } catch (e) {
      throw new UnauthorizedException('Invalid token');
    }

    if (!data) {
      throw new UnauthorizedException('Invalid token');
    }

    if (
      !data.access_token ||
      !data.sub ||
      !(await this.authService.isTokenExists(data.access_token, data.sub))
    ) {
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

    request.access_token = data.access_token;

    return next();
  }
}
