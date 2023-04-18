export class Exception extends Error {
    constructor(message?: string) {
        super()

        this.message = `[${this.getName()}] ${message}`
    }

    /**
     * Returns the name of this exception.
     */
    public getName(): string {
        return this.constructor.name
    }
}