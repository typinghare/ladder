/**
 * Warning utility class.
 */
export class Warnings {
    private constructor() {
    }

    /**
     * Prompts a message.
     * @param type the type of this warning
     * @param message the message to prompt
     */
    public static prompt(type: string, message: string): void {
        console.log(`[${type}] ${message}`)
    }

    public static warning(message: string): void {
        Warnings.prompt('WARNING', message)
    }

    /**
     * Prompts a deprecated message.
     * @param message the message
     * @param since from which version
     */
    public static deprecated(message: string, since: string): void {
        Warnings.prompt('DEPRECATED', message + ` (Since: ${since})`)
    }
}