import { Inject, Injectable, Scope } from '@nestjs/common';
import { Connection, InjectConnection } from 'nestjs-objection';

@Injectable()
export class TokenService {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  private accessTokensTable = 'access_token';
  private blacklistedTokensTable = 'refresh_token_blacklist';

  async find(access_token: string, user_id: string) {
    return this.connection
      .table(this.accessTokensTable)
      .where('user_id', user_id)
      .where('access_token', access_token)
      .first();
  }

  async findByToken(access_token: string) {
    return this.connection
      .table(this.accessTokensTable)
      .where('access_token', access_token)
      .first();
  }

  async isTokenBlacklisted(token: string, user_id: string): Promise<boolean> {
    return (
      (await this.connection
        .table(this.blacklistedTokensTable)
        .where('user_id', user_id)
        .where('access_token', token)
        .first()) !== void 0
    );
  }

  async blacklistToken(userId, token) {
    await this.connection.table(this.blacklistedTokensTable).insert({
      user_id: userId,
      access_token: token,
    });
  }

  async destroy(access_token: string) {
    await this.connection
      .table(this.accessTokensTable)
      .delete()
      .where('access_token', access_token);
  }

  async create(data: { user_id: string; access_token: string }) {
    await this.connection.table(this.accessTokensTable).insert({
      ...data,
    });
  }
}
