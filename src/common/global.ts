import { DecoratorGenerator, Zone } from '@typinghare/ts-reflect'

/**
 * The name of this project.
 */
export const PROJECT_NAME = "Ladder";

/**
 * The zone from `ts-reflect` package.
 */
export const zone: Zone = new Zone(PROJECT_NAME)

/**
 * Decorator generator from `ts-reflect` package.
 */
export const DG = new DecoratorGenerator(zone)