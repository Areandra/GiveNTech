import { BaseModel, column } from '@adonisjs/lucid/orm'
import { Field, ID, ObjectType } from '@foadonis/graphql'
import { ApiProperty } from '@foadonis/openapi/decorators'
import { DateTime } from 'luxon'

@ObjectType()
export default class Facility extends BaseModel {
  public static table = 'facilities'

  @column({ isPrimary: true })
  @ApiProperty()
  @Field(() => ID)
  declare id: number

  @column()
  @ApiProperty()
  @Field()
  declare name: string

  @column()
  @ApiProperty()
  @Field()
  declare type: string

  @column()
  @ApiProperty()
  @Field()
  declare status:
    | 'Available'
    | 'Booked'
    | 'Borrowed'
    | 'Under Inspection'
    | 'Maintenance'
    | 'Damaged'

  @column.dateTime({ autoCreate: true })
  @ApiProperty()
  @Field()
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  @ApiProperty()
  @Field()
  declare updatedAt: DateTime
}
