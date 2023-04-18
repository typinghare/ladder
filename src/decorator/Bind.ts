import { BindOptions, UnitObjectType } from '../common/type'
import { DG } from '../common/global'
import { isUndefined } from 'lodash'

export type ExtendedBindOptions = BindOptions & {
    // The mapping name of this property. If the name is not specified, Ladder will take the original name.
    name?: string

    // Whether this property is required. Ladder will throw an Exception if the property is missing during conversion.
    isRequired?: boolean
}

/**
 * A decorator that make a property be bound.
 * @param unitObjectType
 * @param options bind options
 * @constructor
 */
export function Bind(unitObjectType?: UnitObjectType, options?: Partial<ExtendedBindOptions>): PropertyDecorator {
    return DG.generatePropertyDecorator<ExtendedBindOptions>(undefined, function() {
        // isObject assignment
        this.set('isRecord', !!options?.isRecord)

        const toOptions = this.getOrDefault('toOptions', {})
        const fromOptions = this.getOrDefault('fromOptions', {})
        this.set('toOptions', toOptions)
        this.set('fromOptions', fromOptions)

        // bound assignment
        toOptions.bound = true
        fromOptions.bound = true

        // type assignment
        if (!isUndefined(unitObjectType)) {
            toOptions.type = unitObjectType
            fromOptions.type = unitObjectType
        }

        // name assignment
        const name = options?.name
        if (!isUndefined(name)) {
            toOptions.name = name
            fromOptions.name = name
        }

        // isRequired assignment
        if (!isUndefined(options?.isRequired)) {
            toOptions.isRequired = fromOptions.isRequired = !!options?.isRequired
        }

        // other options
        !isUndefined(options) && Object.assign(toOptions, options.toOptions)
        !isUndefined(options) && Object.assign(fromOptions, options.fromOptions)
    })
}

export function To(
    unitObjectType?: UnitObjectType,
    toOptions?: Partial<ExtendedBindOptions['toOptions']>,
): PropertyDecorator {
    return Bind(unitObjectType, { toOptions })
}

export function From(
    unitObjectType?: UnitObjectType,
    fromOptions?: Partial<ExtendedBindOptions['fromOptions']>,
): PropertyDecorator {
    return Bind(unitObjectType, { fromOptions })
}

export function BindRecord(
    unitObjectType?: UnitObjectType,
    options?: Partial<ExtendedBindOptions>,
): PropertyDecorator {
    options = options || {}
    options.isRecord = true

    return Bind(unitObjectType, options)
}

export function Required(): PropertyDecorator {
    return Bind(undefined, { isRequired: true })
}