// eslint-disable-next-line no-restricted-imports -- useStable cannot implement itself; sole sanctioned useCallback
import { useCallback, useLayoutEffect, useRef } from 'react';

// fine for O(1) layer
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useStable<T extends(...args: any[]) => any>(fn: T): T {
  const ref = useRef(fn);
  useLayoutEffect(() => {
    ref.current = fn;
  });
  return useCallback((...args: Parameters<T>) => ref.current(...args), []) as T;
}
