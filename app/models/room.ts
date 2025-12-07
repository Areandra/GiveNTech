import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Booking from './booking.js'
import { ApiProperty } from '@foadonis/openapi/decorators'
import { Field, Float, ID, ObjectType } from '@foadonis/graphql'

@ObjectType()
export default class Room extends BaseModel {
  public static table = 'rooms'

  @column({ isPrimary: true })
  @Field(() => ID)
  @ApiProperty({ type: 'integer', example: 1 })
  declare id: number

  @column()
  @Field()
  @ApiProperty({ type: 'string', example: 'Ruang Seminar 101' })
  declare roomName: string

  @column({ consume: (value: string | number) => Number(value) })
  @Field(() => Float)
  @ApiProperty({
    type: 'number',
    format: 'float',
    example: 106.8271,
    description: 'Bujur lokasi ruangan',
  })
  declare longitude: number

  @column({ consume: (value: string | number) => Number(value) })
  @Field(() => Float)
  @ApiProperty({
    type: 'number',
    format: 'float',
    example: -6.1754,
    description: 'Lintang lokasi ruangan',
  })
  declare latitude: number

  @column.dateTime({ autoCreate: true })
  @Field()
  @ApiProperty({ type: 'string', format: 'date-time', example: '2025-11-20T10:00:00.000Z' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  @Field()
  @ApiProperty({ type: 'string', format: 'date-time', example: '2025-11-27T14:30:00.000Z' })
  declare updatedAt: DateTime

  @hasMany(() => Booking, { foreignKey: 'idRoom' })
  @Field(() => [Booking])
  declare bookings: HasMany<typeof Booking>
}
