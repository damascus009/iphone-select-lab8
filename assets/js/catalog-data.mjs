export function validateCatalog(data) {
  if (data?.version !== 2 || !Array.isArray(data.products) || data.products.length < 10 || data.products.length > 100) throw new Error('Invalid catalog');
  const ids = new Set();
  for (const p of data.products) {
    if (!/^iphone-[a-z0-9-]+$/.test(p.id) || ids.has(p.id) || typeof p.name !== 'string' || p.name.length > 80 || !Array.isArray(p.features) || p.features.length !== 3 || p.features.some(x => typeof x !== 'string' || x.length > 150) || !Array.isArray(p.storage) || !p.storage.length || p.storage.some(x => ![128,256,512,1024].includes(x)) || !Array.isArray(p.colors) || !p.colors.length || p.colors.some(x => typeof x !== 'string' || x.length > 40) || !Number.isFinite(p.tradeBase) || p.tradeBase <= 0 || p.tradeBase > 100000 || !/^https:\/\/support\.apple\.com\/en-us\/\d+$/.test(p.source)) throw new Error('Invalid product');
    ids.add(p.id);
  }
  return data.products;
}
export async function loadCatalog(fetcher = fetch) {
  const response = await fetcher('data.json', { signal: AbortSignal.timeout(6000) });
  if (!response.ok) throw new Error('Catalog unavailable');
  return validateCatalog(await response.json());
}
