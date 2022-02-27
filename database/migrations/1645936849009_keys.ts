import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Keys extends BaseSchema {
  protected tableName = 'keys'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('key').notNullable()
      table.string('value').notNullable()
      table.string('language').notNullable()
      table.integer('collection_id').unsigned().references('collections.id').onDelete('CASCADE')
      table.unique(['key', 'language', 'collection_id'])

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
