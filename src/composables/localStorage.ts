import { ref, watch } from "vue";

export enum StorageKey {
  ONBOADING1 = "json-pizza-onboarding1",
  THEME = "json-pizza-theme",
  FORMAT = "json-pizza-format",
}

export function useLocalStorage(key: string, defaultValue: any) {
  const data = ref(defaultValue);

  const set = (key: string, data: any) => {
    if (typeof data !== "string") {
      data = JSON.stringify(data);
    }
    localStorage.setItem(key, data);
  };

  try {
    const rawValue = localStorage.getItem(key);
    if (!rawValue) {
      set(key, defaultValue);
    } else {
      data.value = rawValue;
    }
  } catch (err) {
    console.warn(err);
  }

  watch(
    data,
    () => {
      if (!data.value) {
        localStorage.removeItem(key);
      } else {
        set(key, data.value);
      }
    },
    { deep: true }
  );

  return data;
}
