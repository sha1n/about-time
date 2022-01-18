[![CI](https://github.com/sha1n/about-time/actions/workflows/ci.yml/badge.svg)](https://github.com/sha1n/about-time/actions/workflows/ci.yml)
[![Coverage](https://github.com/sha1n/about-time/actions/workflows/coverage.yml/badge.svg)](https://github.com/sha1n/about-time/actions/workflows/coverage.yml)
![GitHub](https://img.shields.io/github/license/sha1n/about-time)
![npm type definitions](https://img.shields.io/npm/types/@sha1n/about-time)
![npm](https://img.shields.io/npm/v/@sha1n/about-time)


# About-Time

A collection of essential time related utilities.

- [About-Time](#about-time)
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
npm i @sha1n/about-time
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
Exponential backoff formula based retry policy with optional custom exponent base and a limit. 
The optional `limit` provides control over maximum pause intervals, so they don't soar beyond reasonable values.

**The formula used by this implementation is the following:** 

interval<sub>i</sub> = min(limit, (exponential<sup>i</sup> - 1) / 2)

```ts
const retryPolicy = exponentialBackoffRetryPolicy(/* count = */10, /* opts?: { exponential?: number, limit?: number, units?: TimeUnit }*/);
```

### RetryAround
Executes the given function with retries based on the specified policy and *optional* predicate.
The predicate provides control over which errors we want to retry on.
```ts
const result = await retryAround(action, retryPolicy, predicate);
```

### Retriable
Wraps a given function with `retryAround` with the specified arguments.
```ts
const retriableAction = retriable(action, retryPolicy, predicate);
const result = await retriableAction();
```
