import { UnitObjectClass } from './common/type'

/**
 * Unit object utility class.
 */
export class UnitObjects {
    private constructor() {
    }

    /**
     * Builds a unit object.
     * @param unitObjectClass the class of the unit object to create and build
     * @param object
     */
    public static build<T>(
        unitObjectClass: UnitObjectClass<T>,
        object: { [K in keyof T]: T[K] },
    ): T {
        const unitObject = new unitObjectClass()

        for (const key in object) {
            unitObject[key] = object[key]
        }

        return unitObject
    }
}