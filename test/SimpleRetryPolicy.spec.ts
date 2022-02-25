import { simpleRetryPolicy } from '../lib/retry';
import { TimeUnit } from '../lib/types';
import { anInteger } from './randoms';
import { consume } from './utils';

describe('SimpleRetryPolicy', () => {
  test('should return the same interval times the count', () => {
    const { expectedCount, expectedInterval, policy } = fixture();
    let actualCount = 0;

    for (const interval of policy.intervals()) {
      actualCount += 1;
      expect(interval).toEqual(expectedInterval);
    }

    expect(actualCount).toEqual(expectedCount);
  });

  test('should be reusable [white box - bug fix]', () => {
    const { expectedCount, policy } = fixture();

    consume(policy);

    expect(consume(policy)).toHaveLength(expectedCount);
  });

  test('should apply non default time units', () => {
    const expectedCount = anInteger({ min: 1, max: 10 });
    const interval = anInteger({ min: 10, max: 100 });
    const units = TimeUnit.Hours;
    const policy = simpleRetryPolicy(expectedCount, interval, { units });

    expect(consume(policy)).toEqual(Array(expectedCount).fill(interval * units));
  });
});

function fixture() {
  const expectedCount = 2;
  const expectedInterval = 3;

  return {
    expectedCount,
    expectedInterval,
    policy: simpleRetryPolicy(expectedCount, expectedInterval)
  };
}
