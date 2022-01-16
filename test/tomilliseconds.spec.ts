import 'jest-extended';
import { TimeUnit, toMilliseconds } from '../lib/timeunit';

describe('toMilliseconds', () => {
  test('should converted all units correctly', async () => {
    expect(toMilliseconds(1, TimeUnit.Milliseconds)).toEqual(1);
    expect(toMilliseconds(1, TimeUnit.Millisecond)).toEqual(1);
    expect(toMilliseconds(1, TimeUnit.Seconds)).toEqual(
      1000 * TimeUnit.Milliseconds
    );
    expect(toMilliseconds(1, TimeUnit.Second)).toEqual(
      1000 * TimeUnit.Milliseconds
    );
    expect(toMilliseconds(1, TimeUnit.Minutes)).toEqual(60 * TimeUnit.Seconds);
    expect(toMilliseconds(1, TimeUnit.Minute)).toEqual(60 * TimeUnit.Seconds);
    expect(toMilliseconds(1, TimeUnit.Hours)).toEqual(60 * TimeUnit.Minutes);
    expect(toMilliseconds(1, TimeUnit.Hour)).toEqual(60 * TimeUnit.Minutes);
    expect(toMilliseconds(1, TimeUnit.Days)).toEqual(24 * TimeUnit.Hours);
    expect(toMilliseconds(1, TimeUnit.Day)).toEqual(24 * TimeUnit.Hours);
  });
});
