import { Query, Resolver } from '@foadonis/graphql'

@Resolver()
export default class DemoResolver {
  @Query(() => String)
  demo() {
    return "Hello World"
  }
}