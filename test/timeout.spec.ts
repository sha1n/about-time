import 'jest-extended';
import { TimeUnit } from '../lib/types';
import { until } from '../lib/eventually';
import { timeBounded } from '../lib/timeout';
import { anError, aString, aBoolean } from './randoms';

describe('timeoutAround/timeBounded', () => {
  const expectedError = anError();
  const expectedValue = aString();

  test('should reject when the action rejects', async () => {
    const action = () => Promise.reject(expectedError);

    await expect(timeBounded(action, { time: 1, units: TimeUnit.Minute, unref: aBoolean() })()).rejects.toThrow(
      expectedError
    );
  });

  test('should reject when the action throws', async () => {
    const action = () => {
      throw expectedError;
    };

    await expect(timeBounded(action, { time: 1, units: TimeUnit.Minute, unref: aBoolean() })()).rejects.toThrow(
      expectedError
    );
  });

  test('should resolve to the action resolved value when resolves on time', async () => {
    const action = () => Promise.resolve(expectedValue);

    await expect(timeBounded(action, { time: 1, units: TimeUnit.Minute, unref: aBoolean() })()).resolves.toEqual(
      expectedValue
    );
  });

  test('should resolve to the action returned value when returns on time', async () => {
    const action = () => expectedValue;

    await expect(timeBounded(action, { time: 1, units: TimeUnit.Minute, unref: aBoolean() })()).resolves.toEqual(
      expectedValue
    );
  });

  // eslint-disable-next-line prettier/prettier
  test('should reject with timeout when the action doesn\'t resolve on time', async () => {
    let done = false;
    const longAction = async () => {
      await until(() => done);
    };

    await expect(
      timeBounded(longAction, { time: 1, units: TimeUnit.Millisecond, unref: aBoolean() })()
    ).rejects.toThrow(/Timeout/);
    done = true;
  });
});
