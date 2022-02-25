import { TimeUnit, toMilliseconds } from './timeunit';

class TimeoutError extends Error {
  constructor(message?: string) {
    super(message || 'Timeout');
  }
}

type TimerOptions = {
  /**
   * The time to set
   */
  readonly time: number;
  /**
   * Optional units for the specified time
   */
  readonly units?: TimeUnit;
  /**
   * Whether to call unref on the timer
   */
  readonly unref?: boolean;
};

type PollOptions = {
  /**
   * The poll interval to set
   */
  readonly interval?: number;
  /**
   * The overall deadline to set
   */
  readonly deadline?: number;
  /**
   * Time units for specified time properties
   */
  readonly units?: TimeUnit;
  /**
   * Whether to call unref on any intervals/timers
   */
  readonly unref?: boolean;
};

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
function delay<T>(action: () => T | Promise<T>, options: TimerOptions): Promise<T> {
  const { time, units, unref } = options;
  const delayMs = toMilliseconds(time, units);
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => Promise.resolve(action()).then(resolve, reject), delayMs);

    if (unref) {
      timer.unref();
    }
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
 * @param options poll-options
 * @returns a promise that resolves when the condition becomes true, or rejects when a set timeout is crossed.
 */
async function until(condition: () => boolean, options?: PollOptions): Promise<void> {
  const defaultInterval = 50;
  const deadline = options?.deadline ? Date.now() + toMilliseconds(options.deadline, options.units) : Number.MAX_VALUE;
  const interval = options?.interval ? toMilliseconds(options.interval, options.units) : defaultInterval;

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

    if (options?.unref) {
      handle.unref();
    }
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
 * @param options timer options
 * @returns the action result
 */
async function timeoutAround<T>(action: () => T | Promise<T>, options: TimerOptions): Promise<T> {
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
    }, toMilliseconds(options.time, options.units));

    if (options.unref) {
      timer.unref();
    }

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

function timeBounded<T>(action: () => T | Promise<T>, options: TimerOptions): () => Promise<T> {
  return () => {
    return timeoutAround(action, options);
  };
}

export { timeoutAround, timeBounded, sleep, delay, stopwatch, until, eventually };
