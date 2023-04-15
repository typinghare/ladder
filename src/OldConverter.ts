// import { ClassContainer, Constructor, getClass } from '@typinghare/ts-reflect'
// import { isArray, isFunction, isObject, isUndefined, toNumber } from 'lodash'
// import { JsonEquivalentContext } from './decorator/JsonEquivalent'
// import { zone } from './global'
// import { BindContext, NoArgumentConstructorClass, Type } from './decorator/Bind'
// import { Bool, Num, ScalarType, Str } from './common/ScalarType'
//
// export type ConverterOptions = {
//     toNameMappingStrategy: NameMappingStrategy;
//     fromNameMappingStrategy: NameMappingStrategy;
// }
//
// export type NameMappingStrategy = (origin: string) => string;
//
// // noinspection SuspiciousTypeOfGuard
// /**
//  * Converter.
//  * @author James Chan
//  */
// class OldConverter {
//     private readonly options: ConverterOptions = {
//         toNameMappingStrategy: (origin) => origin,
//         fromNameMappingStrategy: (origin) => origin,
//     }
//
//     public constructor(convertOptions: Partial<ConverterOptions>) {
//         Object.assign(this.options, convertOptions)
//     }
//
//     /**
//      * Maps an object to JSON object.
//      * @param object
//      */
//     public toJson(object: Object): string {
//         const constructor = Object.getPrototypeOf(object).constructor
//         const classReflect = ClassContainer.INSTANCE.get<JsonEquivalentContext>(constructor)
//         if (isUndefined(classReflect)) {
//             throw new Error(`Class ${constructor.name} is not decorated by @JsonEquivalent().`)
//         }
//
//         const context = classReflect.getContext(zone)
//         if (!context?.isJsonEquivalent) {
//             throw new Error(`Class ${constructor.name} is not decorated by @JsonEquivalent().`)
//         }
//
//         const jsonObject: NodeJS.Dict<any> = {}
//         for (const [name, property] of classReflect.getPropertyMap<BindContext>().entries()) {
//             const fromOptions = property.getContext(zone, 'fromOptions')
//             if (!fromOptions?.bound) continue
//
//             // @ts-ignore
//             const originalValue = object[name]
//             const value = this.mapValueFrom(originalValue, fromOptions?.type)
//
//             if (!isUndefined(value)) {
//                 // name mapping
//                 const keyName = fromOptions.name || this.options.fromNameMappingStrategy(name.toString())
//
//                 jsonObject[keyName] = value
//             }
//         }
//
//         return JSON.stringify(jsonObject)
//     }
//
//     /**
//      * Maps a JSON object to an object.
//      * @param jsonObject the JSON object to map
//      * @param jsonEquivalentClass the class to map into
//      */
//     public fromJson<T>(jsonObject: Object, jsonEquivalentClass: NoArgumentConstructorClass<T>): T {
//         const constructor = jsonEquivalentClass as Constructor
//         const classReflect = getClass<JsonEquivalentContext>(constructor)
//         if (isUndefined(classReflect)) {
//             throw new Error(`Class ${constructor.name} is not decorated by @JsonEquivalent().`)
//         }
//
//         const context = classReflect.getContext(zone)
//         if (!context?.isJsonEquivalent) {
//             throw new Error(`Class ${constructor.name} is not decorated by @JsonEquivalent().`)
//         }
//
//         const object: T = new jsonEquivalentClass()
//         for (const [name, property] of classReflect.getPropertyMap<BindContext>().entries()) {
//             const toOptions = property.getContext(zone, 'toOptions')
//             if (!toOptions?.bound) continue
//
//             const keyName = toOptions.name || this.options.fromNameMappingStrategy(name.toString())
//
//             // @ts-ignore
//             const originalValue = jsonObject[keyName]
//             const value = this.mapValueTo(originalValue, toOptions.type)
//
//             if (!isUndefined(value)) {
//                 // @ts-ignore
//                 object[name] = value
//             }
//         }
//
//         return object
//     }
//
//     private mapValueFrom(originalValue: any, type?: Type): any {
//         if (isUndefined(type)) return originalValue
//
//         if (isArray(type)) {
//             if (!isArray(originalValue)) {
//                 throw new Error('Original Value is not an array.')
//             }
//
//             const elementType = type[0]
//
//             return originalValue.map(val => {
//                 return this.mapValueFrom(val, elementType)
//             })
//         }
//
//         if (type instanceof ScalarType) {
//             if (type === Str) {
//                 return originalValue.toString()
//             } else if (type === Num) {
//                 return toNumber(originalValue)
//             } else if (type === Bool) {
//                 return !!originalValue
//             }
//         } else if (isFunction(type)) {
//             // type is a class
//             return this.toJson(originalValue)
//         }
//     }
//
//     private mapValueTo(originalValue: any, type?: Type): any {
//         if (isUndefined(type)) {
//             if (isObject(type)) {
//                 throw new Error(`The type is default, but the original value is an object or array.`)
//             }
//
//             return originalValue
//         }
//
//         if (isArray(type)) {
//             if (!isArray(originalValue)) {
//                 throw new Error('Original Value is not an array.')
//             }
//
//             const elementType = type[0]
//
//             return originalValue.map(val => {
//                 return this.mapValueFrom(val, elementType)
//             })
//         }
//
//         if (type instanceof ScalarType) {
//             if (type === Str) {
//                 return originalValue.toString()
//             } else if (type === Num) {
//                 return toNumber(originalValue)
//             } else if (type === Bool) {
//                 return !!originalValue
//             }
//         } else if (isFunction(type)) {
//             // type is a class
//             return this.fromJson(originalValue, type)
//         }
//     }
// }