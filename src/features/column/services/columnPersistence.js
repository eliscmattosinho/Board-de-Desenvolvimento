const COLUMNS_STORAGE_KEY = "app_columns_data";

export function saveColumnsToStorage(columns) {
  sessionStorage.setItem(COLUMNS_STORAGE_KEY, JSON.stringify(columns));
}

export function loadColumnsFromStorage() {
  const raw = sessionStorage.getItem(COLUMNS_STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
}
