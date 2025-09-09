import { UlidModel } from '../../../lib/models/ulidModel';
import { Model } from 'objection';
import { UserModel } from 'src/modules/user/models/user.model';

export class WalletModel extends UlidModel {
  static get tableName() {
    return 'wallets';
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.HasOneRelation,
        modelClass: UserModel,
        join: {
          from: 'wallets.user_id',
          to: 'users.id',
        },
      },
    };
  }

  amount_of_money: number;
  user_id: string;
}
