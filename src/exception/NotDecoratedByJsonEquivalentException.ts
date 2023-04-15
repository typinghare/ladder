/**
 * Error class indicating that a class is not decorated by @JsonEquivalent().
 * @see JsonEquivalent
 * @author James Chan
 */
export class NotDecoratedByJsonEquivalentException extends Error {
    public constructor(className: string) {
        super(`Class ${className} is not decorated by @JsonEquivalent().`)
    }
}