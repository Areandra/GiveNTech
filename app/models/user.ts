import { Field, ID, ObjectType } from '@foadonis/graphql'
import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import Booking from './booking.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import { ApiProperty } from '@foadonis/openapi/decorators'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email', 'username'],
  passwordColumnName: 'password',
})

@ObjectType()
export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  @ApiProperty()
  @Field(() => ID)
  declare id: number

  @column()
  @ApiProperty()
  @Field(() => String)
  declare username: string

  @column()
  @ApiProperty()
  @Field()
  declare email: string

  @column({ serializeAs: null })
  declare password: string | null

  @column()
  @Field()
  @ApiProperty({ enum: ['admin', 'user'] })
  declare role: 'admin' | 'user'

  @column.dateTime({ autoCreate: true })
  @Field()
  @ApiProperty()
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  @Field(() => DateTime, { nullable: true })
  @ApiProperty({ type: 'string' })
  declare updatedAt: DateTime | null

  @hasMany(() => Booking, {
    foreignKey: 'idUser',
  })
  @ApiProperty({ type: () => [Booking] })
  declare bookings: HasMany<typeof Booking>

  static accessTokens = DbAccessTokensProvider.forModel(User)
}
