import { toMilliseconds } from './toMilliseconds';
import { TimerOptions } from './types';

/**
 * Zzzz...
 *
 * @param time the approximate time to sleep (expect it to be as accurate as setTimeout)
 * @param options timer options minus the time property
 * @returns a promise that resolves when the specified time has elapsed.
 */
function sleep(time: number, options?: Omit<TimerOptions, 'time'>): Promise<void> {
  return new Promise(resolve => {
    const timeout = setTimeout(resolve, toMilliseconds(time, options?.units));

    if (options?.unref) {
      timeout.unref();
    }
  });
}

/**
 * Delays the execution of the specified action and returns its value.
 *
 * @param action a function to execute with delay
 * @param options timer options
 * @returns a promise that resolves when the specified time has elapsed.
 */
async function delay<T>(action: () => T | Promise<T>, options: TimerOptions): Promise<T> {
  await sleep(options.time, options);
  const result = await action();

  return result;
}

/**
 * Returns a new function that executes the specified action with delay.
 *
 * @param action a function to execute with delay
 * @param options timer options
 * @returns a new function.
 */
function delayed<T>(action: () => T | Promise<T>, options: TimerOptions): () => Promise<T> {
  return async () => {
    return delay(action, options);
  };
}

export { sleep, delay, delayed };
