import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  Injectable,
  Response,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserModel } from '../../user/models/user.model';
import { HashService } from '../../../lib/services/hash.service';
import _ from 'underscore';
import { UserService } from 'src/modules/user/services/user.service';
import * as bcrypt from 'bcrypt';
import { WalletService } from 'src/modules/wallet/services/wallet.service';

@Injectable()
export class AuthService {
  constructor(
    protected readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly walletService: WalletService,
  ) {}

  async upsertOAuthUser(oauth: {
    provider: string;
    providerAccountId: string;
    email: string | null;
    name?: string | null;
    avatarUrl?: string | null;
    accessToken?: string | null;
    refreshToken?: string | null;
  }) {
    const byProvider = await this.userService.findByProvider(
      oauth.provider,
      oauth.providerAccountId,
    );
    if (byProvider) return byProvider;

    const user = await this.userService.createUserAndLinkOauth({
      email: oauth.email,
      name: oauth.name,
      avatarUrl: oauth.avatarUrl,
      provider: oauth.provider,
      providerAccountId: oauth.providerAccountId,
      accessToken: oauth.accessToken,
      refreshToken: oauth.refreshToken,
    });
    return user;
  }

  async getAuthUser(access_token: string) {
    const decoded = this.jwtService.decode(access_token);
    const user: UserModel = await this.userService.findById(decoded.sub);

    return user;
  }

  async refreshToken(req: any, res: any) {
    try {
      const incoming_refresh_token = req.cookies?.refresh_token;

      const data = this.jwtService.decode(incoming_refresh_token);

      await this.jwtService.verifyAsync(incoming_refresh_token, {
        secret: process.env.JWT_SECRET,
      });

      const user: UserModel = await this.userService.findById(data.sub);

      if (!user || !user.refresh_token) {
        if (incoming_refresh_token) {
          res.clearCookie('refresh_token');
        }
        throw new HttpException(
          {
            statusCode: 400,
            message: ['Token invalid. User not found or not logged in'],
            error: 'Bad Request',
          },
          400,
        );
      }

      const check = await HashService.check(
        this.salt(incoming_refresh_token),
        user.refresh_token,
      );

      if (!check) {
        await this.userService.updateUser(user.id, { refresh_token: null });
        res.clearCookie('refresh_token');
        throw new ForbiddenException('refresh token reuse');
      }

      const { access_token, refresh_token } = this.signTokens(user);

      await this.userService.updateUser(user.id, {
        refresh_token: this.hash(refresh_token),
      });

      this.setCookies(res, access_token, refresh_token);

      const wallet = await this.walletService.getWallet(user.id);

      return {
        data: {
          user: {
            ...user,
            wallet,
          },
        },
      };
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  metadata(token: string, exclude: string[]) {
    return {
      token,
      ..._.omit(this.jwtService.decode(token), exclude),
    };
  }

  hash(password: string) {
    return HashService.hash(this.salt(password));
  }

  signTokens(user: any) {
    const payload = { sub: user.id, email: user.email };
    const access_token = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '2d' });
    return { access_token, refresh_token };
  }

  setCookies(res: any, access_token: string, refresh_token: string) {
    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 15,
    });
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });

    const decoded = this.jwtService.decode(refresh_token);

    this.userService.updateUser(decoded.sub, {
      refresh_token: this.hash(refresh_token),
    });
  }

  salt(password: string) {
    return HashService.salt(password);
  }
}
