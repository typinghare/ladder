import { DG } from '../global'
import { isUndefined } from 'lodash'
import { Type } from '../common/types'


export type BindContext = {
    // options for <to> conversion
    toOptions: {
        // whether this property is bound
        bound?: boolean,
        // the name of key from the original JSON object
        name?: string
        // the type of value of the bound property
        type?: Type
    }
    // options for <from> conversion
    fromOptions: {
        // whether this property is bound
        bound?: boolean,
        // the name of key to the generated JSON object
        name?: string
        // the type of value in the generated JSON object
        type?: Type
    }
}

export type BindOptions = {
    // global
    name?: string,
    toOptions: Partial<BindContext['toOptions']>,
    fromOptions: Partial<BindContext['fromOptions']>
}


/**
 * A decorator.
 * @param type
 * @param options
 * @constructor
 */
export function To(type?: Type, options?: BindOptions['toOptions']): PropertyDecorator {
    const toOptions = options || {} as BindOptions['toOptions']
    toOptions.bound = true
    toOptions.type = type

    return DG.generatePropertyDecorator<BindContext>({ toOptions })
}

/**
 * A decorator.
 * @param type
 * @param options
 * @constructor
 */
export function From(type?: Type, options?: BindOptions['fromOptions']): PropertyDecorator {
    const fromOptions = options || {} as BindOptions['fromOptions']
    fromOptions.bound = true
    fromOptions.type = type

    return DG.generatePropertyDecorator<BindContext>({ fromOptions })
}

/**
 * A decorator that.
 * @param type
 * @param options
 * @constructor
 */
export function Bind(type?: Type, options?: Partial<BindOptions>): PropertyDecorator {
    return DG.generatePropertyDecorator<BindContext>(undefined, function() {
        const toOptions = this.get('toOptions') || {} as BindContext['toOptions']
        const fromOptions = this.get('fromOptions') || {} as BindContext['fromOptions']
        this.set('toOptions', toOptions)
        this.set('fromOptions', fromOptions)

        // bound assignment
        toOptions.bound = true
        fromOptions.bound = true

        // type assignment
        toOptions.type = type
        fromOptions.type = type

        const name = options?.name
        if (!isUndefined(name)) {
            toOptions.name = name
            fromOptions.name = name
        }

        // other options
        Object.assign(toOptions, options?.toOptions)
        Object.assign(fromOptions, options?.fromOptions)
    })
}