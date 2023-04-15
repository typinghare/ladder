import { Converter, ConverterOptions } from './Converter'
import { Class, Constructor, getClass } from '@typinghare/ts-reflect'
import { JsonEquivalentContext } from './decorator/JsonEquivalent'
import { isUndefined } from 'lodash'
import { NotDecoratedByJsonEquivalentException } from './exception/NotDecoratedByJsonEquivalentException'
import { zone } from './global'
import { JsonObject, NoArgumentConstructorClass } from './common/types'
import assert from 'assert'

export type LadderOptions = ConverterOptions & {}

export class Ladder {
    private static readonly _INSTANCE = new Ladder()

    public static get INSTANCE(): Ladder {
        return this._INSTANCE
    }

    private readonly ladderOptions: LadderOptions = {
        toNameMappingStrategy: (origin) => origin,
        fromNameMappingStrategy: (origin) => origin,
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
     * Maps an object to JSON object.
     * @param object
     */
    public toJson(object: Object): JsonObject {
        const constructor = Object.getPrototypeOf(object).constructor
        const classReflect = getClass<JsonEquivalentContext>(constructor)
        const classContext = this.checkClass(constructor, classReflect)

        assert(!isUndefined(classReflect))

        const converter = new Converter(classContext)
        return converter.toJson(object, classReflect)
    }

    /**
     * Maps a JSON object to an object.
     * @param jsonObject the JSON object to map
     * @param jsonEquivalentClass the class to map into
     */
    public fromJson<T>(jsonObject: JsonObject, jsonEquivalentClass: NoArgumentConstructorClass<T>): T {
        const constructor = jsonEquivalentClass as Constructor
        const classReflect = getClass<JsonEquivalentContext>(constructor)
        const classContext = this.checkClass(constructor, classReflect)

        console.assert(!isUndefined(classReflect))

        const converter = new Converter(classContext)
        return converter.fromJson(jsonObject, jsonEquivalentClass, classReflect!)
    }

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