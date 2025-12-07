import { Query, Resolver, ID, Arg, FieldResolver, Root } from '@foadonis/graphql'
import Booking from '../../models/booking.js'
import Room from '../../models/room.js'

@Resolver(() => Room)
export default class RoomResolver {
  @Query(() => [Room])
  async rooms() {
    return Room.all()
  }

  @Query(() => Room, { nullable: true })
  async room(@Arg('id', () => ID) id: number) {
    return Room.find(id)
  }

  @FieldResolver(() => [Booking])
  async bookings(@Root() room: Room) {
    await room.load('bookings')
    return room.bookings
  }
}
