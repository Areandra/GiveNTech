import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import User from './user.js'
import { DateTime } from 'luxon'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { Field, ID, Int, ObjectType } from '@foadonis/graphql'
import Facility from './facility.js'
import { ApiProperty } from '@foadonis/openapi/decorators'

@ObjectType()
export default class Booking extends BaseModel {
  public static table = 'bookings'

  @column({ isPrimary: true })
  @Field(() => ID)
  @ApiProperty()
  declare id: number

  @column()
  @Field(() => Int)
  @ApiProperty()
  declare idUser: number

  @column()
  @Field(() => Int)
  @ApiProperty()
  declare idFacility: number

  @column()
  @Field(() => Int)
  @ApiProperty({ required: false })
  declare idApprover?: number

  @column()
  @Field()
  @ApiProperty({ example: 'SG6' })
  declare roomNumber?: string

  @column.dateTime({ autoCreate: true })
  @Field()
  @ApiProperty({ example: '2025-11-27T14:30:00' })
  declare bookingDate: DateTime

  @column()
  @Field(() => DateTime)
  @ApiProperty({ required: false, example: '' })
  declare returnDate?: DateTime

  @column()
  @Field()
  @ApiProperty({
    enum: ['Pending', 'Confirmed', 'Picked Up', 'Returned', 'Cancelled', 'Penalized', 'Done'],
  })
  declare status:
    | 'Pending'
    | 'Confirmed'
    | 'Picked Up'
    | 'Returned'
    | 'Cancelled'
    | 'Penalized'
    | 'Done'

  @column.dateTime({ autoCreate: true })
  @Field()
  @ApiProperty()
  declare createdAt?: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  @Field()
  @ApiProperty()
  declare updatedAt?: DateTime

  @belongsTo(() => User, { foreignKey: 'idUser' })
  @ApiProperty({ type: () => User })
  declare user: BelongsTo<typeof User>

  @belongsTo(() => User, { foreignKey: 'idApprover' })
  @ApiProperty({ type: () => User })
  declare approver: BelongsTo<typeof User>

  @belongsTo(() => Facility, { foreignKey: 'idFacility' })
  @ApiProperty({ type: () => Facility })
  declare fasilitas: BelongsTo<typeof Facility>
}
