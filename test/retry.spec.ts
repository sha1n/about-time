import { fixedRetryPolicy, retriable, simpleRetryPolicy } from '../lib/retry';
import { anError, aString } from './randoms';

describe('retriable', () => {
  const expectedError = anError();

  test('should throw when no retries are left', async () => {
    const policy = fixedRetryPolicy([1, 1]);
    const fail = () => Promise.reject(expectedError);

    await expect(retriable(fail, policy)()).rejects.toThrow(expectedError);
  });

  test('should throw when no retries are left with sync action', async () => {
    const policy = fixedRetryPolicy([1]);
    const failSync = () => {
      throw expectedError;
    };

    await expect(retriable(failSync, policy)()).rejects.toThrow(expectedError);
  });

  test('should throw when the provided policy is effectively empty', async () => {
    const policy = fixedRetryPolicy([]);
    const { action } = givenAsyncActionThatFailsOnce();

    await expect(retriable(action, policy)()).rejects.toThrow(expectedError);
  });

  test('should retry and resolve with an async function resolved value', async () => {
    const policy = simpleRetryPolicy(1, 1);
    const { action, expectedValue } = givenAsyncActionThatFailsOnce();

    await expect(retriable(action, policy)()).resolves.toEqual(expectedValue);
  });

  test('should retry and resolve with a sync function returned value', async () => {
    const policy = simpleRetryPolicy(1, 1);
    const { action, expectedValue } = givenSyncActionThatFailsOnce();

    await expect(retriable(action, policy)()).resolves.toEqual(expectedValue);
  });

  function givenSyncActionThatFailsOnce(): {
    action: () => string;
    expectedValue: string;
  } {
    const expectedValue = aString();
    let fail = true;
    return {
      action: () => {
        if (fail) {
          fail = false;
          throw expectedError;
        }
        return expectedValue;
      },
      expectedValue
    };
  }

  function givenAsyncActionThatFailsOnce(): {
    action: () => Promise<string>;
    expectedValue: string;
  } {
    const expectedValue = aString();

    let fail = true;
    return {
      action: async () => {
        if (fail) {
          fail = false;
          throw expectedError;
        }
        return expectedValue;
      },
      expectedValue
    };
  }
});
