export function validateCatalog(data) {
  if (data?.version !== 1 || !Array.isArray(data.products) || data.products.length !== 2) throw new Error('Invalid catalog');
  const ids = new Set();
  for (const item of data.products) {
    if (!['iphone-18-pro', 'iphone-18-pro-max'].includes(item.id) || ids.has(item.id) || typeof item.name !== 'string' || item.name.length > 80 || !Array.isArray(item.features) || item.features.length !== 3 || item.features.some(x => typeof x !== 'string' || x.length > 150)) throw new Error('Invalid product');
    ids.add(item.id);
  }
  return data.products;
}
export async function loadCatalog(fetcher = fetch) {
  const response = await fetcher('data.json', { signal: AbortSignal.timeout(6000) });
  if (!response.ok) throw new Error('Catalog unavailable');
  return validateCatalog(await response.json());
}
