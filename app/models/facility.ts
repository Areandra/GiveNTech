import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import { Field, ID, ObjectType } from '@foadonis/graphql'
import { ApiProperty } from '@foadonis/openapi/decorators'
import { DateTime } from 'luxon'
import Booking from './booking.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'

@ObjectType()
export default class Facility extends BaseModel {
  public static table = 'facilities'

  @column({ isPrimary: true })
  @ApiProperty({ type: 'integer', example: 1 })
  @Field(() => ID)
  declare id: number

  @column()
  @ApiProperty({ type: 'string', example: 'Ruang Rapat Utama B' })
  @Field()
  declare name: string

  @column()
  @ApiProperty({
    type: 'string',
    example: 'Ruangan',
    description: 'Tipe fasilitas (e.g., Ruangan, Kendaraan, Peralatan)',
  })
  @Field()
  declare type: string

  @column()
  @ApiProperty({
    type: 'string',
    enum: ['Available', 'Booked', 'Borrowed', 'Under Inspection', 'Maintenance', 'Damaged'],
    example: 'Available',
    description: 'Status ketersediaan fasilitas saat ini',
  })
  @Field()
  declare status:
    | 'Available'
    | 'Booked'
    | 'Borrowed'
    | 'Under Inspection'
    | 'Maintenance'
    | 'Damaged'

  @column.dateTime({ autoCreate: true })
  @ApiProperty({ type: 'string', format: 'date-time', example: '2025-11-20T10:00:00.000Z' })
  @Field()
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  @ApiProperty({ type: 'string', format: 'date-time', example: '2025-11-27T14:30:00.000Z' })
  @Field()
  declare updatedAt: DateTime

  @hasMany(() => Booking, { foreignKey: 'idFacility' })
  @Field(() => [Booking])
  declare bookings: HasMany<typeof Booking>
}
