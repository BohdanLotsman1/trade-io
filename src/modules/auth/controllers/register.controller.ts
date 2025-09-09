import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Res,
} from '@nestjs/common';
import { IRegisterUser } from '../types';
import { RegisterService } from '../services/register.service';
import { registerSchema } from '../../../lib/validator/user/register.validator';
import { YupOptions } from '../../../lib/validator/yup.validator';
import { WalletService } from 'src/modules/wallet/services/wallet.service';
import { AuthService } from '../services/auth.service';
import { UserService } from 'src/modules/user/services/user.service';

@Controller('register')
export class RegisterController {
  constructor(
    private registerService: RegisterService,
    private walletService: WalletService,
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('/')
  async registerCustomer(
    @Body() body: IRegisterUser,
    @Res({ passthrough: true }) res,
  ) {
    try {
      const validate = await registerSchema.validate(body, YupOptions);

      const user = await this.registerService.registerUser(
        validate as IRegisterUser,
      );
      const wallet = await this.walletService.createWallet(user.id);

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
      res.status(409);
      return new BadRequestException(e);
    }
  }
}
