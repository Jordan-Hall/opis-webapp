import { useRef, useEffect } from "react";

export function useMemoCompare<T>(next: T, compare: (arg0: T, arg1: T) => T) {
  const previousRef = useRef<T>();
  const previous = previousRef.current;

  const isEqual = compare(previous as T, next);

  useEffect(() => {
    if (!isEqual) {
      previousRef.current = next;
    }
  });

  return isEqual ? previous : next;
}
