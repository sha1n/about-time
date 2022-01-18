import { TimeUnit, toMilliseconds } from './timeunit';
import { sleep } from './utilities';

interface RetryPolicy {
  intervals(): Iterable<number>;
}

class SimpleRetryPolicy implements RetryPolicy {
  private readonly interval: number;

  constructor(private readonly count: number, interval: number, units?: TimeUnit) {
    this.interval = toMilliseconds(interval, units);
  }

  *intervals(): Iterable<number> {
    let count = this.count;
    while (count > 0) {
      count -= 1;
      yield this.interval;
    }

    return;
  }
}

class ExponentialBackoffRetryPolicy implements RetryPolicy {
  constructor(
    private readonly count: number,
    private readonly exponential = 2,
    private readonly limit = Infinity,
    private readonly units = TimeUnit.Milliseconds
  ) {}

  *intervals(): Iterable<number> {
    let index = 0;

    while (index < this.count) {
      const interval = Math.round((Math.pow(this.exponential, index) - 1) / 2);
      yield Math.min(this.limit, interval) * this.units;
      index += 1;
    }

    return;
  }
}

class FixedRetryPolicy implements RetryPolicy {
  private _intervals: number[];

  constructor(intervals: number[], units?: TimeUnit) {
    this._intervals = intervals.reduceRight((result, v) => {
      result.push(toMilliseconds(v, units));
      return result;
    }, []);
  }

  *intervals(): Iterable<number> {
    const intervals = [...this._intervals];
    while (intervals.length > 0) {
      yield intervals.pop();
    }

    return;
  }
}

function simpleRetryPolicy(count: number, interval: number, opts?: { units?: TimeUnit }): RetryPolicy {
  return Object.freeze(new SimpleRetryPolicy(count, interval, opts?.units));
}

function fixedRetryPolicy(intervals: number[], opts?: { units?: TimeUnit }): RetryPolicy {
  return Object.freeze(new FixedRetryPolicy(intervals, opts?.units));
}

function exponentialBackoffRetryPolicy(
  count: number,
  opts?: { exponential?: number; limit?: number; units?: TimeUnit }
): RetryPolicy {
  return Object.freeze(new ExponentialBackoffRetryPolicy(count, opts?.exponential, opts?.limit, opts?.units));
}

async function retryAround<T>(action: () => T | Promise<T>, policy: RetryPolicy): Promise<T> {
  let next: IteratorResult<number, undefined>;
  const intervals = policy.intervals()[Symbol.iterator]();
  do {
    try {
      return await action();
    } catch (e) {
      next = intervals.next();

      if (next.done) {
        throw e;
      }

      await sleep(next.value);
    }
  } while (!next.done);

  throw new Error('Unexpected error. This is most likely a bug.');
}

function retriable<T>(action: () => T | Promise<T>, policy: RetryPolicy): () => Promise<T> {
  return () => {
    return retryAround(action, policy);
  };
}

export { RetryPolicy, retryAround, retriable, fixedRetryPolicy, simpleRetryPolicy, exponentialBackoffRetryPolicy };
