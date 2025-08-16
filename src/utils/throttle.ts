export function useThrottledFn<T extends (...args: any[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let pendingArgs: Parameters<T> | null = null;
  let inThrottle = false;

  function throttled(this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      timer = setTimeout(() => {
        inThrottle = false;
        if (pendingArgs) {
          throttled.apply(this, pendingArgs);
          pendingArgs = null;
        }
      }, delay);
    } else {
      pendingArgs = args;
    }
  }

  return throttled;
}
