export class Level {
    private readonly levels: string[]

    public static root(): Level {
        return new Level([])
    }

    private constructor(levels: string[]) {
        this.levels = levels
    }

    /**
     * Returns next level.
     * @param name the name of the next level
     */
    public next(name: string): Level {
        const level = new Level(this.levels)
        level.addNextLevel(name)

        return level
    }

    public getLevels(): string[] {
        return this.levels
    }

    public toString(): string {
        return this.levels.join('->')
    }

    private addNextLevel(name: string): void {
        this.levels.push(name)
    }
}