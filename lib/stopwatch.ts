import { TimeUnit } from './types';

/**
 * Return a function that returns the elapsed time relative to this call.
 * @returns a function
 */
function stopwatch(): (units?: TimeUnit) => number {
  const startTime = Date.now();

  return (units?: TimeUnit) => {
    return (Date.now() - startTime) / (units || TimeUnit.Milliseconds);
  };
}

export { stopwatch };
