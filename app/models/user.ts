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
  @ApiProperty({ type: 'integer', example: 1 })
  @Field(() => ID)
  declare id: number

  @column()
  @ApiProperty({ type: 'string', example: 'john.doe' })
  @Field(() => String)
  declare username: string

  @column()
  @ApiProperty({ type: 'string', example: '628894577950' })
  @Field(() => Number)
  declare phoneNumber: string

  @column()
  @ApiProperty({ type: 'string', format: 'email', example: 'john.doe@example.com' })
  @Field()
  declare email: string

  @column({ serializeAs: null })
  declare password: string | null

  @column()
  @Field()
  @ApiProperty({
    type: 'string',
    enum: ['admin', 'user'],
    example: 'user',
    description: 'Peran pengguna dalam sistem',
  })
  declare role?: 'admin' | 'user'

  @column.dateTime({ autoCreate: true })
  @Field()
  @ApiProperty({ type: 'string', format: 'date-time', example: '2025-11-20T10:00:00.000Z' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  @Field(() => DateTime, { nullable: true })
  @ApiProperty({ type: 'string', format: 'date-time', example: '2025-11-27T14:30:00.000Z' })
  declare updatedAt: DateTime | null

  @hasMany(() => Booking, {
    foreignKey: 'idUser',
  })
  // @ApiProperty({ type: () => [Booking], description: 'Daftar booking yang dibuat pengguna' })
  declare bookings: HasMany<typeof Booking>

  static accessTokens = DbAccessTokensProvider.forModel(User)
}
