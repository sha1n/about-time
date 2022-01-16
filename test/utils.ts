import { RetryPolicy } from '../lib/retry';

function consume(policy: RetryPolicy): number[] {
  return [...policy.intervals()];
}

export { consume };
