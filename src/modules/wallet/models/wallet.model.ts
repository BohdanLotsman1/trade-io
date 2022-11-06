import { UlidModel } from '../../../lib/models/ulidModel';
import { Model } from 'objection';
import { UserModel } from 'src/modules/user/models/user.model';

export class WalletModel extends UlidModel {
  static get tableName() {
    return 'wallet';
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.HasOneRelation,
        modelClass: UserModel,
        join: {
          from: 'wallet.user_id',
          to: 'user.id',
        },
      },
    };
  }

  amount_of_money: number;
  user_id: string;
}
