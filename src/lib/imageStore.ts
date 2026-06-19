// IndexedDB-backed image storage — avoids localStorage size limits for photo data
const DB_NAME = 'ezz-images';
const STORE_NAME = 'images';
const DB_VERSION = 1;

let _db: IDBDatabase | null = null;

function getDb(): Promise<IDBDatabase> {
  if (_db) return Promise.resolve(_db);
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => { _db = req.result; resolve(_db!); };
    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
}

export function isIdbRef(url: string | undefined): url is string {
  return typeof url === 'string' && url.startsWith('idb:');
}

export async function saveImageToIdb(dataUrl: string): Promise<string> {
  const key = `img-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const db = await getDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(dataUrl, key);
    tx.oncomplete = () => resolve(`idb:${key}`);
    tx.onerror = () => reject(tx.error);
  });
}

export async function resolveImage(ref: string): Promise<string | undefined> {
  if (!isIdbRef(ref)) return ref || undefined;
  const db = await getDb();
  return new Promise((resolve) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const req = tx.objectStore(STORE_NAME).get(ref.slice(4));
    req.onsuccess = () => resolve(req.result as string | undefined);
    req.onerror = () => resolve(undefined);
  });
}
