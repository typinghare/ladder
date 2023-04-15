/**
 * In JSON, values must be one of the following data types:
 * String, number, boolean, array, object, null.
 * Here, we define string, number, and boolean as scalar types; array and object as structured types.
 */
export type ScalarType = number | string | boolean;
export type StructuredType = object | (ScalarType | StructuredType)[];
export type JsonValue = ScalarType | StructuredType | null;
export type JsonObject = {
    [key: string]: JsonValue
}

export type NoArgumentConstructorClass<T = any> = new() => T

export type Type = NoArgumentConstructorClass | ScalarType | Type[]