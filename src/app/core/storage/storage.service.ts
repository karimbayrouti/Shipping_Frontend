import { Injectable } from '@angular/core';

/** Single namespace prefix for every key the platform writes. */
const PREFIX = 'ntx.';

/**
 * The ONLY code in the platform allowed to touch browser storage (Charter
 * AD-26). Namespaced, JSON-typed, and failure-tolerant: storage being
 * unavailable (private mode, quota) degrades to in-session defaults instead
 * of throwing.
 */
@Injectable({ providedIn: 'root' })
export class StorageService {
  get<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw === null ? null : (JSON.parse(raw) as T);
    } catch {
      return null;
    }
  }

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch {
      // Storage unavailable — the value simply won't persist across reloads.
    }
  }

  remove(key: string): void {
    try {
      localStorage.removeItem(PREFIX + key);
    } catch {
      // Nothing to clean up if storage is unavailable.
    }
  }
}
