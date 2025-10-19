import { Field, ID, ObjectType } from '@foadonis/graphql'
import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import Booking from './booking.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

@ObjectType()
export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  @Field(() => ID)
  declare id: number

  @column()
  @Field(() => String, { nullable: true })
  declare username: string | null

  @column()
  @Field()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  @Field()
  declare role: 'admin' | 'user'

  @column.dateTime({ autoCreate: true })
  @Field()
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  @Field(() => DateTime, {nullable: true})
  declare updatedAt: DateTime | null

  @hasMany(() => Booking, {
    foreignKey: 'id_user',  
  })
  declare bookings: HasMany<typeof Booking>

  static accessTokens = DbAccessTokensProvider.forModel(User)
}
