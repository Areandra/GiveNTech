import { Query, Resolver, ID, Arg, FieldResolver, Root } from '@foadonis/graphql'
import Facility from '../../models/facility.js'
import Booking from '../../models/booking.js'

@Resolver(() => Facility)
export default class FacilityResolver {
  @Query(() => [Facility])
  async facilities() {
    return Facility.all()
  }

  @Query(() => Facility, { nullable: true })
  async facility(@Arg('id', () => ID) id: number) {
    return Facility.find(id)
  }

  @FieldResolver(() => [Booking])
  async bookings(@Root() facility: Facility) {
    await facility.load('bookings')
    return facility.bookings
  }
}
