import { computed } from "vue";
import { useLocalStorage, StorageKey } from "./localStorage";

export enum Theme {
  DARK = "json-pizza-dark",
  LIGHT = "json-pizza-light",
}

export function useTheme(defaultTheme: Theme = Theme.LIGHT) {
  const theme = useLocalStorage(StorageKey.THEME, defaultTheme);

  const toggleTheme = () => {
    theme.value = theme.value === Theme.DARK ? Theme.LIGHT : Theme.DARK;
  };
  const isDarkTheme = computed(() => theme.value === Theme.DARK);

  return {
    theme,
    toggleTheme,
    isDarkTheme,
  };
}
