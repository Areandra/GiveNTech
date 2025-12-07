import { Query, Resolver, ID, Arg, FieldResolver, Root } from '@foadonis/graphql'
import Facility from '../../models/facility.js'
import Booking from '../../models/booking.js'
import Room from '../../models/room.js'
import User from '../../models/user.js'

@Resolver(() => Booking)
export default class BookingResolver {
  @Query(() => [Booking])
  async bookings() {
    return Booking.query().preload('fasilitas').preload('user').preload('rooms').preload('approver')
  }

  @Query(() => Booking, { nullable: true })
  async booking(@Arg('id', () => ID) id: number) {
    return Booking.query()
      .where('id', id)
      .preload('fasilitas')
      .preload('user')
      .preload('rooms')
      .preload('approver')
      .first()
  }

  @FieldResolver(() => User)
  async user(@Root() booking: Booking) {
    await booking.load('user')
    return booking.user
  }

  @FieldResolver(() => User, { nullable: true })
  async approver(@Root() booking: Booking) {
    if (!booking.idApprover) return null
    await booking.load('approver')
    return booking.approver
  }

  @FieldResolver(() => Facility)
  async fasilitas(@Root() booking: Booking) {
    await booking.load('fasilitas')
    return booking.fasilitas
  }

  @FieldResolver(() => Room, { nullable: true })
  async rooms(@Root() booking: Booking) {
    if (!booking.idRoom) return null
    await booking.load('rooms')
    return booking.rooms
  }
}
