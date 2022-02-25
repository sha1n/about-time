enum TimeUnit {
  Milliseconds = 1,
  Millisecond = Milliseconds,
  Seconds = 1000,
  Second = Seconds,
  Minutes = 1000 * 60,
  Minute = Minutes,
  Hours = 1000 * 60 * 60,
  Hour = Hours,
  Days = 1000 * 60 * 60 * 24,
  Day = Days
}

class TimeoutError extends Error {
  constructor(message?: string) {
    super(message || 'Timeout');
  }
}

type TimerOptions = {
  /**
   * The time to set
   */
  readonly time: number;
  /**
   * Optional units for the specified time
   */
  readonly units?: TimeUnit;
  /**
   * Whether to call unref on the timer
   */
  readonly unref?: boolean;
};

type PollOptions = {
  /**
   * The poll interval to set
   */
  readonly interval?: number;
  /**
   * The overall deadline to set
   */
  readonly deadline?: number;
  /**
   * Time units for specified time properties
   */
  readonly units?: TimeUnit;
  /**
   * Whether to call unref on any intervals/timers
   */
  readonly unref?: boolean;
};

export { TimeUnit, PollOptions, TimeoutError, TimerOptions };
