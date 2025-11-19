import { BaseModel, column } from '@adonisjs/lucid/orm'
import { Field, ID, ObjectType } from '@foadonis/graphql'
import { DateTime } from 'luxon'

@ObjectType()
export default class Facility extends BaseModel {
  public static table = 'facilities'

  @column({ isPrimary: true })
  @Field(() => ID)
  declare id: number

  @column()
  @Field()
  declare name: string

  @column()
  @Field()
  declare type: string

  @column()
  @Field()
  declare status:
    | 'Available'
    | 'Booked'
    | 'Borrowed'
    | 'Under Inspection'
    | 'Maintenance'
    | 'Damaged'

  @column.dateTime({ autoCreate: true })
  @Field()
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  @Field()
  declare updatedAt: DateTime
}
