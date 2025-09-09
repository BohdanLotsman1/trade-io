import { Controller, Get, Param, Put } from '@nestjs/common';
import { WalletService } from '../services/wallet.service';

@Controller('wallet')
export class WalletController {
  constructor(private walletService: WalletService) {}

  @Get('/:id')
  async getWallet(@Param('id') id: string) {
    const data = await this.walletService.getWallet(id);
    return { data };
  }
  @Put('/:id')
  async refillWallet(@Param('id') id: string) {
    const data = await this.walletService.refillWallet(id);
    return { data };
  }
}
