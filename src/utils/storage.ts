import { load, type Store } from '@tauri-apps/plugin-store';
import type { StateStorage } from 'zustand/middleware';

const STORE_FILE = 'app-data.json';
let storePromise: Promise<Store> | null = null;

const isTauri = typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;

async function getStore(): Promise<Store> {
  if (!storePromise) {
    storePromise = load(STORE_FILE, { autoSave: true });
  }
  return storePromise;
}

// Tauri環境ではプラグインストア、Web/PWA環境ではlocalStorageを使う
export const tauriStorage: StateStorage = {
  getItem: async (name: string) => {
    if (!isTauri) return localStorage.getItem(name);
    const store = await getStore();
    const value = await store.get<string>(name);
    return value ?? null;
  },
  setItem: async (name: string, value: string) => {
    if (!isTauri) {
      localStorage.setItem(name, value);
      return;
    }
    const store = await getStore();
    await store.set(name, value);
  },
  removeItem: async (name: string) => {
    if (!isTauri) {
      localStorage.removeItem(name);
      return;
    }
    const store = await getStore();
    await store.delete(name);
  },
};
