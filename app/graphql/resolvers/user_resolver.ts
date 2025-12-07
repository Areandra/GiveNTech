import { Query, Resolver, ID, Arg, FieldResolver, Root } from '@foadonis/graphql'
import Booking from '../../models/booking.js'
import User from '../../models/user.js'

@Resolver(() => User)
export default class UserResolver {
  @Query(() => [User])
  async users() {
    return User.all()
  }

  @Query(() => User, { nullable: true })
  async user(@Arg('id', () => ID) id: number) {
    return User.find(id)
  }

  @FieldResolver(() => [Booking])
  async bookings(@Root() user: User) {
    await user.load('bookings')
    return user.bookings
  }
}
