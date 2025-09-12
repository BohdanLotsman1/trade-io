import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('trades', (table) => {
    table.string('price_on_close').nullable().alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('trades', (table) => {
    table.string('price_on_close').notNullable().alter();
  });
}
