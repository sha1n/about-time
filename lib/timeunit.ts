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

/**
 * Converts time value in other units to milliseconds.
 *
 * @param time a time value to be converted
 * @param units the units of time
 * @returns the time value in milliseconds
 */
function toMilliseconds(time: number, units?: TimeUnit): number {
  return time * (units ? units : 1);
}

export { TimeUnit, toMilliseconds };
