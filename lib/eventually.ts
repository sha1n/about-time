import { toMilliseconds } from './toMilliseconds';
import { PollOptions, TimeoutError } from './types';

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
    let handle: NodeJS.Timeout;

    const poll = () => {
      if (Date.now() > deadline) {
        reject(new TimeoutError());
        return;
      }

      try {
        if (condition()) {
          resolve();
        } else {
          handle = setTimeout(poll, interval);
          if (options?.unref) {
            handle.unref();
          }
        }
      } catch (e) {
        reject(e);
      }
    };

    poll();
  });
}

/**
 * Alias to `until`
 */
const eventually = until;

export { until, eventually };
