import 'jest-extended';
import { TimeUnit } from '../lib/timeunit';
import { delay, stopwatch } from '../lib/utilities';
import { anError, aString, anInteger } from './randoms';

describe('delay', () => {
  const expectedError = anError();
  const expectedValue = aString();

  test('should reject when the action rejects', async () => {
    const action = () => Promise.reject(expectedError);

    await expect(delay(action, 1, TimeUnit.Milliseconds)).rejects.toThrow(expectedError);
  });

  test('should resolve to the action value when the action resolves', async () => {
    const action = () => Promise.resolve(expectedValue);

    await expect(delay(action, 1, TimeUnit.Milliseconds)).resolves.toEqual(expectedValue);
  });

  test('should delay the action by the specified amount', async () => {
    const action = () => Promise.resolve(expectedValue);
    const elapsed = stopwatch();
    const delayMs = anInteger({ min: 100, max: 250 });

    await expect(delay(action, delayMs)).resolves.toEqual(expectedValue);

    const elapsedMs = elapsed();
    expect(elapsedMs).toBeGreaterThanOrEqual(delayMs);
    expect(elapsedMs).toBeLessThan(delayMs * 2); // just to make sure we are in a sane range
  });

  test('should resolve to the action value when the action is a sync', async () => {
    const action = () => expectedValue;

    await expect(delay(action, 1, TimeUnit.Milliseconds)).resolves.toEqual(expectedValue);
  });
});
