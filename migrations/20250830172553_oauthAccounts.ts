import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('oauth_accounts', (table) => {
    table.bigIncrements('id').primary();
    table.string('user_id').notNullable();
    table.string('provider').notNullable(); // 'google' | 'github' | 'apple' | 'facebook'
    table.string('provider_account_id').notNullable(); // subject/id from the provider
    table.string('access_token', 2048); // optional to store
    table.string('refresh_token', 2048); // optional to store
    table.timestamp('access_token_expires_at'); // optional
    table.unique(['provider', 'provider_account_id']);
    table.index(['user_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('oauth_accounts');
}
