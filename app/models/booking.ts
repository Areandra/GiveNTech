import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import User from './user.js'
import { DateTime } from 'luxon'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { Field, ID, Int, ObjectType } from '@foadonis/graphql'
import Facility from './facility.js'
import { ApiProperty } from '@foadonis/openapi/decorators'
import Room from './room.js'

@ObjectType()
export default class Booking extends BaseModel {
  public static table = 'bookings'

  @column({ isPrimary: true })
  @Field(() => ID)
  @ApiProperty({ type: 'integer', example: 1 })
  declare id: number

  @column()
  @Field(() => Int)
  @ApiProperty({ type: 'integer', example: 101, description: 'ID pengguna yang membuat booking' })
  declare idUser: number

  @column()
  @Field(() => Int)
  @ApiProperty({ type: 'integer', example: 5, description: 'ID fasilitas yang di-booking' })
  declare idFacility: number

  @column()
  @Field(() => Int)
  @ApiProperty({
    type: 'integer',
    example: 99,
    required: false,
    description: 'ID pengguna yang menyetujui (Approver)',
    nullable: true,
  })
  declare idApprover?: number

  @column()
  @Field(() => Int)
  @ApiProperty({
    type: 'integer',
    example: 3,
    required: false,
    description: 'ID ruangan yang di-booking (jika berlaku)',
  })
  declare idRoom?: number

  @column.date()
  @Field()
  @ApiProperty({
    type: 'string',
    format: 'date',
    example: '2025-11-27',
    description: 'Tanggal peminjaman',
  })
  declare bookingDate: DateTime

  @column.date()
  @Field(() => DateTime)
  @ApiProperty({
    type: 'string',
    format: 'date',
    example: '2025-11-30',
    required: false,
    description: 'Tanggal pengembalian yang direncanakan',
    nullable: true,
  })
  declare returnDate?: DateTime

  @column()
  @Field()
  @ApiProperty({
    type: 'string',
    enum: ['Pending', 'Confirmed', 'Picked Up', 'Returned', 'Cancelled', 'Penalized', 'Done'],
    example: 'Pending',
    description: 'Status booking saat ini',
  })
  declare status:
    | 'Pending'
    | 'Confirmed'
    | 'Picked Up'
    | 'Returned'
    | 'Cancelled'
    | 'Penalized'
    | 'Done'

  @column()
  @Field()
  @ApiProperty({
    type: 'string',
    example: 'Rapat koordinasi tim Q4',
    description: 'Tujuan peminjaman',
  })
  declare purpose: string

  @column()
  @Field()
  @ApiProperty({
    type: 'string',
    example: 'Membutuhkan proyektor dan kabel HDMI',
    required: false,
    description: 'Catatan tambahan dari pemohon',
  })
  declare notes?: string

  @column.dateTime({ autoCreate: true })
  @Field()
  @ApiProperty({ type: 'string', format: 'date-time', example: '2025-11-20T10:00:00.000Z' })
  declare createdAt?: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  @Field()
  @ApiProperty({ type: 'string', format: 'date-time', example: '2025-11-27T14:30:00.000Z' })
  declare updatedAt?: DateTime

  @belongsTo(() => User, { foreignKey: 'idUser' })
  @ApiProperty({ type: () => User, description: 'Pengguna yang membuat booking' })
  declare user: BelongsTo<typeof User>

  @belongsTo(() => User, { foreignKey: 'idApprover' })
  @ApiProperty({
    type: () => User || null,
    description: 'Pengguna yang menyetujui booking',
    nullable: true,
  })
  declare approver?: BelongsTo<typeof User>

  @belongsTo(() => Facility, { foreignKey: 'idFacility' })
  @ApiProperty({ type: () => Facility, description: 'Fasilitas yang di-booking' })
  declare fasilitas: BelongsTo<typeof Facility>

  @belongsTo(() => Room, { foreignKey: 'idRoom' })
  @ApiProperty({ type: () => Room, description: 'Ruangan yang di-booking (jika ada)' })
  declare rooms: BelongsTo<typeof Room>
}
