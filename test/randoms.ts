import { Chance } from 'chance';
const chance = new Chance();

const anError = () => new Error(chance.string());
const aString = () => chance.string();
const anInteger = (opts?: { min: number; max: number }) => chance.integer(opts);
const aBoolean = () => chance.bool();

export { anError, aString, anInteger, aBoolean };
