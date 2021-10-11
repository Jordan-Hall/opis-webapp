import { useState, useEffect } from "react";

export function useMedia(queries: string[], values: unknown[], defaultValue: unknown[]) {
  const mediaQueryLists = queries.map((q) => window.matchMedia(q));
  const getValue = () => {
    const index = mediaQueryLists.findIndex((mql) => mql.matches);
    return typeof values[index] !== "undefined" ? values[index] : defaultValue;
  };
  const [value, setValue] = useState(getValue);
  useEffect(
    () => {
      const handler = () => setValue(getValue);
      mediaQueryLists.forEach((mql) => mql.addEventListener('change', handler));
      return () =>
        mediaQueryLists.forEach((mql) => mql.removeEventListener('change', handler));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [] // Empty array ensures effect is only run on mount and unmount
  );
  return value;
}
