import { fixedRetryPolicy } from '../lib/retry';
import { TimeUnit } from '../lib/timeunit';
import { consume } from './utils';

describe('FixedRetryPolicy', () => {
  test('should return the specified intervals', () => {
    const { expectedIntervals, policy } = fixture();
    let actualCount = 0;

    for (const interval of policy.intervals()) {
      expect(interval).toEqual(expectedIntervals[actualCount]);
      actualCount += 1;
    }

    expect(actualCount).toEqual(expectedIntervals.length);
  });

  test('should be reusable [white box - bug fix]', () => {
    const { expectedIntervals, policy } = fixture();

    consume(policy);

    expect(consume(policy)).toEqual(expectedIntervals);
  });

  test('should apply non default time units', () => {
    const intervals = [1, 2, 3];
    const units = TimeUnit.Second;
    const policy = fixedRetryPolicy(intervals, { units });

    expect(consume(policy)).toEqual(intervals.map(i => i * units));
  });
});

function fixture() {
  const expectedIntervals = [1, 2, 3];
  const policy = fixedRetryPolicy(expectedIntervals);

  return {
    expectedIntervals,
    policy
  };
}
