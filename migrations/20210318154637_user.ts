import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('users', (table) => {
    table.string('id', 45).primary();
    table.string('email', 100).notNullable().unique();
    table.string('name', 50).notNullable();
    table.string('password', 255).notNullable();
    table.string('password_hash').nullable().alter(); // allow passwordless SSO users
    table.string('avatar_url').nullable();
    table.timestamps();
    table.dateTime('deleted_at').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('users');
}
