import { Class, Constructor, getClass } from '@typinghare/ts-reflect'
import { isUndefined } from 'lodash'
import { JsonArray, JsonObject, LadderOptions, UnitObjectClass } from './common/type'
import { JsonEquivalentContext } from './decorator/JsonEquivalent'
import { NotDecoratedByJsonEquivalentException } from './exception/NotDecoratedByJsonEquivalentException'
import { Converter } from './Converter'
import { zone } from './common/global'
import { Level } from './Level'

/**
 * Ladder.
 * @author James Chan
 */
export class Ladder {
    private static readonly _INSTANCE = new Ladder()

    public static get INSTANCE(): Ladder {
        return this._INSTANCE
    }

    /**
     * Default ladder options.
     * @private
     */
    private readonly ladderOptions: LadderOptions = {
        toNameMappingStrategy: (originName) => originName,
        fromNameMappingStrategy: (originName) => originName,
    }

    /**
     * Retrieves an option from the ladderOptions object based on the provided key.
     * @param key the key for the option to retrieve.
     * @returns the value of the option corresponding to the provided key.
     */
    public getOption<K extends keyof LadderOptions>(key: K): LadderOptions[K] {
        return this.ladderOptions[key]
    }

    /**
     * Converts a unit object to JSON object.
     * @param unitObject the unit object to convert
     * @param level
     */
    public toJsonObject(unitObject: Object, level: Level): JsonObject {
        const constructor = Object.getPrototypeOf(unitObject).constructor
        const classReflect = getClass<JsonEquivalentContext>(constructor)
        const classContext = this.checkClass(constructor, classReflect)

        if (level.getLevels().length === 0) {
            level = level.next(constructor.name)
        }

        const converter = new Converter(classContext, classReflect!, level)
        return converter.toJsonObject(unitObject)
    }

    /**
     * Converts a record to JSON object record.
     * @param objectRecord
     * @param level
     */
    public toJsonRecord(objectRecord: Record<string, Object>, level: Level): Record<string, JsonObject> {
        const record = {} as Record<string, JsonObject>
        for (const key in objectRecord) {
            record[key] = this.toJsonObject(objectRecord[key], level.next(key.toString()))
        }

        return record
    }

    /**
     * Converts a unit object array to a json array.
     * @param unitObjectArray
     * @param level
     */
    public toJsonArray(unitObjectArray: Object[], level: Level): JsonArray {
        const jsonArray = [] as JsonArray
        for (let i = 0; i < unitObjectArray.length; i++) {
            const jsonObject = this.toJsonObject(unitObjectArray[i], level.next(i.toString()))
            jsonArray.push(jsonObject)
        }

        return jsonArray
    }

    /**
     * Converts a JSON object to an object.
     * @param jsonObject the JSON object to map
     * @param unitObjectClass the class to map into
     * @param level
     */
    public fromJsonObject<T>(jsonObject: JsonObject, unitObjectClass: UnitObjectClass<T>, level: Level): T {
        const constructor = unitObjectClass as Constructor
        const classReflect = getClass<JsonEquivalentContext>(constructor)
        const classContext = this.checkClass(constructor, classReflect)

        const converter = new Converter(classContext, classReflect!, level)
        return converter.fromJsonObject(jsonObject, unitObjectClass)
    }

    /**
     * Maps a JSON record to an object record.
     * @param jsonObjectRecord
     * @param unitObjectClass
     * @param level
     */
    public fromJsonRecord<T>(
        jsonObjectRecord: Record<string, JsonObject>,
        unitObjectClass: UnitObjectClass<T>,
        level: Level,
    ): Record<string, T> {
        const record = {} as Record<string, T>
        for (const key in jsonObjectRecord) {
            record[key] = this.fromJsonObject(jsonObjectRecord[key], unitObjectClass, level.next(key.toString()))
        }

        return record
    }

    public fromJsonArray<T>(
        jsonObjectArray: JsonObject[],
        unitObjectClass: UnitObjectClass<T>,
        level: Level,
    ): T[] {
        const unitObjectArray = [] as T[]
        for (let i = 0; i < jsonObjectArray.length; i++) {
            const unitObject = this.fromJsonObject(jsonObjectArray[i], unitObjectClass, level.next(i.toString()))
            unitObjectArray.push(unitObject)
        }

        return unitObjectArray
    }

    /**
     * Checks class.
     * @param constructor
     * @param classReflect
     * @private
     */
    private checkClass(constructor: Constructor, classReflect?: Class<JsonEquivalentContext>): JsonEquivalentContext {
        const className = constructor.name

        if (isUndefined(classReflect)) {
            throw new NotDecoratedByJsonEquivalentException(className)
        }

        const classContext = classReflect.getContext(zone)
        if (!classContext?.isJsonEquivalent) {
            throw new NotDecoratedByJsonEquivalentException(className)
        }

        return classContext
    }
}