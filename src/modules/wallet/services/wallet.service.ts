import { HttpException, Injectable } from '@nestjs/common';
import { WalletModel } from '../models/wallet.model';

@Injectable()
export class WalletService {

  async getWallet(id: string): Promise<WalletModel> {
    return WalletModel.query().where('user_id', id).first();
  }

  async createWallet(id: string): Promise<WalletModel> {
    const wallet = {
      user_id : id,
      amount_of_money: 10000,
    }
    
    return WalletModel.query().insert(wallet);
  }

  async refillWallet(id: string): Promise<WalletModel> {
    await WalletModel.query().update({amount_of_money: 10000}).where('id', id);
    return WalletModel.query().select().where('id', id).first();
  }
}
