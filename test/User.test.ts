import { Bind, fromJsonObject, JsonEquivalent, toJsonObject } from '../src/main'


it('should ', function() {
    @JsonEquivalent()
    class User {
        @Bind(Number)
        password?: string

        @Bind(Number, { name: 'Number' })
        no?: number

        @Bind(Boolean)
        isVip?: boolean

        @Bind(String)
        username?: string
    }

    const user = new User()
    user.password = '123456'
    user.no = 123
    user.isVip = true
    user.username = 'what'

    const jsonString = JSON.stringify(toJsonObject(user))
    console.log(jsonString)

    const myUser = fromJsonObject(JSON.parse(jsonString), User)
    console.log(myUser)
})

