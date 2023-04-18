/**
 * In JSON, values must be one of the following data types: String, number, boolean, array, object, null.
 * Here, we define string, number, boolean, and null as scalar types; array and object as structured types.
 */
export type ScalarType = number | string | boolean | null;
export type StructuredType = object | JsonValue[];
export type JsonValue = ScalarType | StructuredType;

/**
 * A JSON object is defined as an object where the type of keys are string, and the values are either scalar types,
 * structured types, or null. If a key doesn't have a value, it is considered undefined.
 */
export type JsonObject = Record<string, JsonValue | undefined>

/**
 * A JSON array is defined as an array of JSON values, which can be either scalar types, structured types, or null.
 */
export type JsonArray = (JsonValue | JsonObject)[]

/**
 * A class with default constructor, that is, the constructor with no argument is required.
 */
export type UnitObjectClass<T = any> = new() => T

/**
 * Unit Object type.
 */
export type UnitObjectType = UnitObjectClass | ScalarType | UnitObjectType[]

/**
 * A function that takes a property name in its original form and returns the name in a new form.
 */
export type NameMappingStrategy = (originName: string) => string;

/**
 * Property bind options.
 */
export type BindOptions = {
    // Whether it is a record or not. A record is defined as an object where the type of keys are string, and the
    // values are specified unit objects.
    isRecord?: boolean

    // Options for to-conversion. A to-conversion is a conversion from a unit object to a JSON object.
    toOptions: {
        // Whether this property is bound to the to-conversion.
        bound?: boolean
        // The mapping name of this property.
        name?: string
        // The unit object type of the value of this property.
        type?: UnitObjectType
        // Whether this property is required. Ladder will throw an Exception if the value of this property in the unit
        // object is undefined.
        isRequired?: boolean
    }

    // Options for from-conversion. A to-conversion is a conversion from a JSON object to a unit object.
    fromOptions: {
        // Whether this property is bound to the from-conversion
        bound?: boolean
        // The mapping name of this property.
        name?: string
        // The unit object type of the value of this property.
        type?: UnitObjectType
        // Whether this property is required. Ladder will throw an Exception if the value of this property in the
        // original JSON object is missing.
        isRequired?: boolean
    }
}

export type ConverterOptions = {
    // the name mapping strategy for <to> conversion
    toNameMappingStrategy: NameMappingStrategy;
    // the name mapping strategy for <from> conversion
    fromNameMappingStrategy: NameMappingStrategy;
}

export type LadderOptions = ConverterOptions & {

}