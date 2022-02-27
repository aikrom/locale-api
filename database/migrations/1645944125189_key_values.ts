import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class KeyValues extends BaseSchema {
  protected tableName = 'key_values'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('value').notNullable()
      table.string('language').notNullable()
      table.integer('key_id').unsigned().references('keys.id').onDelete('CASCADE')
      table.unique(['language', 'key_id'])

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
