import { useEffect } from "react";
import { useMedia } from '@opishub-hooks/useMedia';
import createPersistedState from 'use-persisted-state';
const useDarkModeState = createPersistedState('dark-mode-enabled');

export function useDarkMode() {

  const [enabledState, setEnabledState] = useDarkModeState("dark-mode-enabled");
  const prefersDarkMode = usePrefersDarkMode();
  const enabled =
    typeof enabledState !== "undefined" ? enabledState : prefersDarkMode;
  useEffect(
    () => {
      const className = "dark-mode";
      const element = window.document.body;
      if (enabled) {
        element.classList.add(className);
      } else {
        element.classList.remove(className);
      }
    },
    [enabled] // Only re-call effect when value changes
  );
  // Return enabled state and setter
  return [enabled, setEnabledState];
}

function usePrefersDarkMode() {
  return useMedia(["(prefers-color-scheme: dark)"], [true], false);
}
