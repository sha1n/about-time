import 'jest-extended';
import { TimeUnit } from '../lib/timeunit';
import { until, timeBounded } from '../lib/utilities';
import { anError, aString } from './randoms';

describe('timeoutAround/timeBounded', () => {
  const expectedError = anError();
  const expectedValue = aString();

  test('should reject when the action rejects', async () => {
    const action = () => Promise.reject(expectedError);

    await expect(timeBounded(action, { time: 1, units: TimeUnit.Minute })()).rejects.toThrow(expectedError);
  });

  test('should reject when the action throws', async () => {
    const action = () => {
      throw expectedError;
    };

    await expect(timeBounded(action, { time: 1, units: TimeUnit.Minute })()).rejects.toThrow(expectedError);
  });

  test('should resolve to the action resolved value when resolves on time', async () => {
    const action = () => Promise.resolve(expectedValue);

    await expect(timeBounded(action, { time: 1, units: TimeUnit.Minute })()).resolves.toEqual(expectedValue);
  });

  test('should resolve to the action returned value when returns on time', async () => {
    const action = () => expectedValue;

    await expect(timeBounded(action, { time: 1, units: TimeUnit.Minute })()).resolves.toEqual(expectedValue);
  });

  // eslint-disable-next-line prettier/prettier
  test('should reject with timeout when the action doesn\'t resolve on time', async () => {
    let done = false;
    const longAction = async () => {
      await until(() => done);
    };

    await expect(timeBounded(longAction, { time: 1, units: TimeUnit.Millisecond })()).rejects.toThrow(/Timeout/);
    done = true;
  });
});
