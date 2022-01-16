import { Chance } from 'chance';
const chance = new Chance();

const anError = () => new Error(chance.string());
const aString = () => chance.string();
const anInteger = (opts?: { min: number; max: number }) => chance.integer(opts);

export { anError, aString, anInteger };
