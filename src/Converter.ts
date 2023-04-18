// noinspection SuspiciousTypeOfGuard
import { ConverterOptions, JsonObject, JsonValue, UnitObjectClass, UnitObjectType } from './common/type'
import { Ladder } from './Ladder'
import { Class } from '@typinghare/ts-reflect'
import { Level } from './Level'
import { ExtendedBindOptions } from './decorator/Bind'
import { zone } from './common/global'
import { isArray, isFunction, isUndefined, toNumber } from 'lodash'
import { ToJsonPropertyMissingException } from './exception/ToJsonPropertyMissingException'
import { Warnings } from './util/Warnings'
import { FromJsonPropertyMissingException } from './exception/FromJsonPropertyMissingException'
import { Exception } from './exception/Exception'
import { IllegalArrayTypeException } from './exception/IllegalArrayTypeException'
import { ValueIsNotArrayException } from './exception/ValueIsNotArrayException'

/**
 * Converter.
 * @author James Chan
 */
export class Converter {
    private readonly options: ConverterOptions

    private readonly classReflect: Class

    private readonly level: Level

    /**
     * Creates a converter.
     * @param convertOptions
     * @param classReflect
     * @param level
     */
    public constructor(convertOptions: Partial<ConverterOptions>, classReflect: Class, level: Level) {
        this.classReflect = classReflect
        this.level = level

        const ladder = Ladder.INSTANCE

        // Retrieve the default options from the Ladder instance.
        this.options = {
            toNameMappingStrategy: ladder.getOption('toNameMappingStrategy'),
            fromNameMappingStrategy: ladder.getOption('fromNameMappingStrategy'),
        }

        // Merge the provided options with the default options.
        Object.assign(this.options, convertOptions)
    }

    public toJsonObject(unitObject: object): JsonObject {
        const className: string = this.classReflect.getConstructor().name
        const propertyMap = this.classReflect.getPropertyMap<ExtendedBindOptions>()

        const jsonObject = {} as JsonObject
        for (const [keySymbol, property] of propertyMap.entries()) {
            const name = keySymbol.toString()
            const toOptions = property.getContext(zone, 'toOptions')
            if (!toOptions?.bound) continue

            // @ts-ignore
            const originalValue = unitObject[name]
            const type = toOptions?.type

            // original value is undefined
            if (isUndefined(originalValue)) {
                if (toOptions?.isRequired) {
                    throw new ToJsonPropertyMissingException(name, className, this.level)
                }

                continue
            }

            // Name mapping.
            const propertyName = toOptions.name || this.options.fromNameMappingStrategy(name.toString())

            if (isArray(type)) {
                if (type.length !== 1) {
                    throw new IllegalArrayTypeException(propertyName, className, this.level)
                }

                if (!isArray(originalValue)) {
                    throw new ValueIsNotArrayException(propertyName, className, this.level)
                }

                jsonObject[propertyName] = Ladder.INSTANCE.toJsonArray(originalValue as Object[], this.level.next(name))
            } else if (property.getContext(zone, 'isRecord')) {
                jsonObject[propertyName]
                    = Ladder.INSTANCE.toJsonRecord(originalValue as Record<string, Object>, this.level.next(name))
            } else {
                if (isUndefined(type)) {
                    this.promptNoTypeWarning(name, className)
                }

                jsonObject[propertyName] = this.mapValueTo(originalValue, type, name)
            }
        }

        return jsonObject
    }

    public fromJsonObject<T>(jsonObject: Object, unitObjectClass: UnitObjectClass<T>): T {
        const className: string = this.classReflect.getConstructor().name
        const propertyMap = this.classReflect.getPropertyMap<ExtendedBindOptions>()

        const unitObject: T = new unitObjectClass()
        for (const [name, property] of propertyMap.entries()) {
            const fromOptions = property.getContext(zone, 'fromOptions')
            if (!fromOptions?.bound) continue

            // Name mapping.
            const propertyName = fromOptions.name || this.options.fromNameMappingStrategy(name.toString())

            // @ts-ignore
            const originalValue = jsonObject[propertyName]
            if (isUndefined(originalValue)) {
                if (fromOptions?.isRequired) {
                    throw new FromJsonPropertyMissingException(propertyName, className, this.level.next(propertyName))
                }

                continue
            }

            const type = fromOptions.type
            if (isUndefined(type)) {
                this.promptNoTypeWarning(propertyName, className)
            }

            if (isArray(type)) {
                if (type.length !== 1) {
                    throw new IllegalArrayTypeException(propertyName, className, this.level)
                }

                if (!isArray(originalValue)) {
                    throw new ValueIsNotArrayException(propertyName, className, this.level)
                }

                // @ts-ignore
                unitObject[propertyName] =
                    Ladder.INSTANCE.fromJsonArray(
                        originalValue as JsonObject[],
                        type[0] as UnitObjectClass,
                        this.level.next(propertyName),
                    )
            } else if (property.getContext(zone, 'isRecord')) {
                if (isUndefined(type)) {
                    throw new Exception('Record type is Missing!')
                }

                // @ts-ignore
                unitObject[propertyName] =
                    Ladder.INSTANCE.fromJsonRecord(
                        originalValue as Record<string, JsonObject>,
                        type as UnitObjectClass,
                        this.level.next(propertyName),
                    )
            } else {
                const value = this.mapValueFrom(originalValue, type, propertyName)

                if (!isUndefined(value)) {
                    // @ts-ignore
                    unitObject[propertyName] = value
                }
            }
        }

        return unitObject
    }

    private promptNoTypeWarning(name: string, className: string): void {
        Warnings.warning(`Type is not found for ${name} in <${className}>, which is unsafe.`)
    }

    private mapValueTo(value: any, type: UnitObjectType | undefined, propertyName: string): JsonValue | undefined {
        if (isUndefined(type)) return value

        if (type === String) {
            return value.toString()
        } else if (type === Number) {
            return toNumber(value)
        } else if (type === Boolean) {
            return !!value
        } else if (isFunction(type)) {
            return Ladder.INSTANCE.toJsonObject(value, this.level.next(propertyName))
        } else {
            return null
        }
    }

    private mapValueFrom(originalValue: JsonValue, type: UnitObjectType | undefined, propertyName: string): any {
        if (isUndefined(type)) return originalValue

        if (originalValue == null) {
            return null
        } else if (type === String) {
            return originalValue?.toString()
        } else if (type === Number) {
            return toNumber(originalValue)
        } else if (type === Boolean) {
            return !!originalValue
        } else if (isFunction(type)) {
            return Ladder.INSTANCE.fromJsonObject(originalValue as JsonObject, type as UnitObjectClass, this.level.next(propertyName))
        } else {
            return null
        }
    }
}