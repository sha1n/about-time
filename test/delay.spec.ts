import 'jest-extended';
import { TimeUnit } from '../lib/types';
import { delayed } from '../lib/delay';
import { stopwatch } from '../lib/stopwatch';
import { anError, aString, anInteger, aBoolean } from './randoms';

describe('delay', () => {
  const expectedError = anError();
  const expectedValue = aString();
  const timerOpts = () => {
    return { time: 1, units: TimeUnit.Milliseconds, unref: aBoolean() };
  };

  test('should reject when the action rejects', async () => {
    const action = () => Promise.reject(expectedError);

    await expect(delayed(action, timerOpts())()).rejects.toThrow(expectedError);
  });

  test('should resolve to the action value when the action resolves', async () => {
    const action = () => Promise.resolve(expectedValue);

    await expect(delayed(action, timerOpts())()).resolves.toEqual(expectedValue);
  });

  test('should delay the action by the specified amount', async () => {
    const action = () => Promise.resolve(expectedValue);
    const elapsed = stopwatch();
    const delayMs = anInteger({ min: 100, max: 250 });

    await expect(delayed(action, { time: delayMs })()).resolves.toEqual(expectedValue);

    const elapsedMs = elapsed();
    expect(elapsedMs).toBeGreaterThanOrEqual(delayMs);
    expect(elapsedMs).toBeLessThan(delayMs * 2); // just to make sure we are in a sane range
  });

  test('should resolve to the action value when the action is a sync', async () => {
    const action = () => expectedValue;

    await expect(delayed(action, timerOpts())()).resolves.toEqual(expectedValue);
  });
});
