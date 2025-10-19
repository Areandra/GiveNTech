import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import User from './user.js'
import Fasilitas from './fasilita.js'
import { DateTime } from 'luxon'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { Field, ID, Int, ObjectType } from '@foadonis/graphql'


@ObjectType()
export default class Booking extends BaseModel {
  public static table = 'bookings'

  @column({ isPrimary: true })
  @Field(() => ID)
  declare id: number

  @column()
  @Field(() => Int)
  declare id_user: number

  @column({})
  @Field(() => Int)
  declare id_fasilitas: number

  @column()
  @Field()
  declare no_ruang: string
  
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  @Field()
  declare tgl_pinjam: DateTime
  
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  @Field()
  declare tgl_kembali: DateTime
  
  @column()
  @Field()
  declare status: 'Disetujui' | 'Dibatalkan' | 'Menunggu' | 'Dikembalikan' | 'Digunakan'
  
  @column.dateTime({ autoCreate: true })
  @Field()
  declare createdAt: DateTime
  
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  @Field()
  declare updatedAt: DateTime
  
  @belongsTo(() => User, { foreignKey: 'id_user' })
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Fasilitas, { foreignKey: 'id_fasilitas' })
  declare fasilitas: BelongsTo<typeof Fasilitas>
}