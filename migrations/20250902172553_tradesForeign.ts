import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('trades', (table) => {
    table.foreign('user_id').references('id').inTable('users');
    table.foreign('wallet_id').references('id').inTable('wallets');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('trades', (table) => {
    table.dropForeign('user_id');
    table.dropForeign('wallet_id');
  });
}
