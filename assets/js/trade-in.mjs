import { catalog } from './catalog-snapshot.mjs';
// Educational formula, independent of the DOM. Monetary values are not offers.
export function estimateTradeIn(model, storage, condition) {
  const product = catalog.products.find(p => p.id === model);
  if (!product || typeof storage !== 'number' || !Number.isFinite(storage) || !product.storage.includes(storage) || !Object.hasOwn(catalog.tradeRules.condition, condition)) throw new RangeError('Оберіть модель, сумісну пам’ять і стан пристрою.');
  return Math.round(product.tradeBase * catalog.tradeRules.storage[storage] * catalog.tradeRules.condition[condition]);
}
