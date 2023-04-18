import { Bind, BindRecord, fromJsonObject, JsonEquivalent, Required, toJsonObject, UnitObjects } from '../src/main'

it('should ', function() {
    @JsonEquivalent()
    class File {
        @Bind(String) path ?: string
        @Bind(String) @Required() lastUpdateDate ?: string
    }

    @JsonEquivalent()
    class User {
        @Bind(String) name ?: string
        @BindRecord(File) files ?: Record<string, File>
    }

    const user = UnitObjects.build(User, {
        name: 'James',
        files: {
            'OperatingSystem.pdf': UnitObjects.build(File, {
                path: '~/book/OperatingSystem.pdf',
                lastUpdateDate: '2023-04-16',
            }),
            'MachineLearning.pdf': UnitObjects.build(File, {
                path: '~/book/MachineLearning.pdf',
                lastUpdateDate: '2023-04-15',
            }),
        },
    })

    const jsonObject = toJsonObject(user)
    console.log(jsonObject)

    const userFromJson = fromJsonObject(jsonObject, User)
    console.log(userFromJson)

    const files =userFromJson.files;
    expect(files).not.toBe(undefined)
    expect(files!['OperatingSystem.pdf'].path).toBe('~/book/OperatingSystem.pdf')
})