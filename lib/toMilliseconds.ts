import { TimeUnit } from './types';

/**
 * Converts time value in other units to milliseconds.
 *
 * @param time a time value to be converted
 * @param units the units of time
 * @returns the time value in milliseconds
 */
function toMilliseconds(time: number, units?: TimeUnit): number {
  return time * (units ? units : 1);
}

export { toMilliseconds };
