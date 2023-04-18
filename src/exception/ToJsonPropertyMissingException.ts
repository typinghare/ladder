import { Exception } from './Exception'
import { Level } from '../Level'

export class ToJsonPropertyMissingException extends Exception {
    public constructor(propertyName: string, className: string, level: Level) {
        super(`Property "${propertyName}" is missing in $${className} (${level.toString()}).`)
    }
}