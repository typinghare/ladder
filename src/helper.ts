import { JsonObject, NoArgumentConstructorClass } from './common/types'
import { Ladder } from './Ladder'

/**
 * Maps an object to JSON object.
 * @param object
 */
export const toJsonObject = function(object: Object): JsonObject {
    return Ladder.INSTANCE.toJson(object)
}

/**
 * Maps a JSON object to an object.
 * @param jsonObject
 * @param jsonEquivalentClass
 */
export const fromJsonObject = function <T>(jsonObject: JsonObject, jsonEquivalentClass: NoArgumentConstructorClass<T>): T {
    return Ladder.INSTANCE.fromJson(jsonObject, jsonEquivalentClass)
}