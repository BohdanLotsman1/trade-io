import { HttpException, Injectable } from '@nestjs/common';
import { UserModel } from '../models/user.model';
import knex from 'knex';

@Injectable()
export class UserService {
  async findById(id): Promise<UserModel> {
    return UserModel.query().findById(id);
  }
  async findByProvider(provider: string, providerAccountId: string) {
    return UserModel.query()
      .join('oauth_accounts', 'users.id', 'oauth_accounts.user_id')
      .where({ provider, provider_account_id: providerAccountId })
      .select('users.*')
      .first();
  }
  async findByEmail(email): Promise<UserModel> {
    return UserModel.query().where('email', email).limit(1).first();
  }

  async updateUser(id: string, userData: any) {
    await UserModel.query().update(userData).where(`id`, id);

    const data = await UserModel.query().select().where('id', id);

    return { data };
  }
  async linkOauthAccount(
    userId: number,
    data: {
      provider: string;
      provider_account_id: string;
      access_token?: string;
      refresh_token?: string;
      access_token_expires_at?: Date | null;
    },
  ) {
    const row = { user_id: userId, ...data };
    const exists = await knex('oauth_accounts')
      .where({
        provider: data.provider,
        provider_account_id: data.provider_account_id,
      })
      .first();
    if (!exists) await knex('oauth_accounts').insert(row);
  }
  async createUser({ email, name, avatar_url }: any) {
    const user = await UserModel.query().insert({ email, name, avatar_url });
    return user;
  }
  async deleteUser(userID: string): Promise<number> {
    return UserModel.query().delete().where('id', userID);
  }
}
