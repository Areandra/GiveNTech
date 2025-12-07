import graphql from '@foadonis/graphql/services/main'

graphql.resolvers([
  () => import('#graphql/resolvers/booking_resolver'),
  () => import('#graphql/resolvers/user_resolver'),
  () => import('#graphql/resolvers/room_resolver'),
  () => import('#graphql/resolvers/facility_resolver'),
])
