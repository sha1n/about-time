import { toMilliseconds } from './toMilliseconds';
import { TimerOptions, TimeoutError } from './types';

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

export { timeBounded, timeoutAround };
