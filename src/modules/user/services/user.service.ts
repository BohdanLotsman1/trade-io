import { Injectable } from '@nestjs/common';
import { UserModel } from '../models/user.model';
import { transaction } from 'objection';
import { OauthAccountModel } from 'src/modules/auth/oauth-account.model';

@Injectable()
export class UserService {
  async findById(id): Promise<UserModel> {
    return UserModel.query().findById(id);
  }

  async findByProvider(provider: string, providerAccountId: string) {
    const row = await OauthAccountModel.query()
      .where({ provider, providerAccountId })
      .withGraphFetched('user')
      .first();
    return row?.user ?? null;
  }

  async findByEmail(email): Promise<UserModel> {
    return UserModel.query().where('email', email).limit(1).first();
  }

  async updateUser(id: string, userData: any) {
    await UserModel.query().update(userData).where(`id`, id);

    const data = await UserModel.query().select().where('id', id);

    return { data };
  }

  async createUserAndLinkOauth(data: {
    email: string | null;
    name?: string | null;
    avatarUrl?: string | null;
    provider: string;
    providerAccountId: string;
    accessToken?: string | null;
    refreshToken?: string | null;
  }) {
    return transaction(OauthAccountModel.knex(), async (trx) => {
      let user: UserModel | undefined;
      try {
        if (data.email) {
          user = await UserModel.query(trx).findOne({ email: data.email });
        }
        if (!user) {
          user = await UserModel.query(trx).insert({
            email: data.email,
            name: data.name ?? null,
            avatar_url: data.avatarUrl ?? null,
          });
        }
        const exists = await OauthAccountModel.query(trx).findOne({
          provider: data.provider,
          providerAccountId: data.providerAccountId,
        });
        if (!exists) {
          await OauthAccountModel.query(trx).insert({
            userId: user.id,
            provider: data.provider,
            providerAccountId: data.providerAccountId,
            accessToken: data.accessToken ?? null,
            refreshToken: data.refreshToken ?? null,
          });
        }
        return user;
      } catch (error) {
        throw error;
      }
    });
  }
  async deleteUser(userID: string): Promise<number> {
    return UserModel.query().delete().where('id', userID);
  }
}
