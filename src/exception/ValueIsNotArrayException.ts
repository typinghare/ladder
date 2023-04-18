import { Exception } from './Exception'
import { Level } from '../Level'

export class ValueIsNotArrayException extends Exception {
    public constructor(propertyName: string, className: string, level: Level) {
        super(`Value of "${propertyName}" in $${className} (${level.toString()}) is not an array, but its type is.`)
    }
}