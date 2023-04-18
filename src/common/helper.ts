import { JsonObject, UnitObjectClass } from './type'
import { Ladder } from '../Ladder'
import { Level } from '../Level'

/**
 * Converts a unit object to JSON object.
 * @param unitObject the unit object to convert
 */
export const toJsonObject = function(unitObject: Object): JsonObject {
    return Ladder.INSTANCE.toJsonObject(unitObject, Level.root())
}

/**
 * Converts a JSON object to a unit object.
 * @param jsonObject the JSON object to convert
 * @param unitObjectClass the unit object class
 */
export const fromJsonObject = function <T>(jsonObject: JsonObject, unitObjectClass: UnitObjectClass<T>): T {
    return Ladder.INSTANCE.fromJsonObject(jsonObject, unitObjectClass, Level.root())
}