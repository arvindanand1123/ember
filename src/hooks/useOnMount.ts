import { useEffect } from 'react';

import { useStable } from './useStable';

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- generic passthrough, fine for O(1) layer
export function useOnMount<T extends(...args: any[]) => void  | (() => void)>(fn: T): void {
  const stableFn = useStable((...args: Parameters<T>) => fn(...args));
  return useEffect(stableFn, [stableFn]);
}
