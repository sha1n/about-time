import { exponentialBackoffRetryPolicy } from '../lib/retry';
import { TimeUnit } from '../lib/timeunit';
import { anInteger } from './randoms';
import { consume } from './utils';

describe('ExponentialBackoffRetryPolicy', () => {
  test('should exponentially increase the interval up to the specified limit and based on the specified power', () => {
    const policy = exponentialBackoffRetryPolicy(5);

    let index = 0;
    for (const interval of policy.intervals()) {
      expect(interval).toEqual(expectedExponentialDecayIntervalFor(index));
      index += 1;
    }
  });

  test('should use custom exponential value', () => {
    const exponential = 1;
    const policy = exponentialBackoffRetryPolicy(5, { exponential });

    let index = 0;
    for (const interval of policy.intervals()) {
      expect(interval).toEqual(
        expectedExponentialDecayIntervalFor(index, exponential)
      );
      index += 1;
    }
  });

  test('should be reusable [white box - bug fix]', () => {
    const expectedCount = anInteger({ min: 1, max: 10 });
    const policy = exponentialBackoffRetryPolicy(expectedCount);

    consume(policy);

    expect(consume(policy)).toHaveLength(expectedCount);
  });

  test('should apply non default time units', () => {
    const expectedCount = 3;
    const units = TimeUnit.Second;
    const policy = exponentialBackoffRetryPolicy(expectedCount, {
      units
    });

    expect(consume(policy)[2]).toEqual(
      expectedExponentialDecayIntervalFor(2) * units
    );
  });

  test('should not cross a specified limit', () => {
    const expectedCount = 10;
    const limit = 1;
    const policy = exponentialBackoffRetryPolicy(expectedCount, {
      limit
    });

    expect(Math.max(...policy.intervals())).toEqual(limit);
  });
});

function expectedExponentialDecayIntervalFor(
  index: number,
  exponential = 2
): number {
  return Math.round((Math.pow(exponential, index) - 1) / 2);
}
