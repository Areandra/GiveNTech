import { BaseModel, column } from '@adonisjs/lucid/orm'
import { Field, ID, ObjectType } from '@foadonis/graphql'
import { DateTime } from 'luxon'

@ObjectType()
export default class Fasilitas extends BaseModel {
  public static table = 'fasilitas'

  @column({ isPrimary: true })
  @Field(() => ID)
  declare id: number

  @column()
  @Field()
  declare nama: string
  
  @column()
  @Field()
  declare status: 'Tersedia' | 'Digunakan' | 'Perawatan' | 'Di Reservasi'
  
  @column.dateTime({ autoCreate: true })
  @Field()
  declare createdAt: DateTime
  
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  @Field()
  declare updatedAt: DateTime
}