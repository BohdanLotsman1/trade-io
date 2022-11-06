import { UlidModel } from '../../../lib/models/ulidModel';
import { Model } from 'objection';
import { UserModel } from 'src/modules/user/models/user.model';
import { WalletModel } from 'src/modules/wallet/models/wallet.model';

export class TradeModel extends UlidModel {
  static get tableName() {
    return 'trade';
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.HasOneRelation,
        modelClass: UserModel,
        join: {
          from: 'trade.user_id',
          to: 'users.id',
        },
      },
      wallet: {
        relation: Model.HasOneRelation,
        modelClass: WalletModel,
        join: {
          from: 'trade.wallet_id',
          to: 'wallet.id',
        },
      },
    };
  }

  trade_price: number;
  direction: number;
  user_id: string;
  state: string;
  wallet_id: string;
  price_on_close?: number;
  result?: string;
  price_on_open: number;
  time: string;
  end_time: string;
  currency: string;
}
