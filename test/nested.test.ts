import { Bind, fromJsonObject, JsonEquivalent, toJsonObject } from '../src/main'

@JsonEquivalent()
class Address {
    @Bind(String) state?: string
    @Bind(String) city ?: string
}

@JsonEquivalent()
class User {
    @Bind(String) name?: string
    @Bind(Number) age?: number
    @Bind(Address, { name: 'addr' }) address ?: Address
}

it('should what.', function() {
    const address = new Address()
    address.state = 'Massachusetts'
    address.city = 'Quincy'

    const user = new User()
    user.name = 'James'
    user.age = 24
    user.address = address

    const jsonObject = toJsonObject(user)
    console.log(JSON.stringify(jsonObject))

    const user2 = fromJsonObject(jsonObject, User)
    console.log(user2)
})