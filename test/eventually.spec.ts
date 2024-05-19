import 'jest-extended';
import { TimeUnit } from '../lib/types';
import { stopwatch } from '../lib/stopwatch';
import { until, eventually } from '../lib/eventually';
import { anError, aBoolean } from './randoms';

describe.each(cases())('%s', ({ fn }) => {
  const pollOpts = { deadline: 1, units: TimeUnit.Milliseconds, unref: aBoolean() };

  test('should reject with timeout when the provided timeout is passed', async () => {
    const never = () => Date.now() < 0;

    await expect(fn(never, pollOpts)).rejects.toThrow('Timeout');
  });

  test('should reject when the provided condition function throws', async () => {
    const expectedError = anError();
    const never = () => {
      throw expectedError;
    };

    await expect(fn(never, { deadline: 10, units: TimeUnit.Seconds, unref: aBoolean() })).rejects.toThrow(
      expectedError
    );
  });

  test('should resolve when the provided condition is true within a specified timeout boundary', async () => {
    let value = false;
    setTimeout(() => {
      value = true;
    }, 100);

    await expect(fn(() => value, { deadline: 1, units: TimeUnit.Minutes, unref: aBoolean() })).toResolve();
  });

  test('should use the interval option when present', async () => {
    let value = false;
    setTimeout(() => {
      value = true;
    }, 120);

    const elapsed = stopwatch();
    await expect(
      fn(() => value, {
        deadline: 1 * TimeUnit.Minute,
        interval: 10,
        units: TimeUnit.Milliseconds,
        unref: aBoolean()
      })
    ).toResolve();

    expect(elapsed()).toBeGreaterThanOrEqual(100);
    expect(elapsed()).toBeLessThan(100 * 1.5);
  });

  test('should resolve when the provided condition is true with no timeout boundary', async () => {
    let value = false;
    setTimeout(() => {
      value = true;
    }, 100);

    await expect(fn(() => value)).toResolve();
  });

  test('should resolve when the condition is already true', async () => {
    await expect(fn(() => true)).toResolve();
  });
});

function cases() {
  return [
    {
      fn: until,
      toString: () => 'until'
    },
    {
      fn: eventually,
      toString: () => 'eventually'
    }
  ];
}
