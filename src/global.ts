import { DecoratorGenerator, Zone } from '@typinghare/ts-reflect'

export const PROJECT_NAME = "LADDER";

export const zone: Zone = new Zone(PROJECT_NAME)
export const DG = new DecoratorGenerator(zone)