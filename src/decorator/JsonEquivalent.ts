import { ConverterOptions } from '../common/type'
import { DG } from '../common/global'

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