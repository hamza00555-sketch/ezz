import { get, set } from 'idb-keyval';

export function isIdbRef(url: string | undefined): url is string {
  return !!url?.startsWith('idb:');
}

/** Save a data URL to IndexedDB and return the idb: reference string. */
export async function saveImageToIdb(dataUrl: string): Promise<string> {
  const key = `recipe-img:${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  await set(key, dataUrl);
  return `idb:${key}`;
}

/** Resolve an idb: reference → data URL. Non-idb URLs are returned as-is. */
export async function resolveImage(ref: string): Promise<string | undefined> {
  if (!isIdbRef(ref)) return ref;
  return get<string>(ref.slice(4));
}
