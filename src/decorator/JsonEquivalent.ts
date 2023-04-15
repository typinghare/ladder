import { DG } from '../global'
import { ConverterOptions } from '../Converter'

export type JsonEquivalentContext = ConverterOptions & {
    isJsonEquivalent: boolean
}

/**
 *
 * @constructor
 */
export function JsonEquivalent(converterOptions?: ConverterOptions): ClassDecorator {
    return DG.generateClassDecorator<JsonEquivalentContext>({
        isJsonEquivalent: true,
        ...converterOptions,
    })
}