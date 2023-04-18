import { Level } from '../Level'
import { Exception } from './Exception'

export class FromJsonPropertyMissingException extends Exception {
    public constructor(propertyName: string, className: string, level: Level) {
        super(`Property "${propertyName}" is missing in $${className} (${level.toString()}).`)
    }
}