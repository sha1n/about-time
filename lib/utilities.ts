import { TimeUnit, toMilliseconds } from './timeunit';

class TimeoutError extends Error {
  constructor(message?: string) {
    super(message || 'Timeout');
  }
}

/**
 * Zzzz...
 *
 * @param time time to sleep
 * @param units the units on time
 * @returns a promise that resolves when the specified time has elapsed.
 */
function sleep(time: number, units?: TimeUnit): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, toMilliseconds(time, units));
  });
}

/**
 * Delays the execution of the specified action and returns its value.
 *
 * @param action a function to execute with delay
 * @param time time to sleep
 * @param units the units on time
 * @returns a promise that resolves when the specified time has elapsed.
 */
function delay<T>(action: () => T | Promise<T>, time: number, units?: TimeUnit): Promise<T> {
  const delayMs = toMilliseconds(time, units);
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => Promise.resolve(action()).then(resolve, reject), delayMs);
    process.on('beforeExit', () => {
      clearTimeout(timer);
    });
  });
}

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

/**
 * Awaits a specified condition to evaluate to true with or without a timeout.
 *
 * @param condition the condition to wait for
 * @param opts options that control evaluation intervals and timeout
 * @returns a promise that resolves when the condition becomes true, or rejects when a set timeout is crossed.
 */
async function until(
  condition: () => boolean,
  opts?: { interval?: number; timeout: number; units?: TimeUnit }
): Promise<void> {
  const defaultInterval = 50;
  const deadline = opts ? Date.now() + toMilliseconds(opts.timeout, opts.units) : Number.MAX_VALUE;
  const interval = opts?.interval ? toMilliseconds(opts.interval, opts.units) : defaultInterval;

  return new Promise<void>((resolve, reject) => {
    const handle = setInterval(() => {
      if (Date.now() > deadline) {
        clearInterval(handle);
        reject(new TimeoutError());
      }

      try {
        if (condition()) {
          clearInterval(handle);
          resolve();
        }
      } catch (e) {
        clearInterval(handle);
        reject(e);
      }
    }, interval);
  });
}

/**
 * Alias to `until`
 */
const eventually = until;

/**
 * Executes an action with a specified timeout. If the action times out, rejects with TimeoutError.
 *
 * @param action an action to execute with timeout
 * @param timeout the timeout to set for the action
 * @param units the time units
 * @returns the action result
 */
async function withTimeout<T>(action: () => T | Promise<T>, timeout: number, units?: TimeUnit): Promise<T> {
  const promisedAction = new Promise<T>((resolve, reject) => {
    try {
      resolve(action());
    } catch (e) {
      reject(e);
    }
  });

  const race = new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new TimeoutError());
    }, toMilliseconds(timeout, units));

    return Promise.resolve(promisedAction).then(
      r => {
        clearTimeout(timer);
        resolve(r);
      },
      err => {
        clearTimeout(timer);
        reject(err);
      }
    );
  });

  return race;
}

export { withTimeout, sleep, delay, stopwatch, until, eventually };
