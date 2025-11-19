import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'facilities'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name', 100).notNullable()
      table.string('type', 100).notNullable()
      table
        .enum('status', [
          'Available',
          'Booked',
          'Borrowed',
          'Under Inspection',
          'Maintenance',
          'Damaged',
        ])
        .defaultTo('Available')
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
