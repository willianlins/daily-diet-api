import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('meals', (table) => {
    table.uuid('user_id').index()
    table.text('name').notNullable()
    table.text('description').notNullable()
    table.dateTime('date')
    table.boolean('diet')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('meals')
}
