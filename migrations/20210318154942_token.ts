import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('access_tokens', (table) => {
    table.string('user_id');
    table.string('access_token', 255);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('access_tokens');
}
