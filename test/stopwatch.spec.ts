import 'jest-extended';
import { TimeUnit } from '../lib/timeunit';
import { sleep, stopwatch } from '../lib/utilities';

describe('stopwatch', () => {
  test('should return function that returns elapsed time in millis by default', async () => {
    const elapsed = stopwatch();

    await sleep(10);
    const elapsedTime = elapsed();

    expect(elapsedTime).toBeGreaterThanOrEqual(9 * TimeUnit.Milliseconds);
    expect(elapsedTime).toBeLessThan(TimeUnit.Second);
  });

  test('should return function that returns elapsed time in the specified units', async () => {
    const elapsed = stopwatch();

    await sleep(1, { units: TimeUnit.Second });
    const elapsedTime = elapsed(TimeUnit.Seconds);

    expect(elapsedTime).toBeGreaterThanOrEqual(1);
    expect(elapsedTime).toBeLessThan(2);
  });
});
