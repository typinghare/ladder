import { Ladder } from './Ladder'
import { Class } from '@typinghare/ts-reflect'
import { isArray, isFunction, isUndefined, toNumber } from 'lodash'
import { zone } from './global'
import { BindContext } from './decorator/Bind'
import { ValueIsNotArrayException } from './exception/ValueIsNotArrayException'
import { IllegalArrayTypeException } from './exception/IllegalArrayTypeException'
import { JsonObject, JsonValue, NoArgumentConstructorClass, Type } from './common/types'

export type NameMappingStrategy = (origin: string) => string;

export type ConverterOptions = {
    // the name mapping strategy for <to> conversion
    toNameMappingStrategy: NameMappingStrategy;
    // the name mapping strategy for <from> conversion
    fromNameMappingStrategy: NameMappingStrategy;
}

// noinspection SuspiciousTypeOfGuard
/**
 * Converter.
 * @author James Chan
 */
export class Converter {
    private readonly options: ConverterOptions

    public constructor(convertOptions: Partial<ConverterOptions>) {
        const ladder = Ladder.INSTANCE

        // Retrieve the default options from the Ladder instance.
        this.options = {
            toNameMappingStrategy: ladder.getOption('toNameMappingStrategy'),
            fromNameMappingStrategy: ladder.getOption('fromNameMappingStrategy'),
        }

        // Merge the provided options with the default options.
        Object.assign(this.options, convertOptions)
    }

    /**
     * Maps an object to JSON object.
     */
    public toJson(object: object, classReflect: Class): JsonObject {
        const jsonObject: JsonObject = {}

        for (const [keySymbol, property] of classReflect.getPropertyMap<BindContext>().entries()) {
            const name = keySymbol.toString()
            const toOptions = property.getContext(zone, 'toOptions')
            if (!toOptions?.bound) continue

            // @ts-ignore
            const originalValue = object[name]
            const type = toOptions?.type

            if (isUndefined(type)) {
                const className = classReflect.getConstructor().name
                Warnings.prompt(`Type is not found for ${name} in ${className}, which is unsafe.`)
            }

            const value = this.mapValueTo(originalValue, type)

            if (!isUndefined(value)) {
                // name mapping
                const keyName = toOptions.name || this.options.fromNameMappingStrategy(name.toString())

                jsonObject[keyName] = value
            }
        }

        return jsonObject
    }

    /**
     * Maps a JSON object to an object.
     * @param jsonObject the JSON object to map
     * @param jsonEquivalentClass the class to map into
     * @param classReflect
     */
    public fromJson<T>(jsonObject: Object, jsonEquivalentClass: NoArgumentConstructorClass<T>, classReflect: Class): T {
        const object = new jsonEquivalentClass()

        for (const [name, property] of classReflect.getPropertyMap<BindContext>().entries()) {
            const fromOptions = property.getContext(zone, 'fromOptions')
            if (!fromOptions?.bound) continue

            const keyName = fromOptions.name || this.options.fromNameMappingStrategy(name.toString())

            // @ts-ignore
            const originalValue = jsonObject[keyName]
            const value = this.mapValueFrom(originalValue, fromOptions.type)

            if (!isUndefined(value)) {
                // @ts-ignore
                object[name] = value
            }
        }

        return object
    }

    private mapValueTo(value: any, type?: Type): JsonValue {
        if (isUndefined(type)) return value

        if (isArray(type)) {
            if (type.length !== 1) {
                throw new IllegalArrayTypeException()
            }

            if (!isArray(value)) {
                throw new ValueIsNotArrayException()
            }

            const elementType = type[0]
            return value.map(val => {
                return Ladder.INSTANCE.toJson(val)
            })
        }

        if (type === String) {
            return value.toString()
        } else if (type === Number) {
            return toNumber(value)
        } else if (type === Boolean) {
            return !!value
        } else if (isFunction(type)) {
            return Ladder.INSTANCE.toJson(value)
        } else {
            return null
        }
    }

    private mapValueFrom(originalValue: JsonValue, type?: Type): any {
        if (isUndefined(type)) return originalValue

        if (isArray(type)) {
            if (type.length !== 1) {
                throw new IllegalArrayTypeException()
            }

            if (!isArray(originalValue)) {
                throw new ValueIsNotArrayException()
            }

            const elementType = type[0] as NoArgumentConstructorClass
            if (!isFunction(elementType)) {

            }

            return originalValue.map(val => {
                return Ladder.INSTANCE.fromJson(val as JsonObject, elementType)
            })
        }

        if (originalValue == null) {
            return null
        } else if (type === String) {
            return originalValue?.toString()
        } else if (type === Number) {
            return toNumber(originalValue)
        } else if (type === Boolean) {
            return !!originalValue
        } else if (isFunction(type)) {
            return Ladder.INSTANCE.fromJson(originalValue as JsonObject, type as NoArgumentConstructorClass)
        } else {
            return null
        }
    }
}