import { Injectable } from '@nestjs/common';
import { Model } from 'objection';
import { UlidModel } from 'src/lib/models/ulidModel';
import { OauthAccountModel } from 'src/modules/auth/oauth-account.model';
import _ from 'underscore';

@Injectable()
export class UserModel extends UlidModel {
  static get tableName() {
    return 'users';
  }

  email: string;
  name: string;
  password: string;
  password_hash: string;
  refresh_token: string;
  avatar_url: string;

  get $secureFields(): string[] {
    return ['password'];
  }

  $formatJson(json) {
    json = super.$formatJson(json);
    return _.omit(json, this.$secureFields);
  }
  oauthAccounts?: OauthAccountModel[];

  static relationMappings = {
    oauthAccounts: {
      relation: Model.HasManyRelation,
      modelClass: OauthAccountModel,
      join: { from: 'users.id', to: 'oauth_accounts.user_id' },
    },
  };
}
