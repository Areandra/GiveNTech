import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'bookings'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('id_user')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table
        .integer('id_approver')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table
        .integer('id_facility')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('facilities')
        .onDelete('CASCADE')
      table
        .integer('id_room')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('rooms')
        .onDelete('SET NULL')
      table.date('booking_date').notNullable()
      table.date('return_date').nullable()
      table
        .enum('status', [
          'Pending',
          'Confirmed',
          'Picked Up',
          'Returned',
          'Cancelled',
          'Penalized',
          'Done',
        ])
        .defaultTo('Pending')
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
