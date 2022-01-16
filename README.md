[![CI](https://github.com/sha1n/ontime/actions/workflows/ci.yml/badge.svg)](https://github.com/sha1n/ontime/actions/workflows/ci.yml)
[![Coverage](https://github.com/sha1n/ontime/actions/workflows/coverage.yml/badge.svg)](https://github.com/sha1n/ontime/actions/workflows/coverage.yml)
![GitHub](https://img.shields.io/github/license/sha1n/ontime)
![npm type definitions](https://img.shields.io/npm/types/@sha1n/ontime)
![npm](https://img.shields.io/npm/v/@sha1n/ontime)


# OnTime

A set of essential time related utilities.

- [OnTime](#ontime)
  - [Install](#install)
  - [Delay](#delay)
  - [Sleep](#sleep)
  - [Stopwatch](#stopwatch)
  - [Until / Eventually](#until--eventually)
  - [Retry](#retry)
    - [RetryPolicy](#retrypolicy)
      - [Simple retry policy](#simple-retry-policy)
      - [Fixed retry policy](#fixed-retry-policy)
      - [Exponential backoff retry policy](#exponential-backoff-retry-policy)
    - [RetryAround](#retryaround)
    - [Retriable](#retriable)


## Install
```bash
npm i @sha1n/ontime
```

## Delay
```ts
// Execute a function with delay and return it's value
await delay(action, 10, TimeUnit.Milliseconds);
```

## Sleep
```ts
// Pause execution for a specified amount of time
await sleep(10, TimeUnit.Seconds);
```

## Stopwatch
```ts
// Measure time between actions
const elapsed = stopwatch();
    
// do stuff here...

const elapsed1 = elapsed(TimeUnit.Milliseconds);

// do more stuff here...

const elapsed2 = elapsed(TimeUnit.Seconds);
```

## Until / Eventually
```ts
// Wait for a condition to become true
await until(condition, {timeout: 1, units: TimeUnit.Minute});
await eventually(condition, {timeout: 1, units: TimeUnit.Minute});
```

## Retry

### RetryPolicy
#### Simple retry policy
```ts
// 3 retries with 10 seconds wait between each
const retryPolicy = simpleRetryPolicy(3, 10, TimeUnit.Seconds);
```

#### Fixed retry policy
```ts
// 4 retries after 3, then after 10, 50 and 100 milliseconds
const retryPolicy = fixedRetryPolicy([3, 10, 50, 100], TimeUnit.Milliseconds);
```

#### Exponential backoff retry policy
```ts
// 10 retries, starting with 10 milliseconds and then exponentially increases the delay based on the default power value without a limit.
const retryPolicy = exponentialBackoffRetryPolicy(/* count = */10, /* opts?: { exponential?: number, limit?: number, units?: TimeUnit }*/);
```

### RetryAround
Executes the given function with the retries based on the specified policy.
```ts
const result = await retryAround(action, retryPolicy);
```

### Retriable
Wraps a given function with `retryAround` with the specified policy.
```ts
const retriableAction = retriable(action, retryPolicy);
const result = await retriableAction();
```
