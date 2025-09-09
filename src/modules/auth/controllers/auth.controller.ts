import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ILoginUser, IPasswordChange } from '../types';
import { loginSchema } from '../../../lib/validator/auth/login.validator';
import { YupOptions } from '../../../lib/validator/yup.validator';
import { AuthService } from '../services/auth.service';
import { HashService } from '../../../lib/services/hash.service';
import { changePasswordSchema } from 'src/lib/validator/auth/change-password.validator';
import { UserService } from 'src/modules/user/services/user.service';
import { WalletService } from 'src/modules/wallet/services/wallet.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private walletService: WalletService,
  ) {}

  @Post('login')
  async login(@Body() body: ILoginUser, @Res({ passthrough: true }) res) {
    try {
      const payload = loginSchema.validateSync(body, YupOptions);
      const user = await this.userService.findByEmail(payload.email);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const check = await HashService.check(body.password, user.password);

      if (!check) {
        throw new ForbiddenException('Password invalid');
      }

      const wallet = await this.walletService.getWallet(user.id);
      const { access_token, refresh_token } = this.authService.signTokens(user);

      this.authService.setCookies(res, access_token, refresh_token);

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

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    /* passport auto-redirects */
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req, @Res({ passthrough: true }) res) {
    try {
      const user = await this.authService.upsertOAuthUser(req.user);
      const { access_token, refresh_token } = this.authService.signTokens(user);

      this.authService.setCookies(res, access_token, refresh_token);

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

  @Get('logout')
  async logout(@Res({ passthrough: true }) res, @Req() req) {
    try {
      const user = await this.authService.getAuthUser(
        req.cookies?.access_token,
      );
      this.userService.updateUser(user.id, { refresh_token: null });
      res.clearCookie('access_token');
      res.clearCookie('refresh_token');
      return { message: 'Logout Success' };
    } catch (e) {
      console.log(e);
      return { message: 'Logout error' };
    }
  }

  @Get('/me')
  async getAuthUser(@Req() request) {
    try {
      const access = request.cookies?.access_token;
      const user = await this.authService.getAuthUser(access);
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
      console.log(e);
      return { message: new BadRequestException('Get Auth User error') };
    }
  }

  @Patch('password/:id')
  async password(@Param('id') id: string, @Body() body: IPasswordChange) {
    let data: any;

    try {
      const payload = changePasswordSchema.validateSync(body, YupOptions);

      const user = await this.userService.findById(id);

      const check = await HashService.check(
        this.authService.salt(payload.old_password),
        user.password,
      );

      if (!check) {
        data = { message: 'Password invalid' };
      } else {
        data = { message: 'Success' };
      }

      await this.userService.updateUser(user.id, {
        password: this.authService.hash(body.password),
      });

      return { data };
    } catch (e) {
      data = e;
      return { data };
    }
  }

  @Post('refresh-token')
  async refresh(@Req() req, @Res({ passthrough: true }) res) {
    return this.authService.refreshToken(req, res);
  }
}
