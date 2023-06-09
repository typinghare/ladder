import { Exception } from './Exception'
import { Level } from '../Level'

export class IllegalArrayTypeException extends Exception {
    public constructor(propertyName: string, className: string, level: Level) {
        super(`Array type of "${propertyName}" in $${className} (${level.toString()}) is illegal.`)
    }
}