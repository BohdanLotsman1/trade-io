import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('trades', (table) => {
    table.string('id').primary();
    table.string('user_id').notNullable();
    table.float('trade_price').notNullable();
    table.string('direction').nullable();
    table.string('state').notNullable();
    table.string('price_on_close').notNullable();
    table.string('result').notNullable();
    table.string('price_on_open').notNullable();
    table.string('time').notNullable();
    table.string('end_time').notNullable();
    table.string('currency').notNullable();
    table.string('wallet_id').notNullable();
    table.timestamps();
    table.dateTime('deleted_at').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('trades');
}
