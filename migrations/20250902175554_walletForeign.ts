import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('wallets', (table) => {
    table.foreign('user_id').references('id').inTable('users');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('wallets', (table) => {
    table.dropForeign('user_id');
  });
}
