import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserModel } from '../../user/models/user.model';
import { HashService } from '../../../lib/services/hash.service';
import { TokenService } from '../../../lib/services/token.service';
import _ from 'underscore';
import { UserService } from 'src/modules/user/services/user.service';

@Injectable()
export class AuthService {
  constructor(
    protected readonly jwtService: JwtService,
    private tokenService: TokenService,
    private readonly userService: UserService,
  ) {}

  async logout(token) {
    await this.tokenService.destroy(token);
  }

  async getAuthUser(access_token: string) {
    const userData = await this.tokenService.findByToken(access_token);
    const user: UserModel = await this.userService.findById(userData.user_id);

    return user;
  }

  async refreshToken(refresh_token: string) {
    const data = this.jwtService.decode(refresh_token);    
    const metadata = data['metadata'] ?? {};
    await this.jwtService.verifyAsync(refresh_token);
    const user: UserModel = await this.userService.findById(data['sub']);

    if (
      await this.tokenService.isTokenBlacklisted(data['access_token'], user.id)
    ) {
      throw new HttpException(
        {
          statusCode: 400,
          message: ['Token invalid'],
          error: 'Bad Request',
        },
        400,
      );
    }

    await this.tokenService.blacklistToken(user.id, data['access_token']);
    return this.login(user.id, metadata);
  }

  async isTokenExists(token: string, userId: string): Promise<boolean> {
    return (await this.tokenService.find(token, userId)) !== void 0;
  }

  async login(id: string, metadata = {}) {
    const access_token = HashService.rand();

    const payload = {
      sub: id,
      access_verify: HashService.base64_encode(HashService.rand(24)),
      access_token,
      metadata: metadata,
    };

    await this.tokenService.create({
      user_id: id,
      access_token,
    });

    const jwt_access_token = this.jwtService.sign(payload, {
      expiresIn: ['test', 'development'].includes(process.env.NODE_ENV)
        ? '1y'
        : '1h',
    });


    return {
      access_token: this.metadata(jwt_access_token, Object.keys(payload)),
    };
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

  salt(password: string) {
    return HashService.salt(password);
  }
}
