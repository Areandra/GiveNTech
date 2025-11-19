import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import User from './user.js'
import { DateTime } from 'luxon'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { Field, ID, Int, ObjectType } from '@foadonis/graphql'
import Facility from './facility.js'

@ObjectType()
export default class Booking extends BaseModel {
  public static table = 'bookings'

  @column({ isPrimary: true })
  @Field(() => ID)
  declare id: number

  @column()
  @Field(() => Int)
  declare idUser: number

  @column()
  @Field(() => Int)
  declare idFacility: number

  @column()
  @Field(() => Int)
  declare idApprover?: number

  @column()
  @Field()
  declare roomNumber?: string

  @column.dateTime({ autoCreate: true })
  @Field()
  declare bookingDate?: DateTime

  @column()
  @Field(() => DateTime)
  declare returnDate?: DateTime | string

  @column()
  @Field()
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
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  @Field()
  declare updatedAt: DateTime

  @belongsTo(() => User, { foreignKey: 'idUser' })
  declare user: BelongsTo<typeof User>

  @belongsTo(() => User, { foreignKey: 'idApprover' })
  declare approver: BelongsTo<typeof User>

  @belongsTo(() => Facility, { foreignKey: 'idFacility' })
  declare fasilitas: BelongsTo<typeof Facility>
}
