import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Collections extends BaseSchema {
  protected tableName = 'collections'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('code').notNullable()
      table.string('name', 255).notNullable()
      table.string('description').nullable()
      table.integer('project_id').unsigned().references('projects.id').onDelete('CASCADE')
      table.integer('created_by_user_id').unsigned().references('users.id')
      table.unique(['code', 'project_id'])

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
