import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('wallets', (table) => {
    table.string('id', 45).primary();
    table.float('amount_of_money').notNullable();
    table.timestamps();
    table.string('user_id').notNullable();
    table.dateTime('deleted_at').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('wallets');
}
