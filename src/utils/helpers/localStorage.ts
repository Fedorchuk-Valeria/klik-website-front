type StorageValue = string | number | boolean | object;

function setStorageItem(key: string, value: StorageValue): void {
  if (typeof window === "undefined") return;

  const serialized =
    typeof value === "string" ? value : JSON.stringify(value);

  window.localStorage.setItem(key, serialized);
}

export function getStorageItem<T = unknown>(key: string): T | null {
  if (typeof window === "undefined") return null;

  const value = localStorage.getItem(key);

  if (!value) return null;

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function removeStorageItem(key: string): void {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(key);
}

function clearStorage(): void {
  if (typeof window === "undefined") return;

  window.localStorage.clear();
}

export default {
  getStorageItem,
  setStorageItem,
  removeStorageItem,
  clearStorage,
};
