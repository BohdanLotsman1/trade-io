import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ILoginUser, IPasswordChange } from '../types';
import { loginSchema } from '../../../lib/validator/auth/login.validator';
import { YupOptions } from '../../../lib/validator/yup.validator';
import { AuthService } from '../services/auth.service';
import { HashService } from '../../../lib/services/hash.service';
import { changePasswordSchema } from 'src/lib/validator/auth/change-password.validator';
import { UserService } from 'src/modules/user/services/user.service';
import { WalletService } from 'src/modules/wallet/services/wallet.service';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private walletService: WalletService,
  ) {}

  @Post('login')
  async login(@Body() body: ILoginUser) {
    const payload = loginSchema.validateSync(body, YupOptions);
    const user = await this.userService.findByEmail(payload.email);
    const wallet = await this.walletService.getWallet(user.id);
    if (!user) {
      return {
        data: {
          message: new BadRequestException('User not found'),
        },
      };
    }

    const check = await HashService.check(body.password, user.password);

    if (!check) {
      return {
        data: {
          message: new BadRequestException('Password invalid'),
        },
      };
    }
    const token = await this.authService.login(user.id);

    return {
      data: {
        token,
        user,
        wallet,
      },
    };
  }

  @Get('logout')
  async logout(@Req() request) {
    try {
      await this.authService.logout(request['access_token']);
      return { message: 'Logout Success' };
    } catch (e) {
      console.log(e);
      return { message: 'Logout error' };
    }
  }

  @Get('/')
  async getAuthUser(@Req() request) {
    try {
      const user = await this.authService.getAuthUser(request['access_token']);
      const wallet = await this.walletService.getWallet(user.id);
      return {
        data: {
          user,
          wallet,
        },
      };
    } catch (e) {
      console.log(e);
      return { message: 'Get Auth User error' };
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

  @Get('refresh-token')
  async refreshToken(@Query('token') token: string) {
    const data = await this.authService.refreshToken(token);
    console.log(data);
    
    return {data}
  }
}
