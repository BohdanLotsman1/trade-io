import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { IRegisterUser } from '../types';
import { RegisterService } from '../services/register.service';
import { registerSchema } from '../../../lib/validator/user/register.validator';
import { YupOptions } from '../../../lib/validator/yup.validator';
import { WalletService } from 'src/modules/wallet/services/wallet.service';

@Controller('register')
export class RegisterController {
  constructor(private registerService: RegisterService, 
    private walletService: WalletService) {}

  @Post('/')
  async registerCustomer(@Req() request, @Body() body: IRegisterUser) {
    let data: any;
    try {
      const validate = await registerSchema.validate(body, YupOptions);

      const user = await this.registerService.registerUser(request, validate);
      await this.walletService.createWallet(user.id)
      return { data: { user } };
    } catch (e) {
      data = e;
      console.log(e);
    }
    return { data };
  }
}
