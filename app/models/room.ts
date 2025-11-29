import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  hasMany
} from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Booking from './booking.js'
import { ApiProperty } from '@foadonis/openapi/decorators'

export default class Room extends BaseModel {
  public static table = 'rooms'

  @column({ isPrimary: true })
  @ApiProperty()
  declare id: number

  @column()
  @ApiProperty()
  declare roomName: string

  @column()
  @ApiProperty()
  declare longitude: number

  @column()
  @ApiProperty()
  declare latitude: number

  @column.dateTime({ autoCreate: true })
  @ApiProperty()
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  @ApiProperty()
  declare updatedAt: DateTime

  @hasMany(() => Booking, { foreignKey: 'idRoom' })
  @ApiProperty({type:() => Booking})
  declare bookings: HasMany<typeof Booking>
}
