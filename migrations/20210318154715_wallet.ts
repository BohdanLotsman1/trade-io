import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('wallet', (table) => {
    table.string('id').primary();
    table.float('amount_of_money').notNullable();
    table.float('trade_id').notNullable();
    table.string('user_id').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('wallet');
}
