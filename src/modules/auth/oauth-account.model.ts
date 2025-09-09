// src/auth/oauth-account.model.ts

import { Model } from 'objection';
import { UlidModel } from 'src/lib/models/ulidModel';
import { UserModel } from '../user/models/user.model';

export class OauthAccountModel extends UlidModel {
  static tableName = 'oauth_accounts';
  userId!: string;
  provider!: string;
  providerAccountId!: string;
  accessToken?: string | null;
  refreshToken?: string | null;
  accessTokenExpiresAt?: string | null;

  user?: UserModel;

  static relationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: UserModel,
      join: { from: 'oauth_accounts.user_id', to: 'users.id' },
    },
  };
}
