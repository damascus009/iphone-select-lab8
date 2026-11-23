import assert from 'node:assert/strict';
import {estimateTradeIn} from '../assets/js/trade-in.mjs';
import {catalog} from '../assets/js/catalog-snapshot.mjs';
const scenarios=[['iphone-16',128,'good',11000],['iphone-16',256,'used',9075],['iphone-16-pro-max',1024,'repair',9945],['iphone-14',512,'good',9000]];
for(const [model,storage,condition,expected] of scenarios)assert.equal(estimateTradeIn(model,storage,condition),expected);
for(const values of [['',128,'good'],['iphone-16-pro-max',128,'good'],['iphone-14',NaN,'good'],['iphone-14',Infinity,'good'],['iphone-14',-128,'good'],['iphone-14',128,''],['iphone-14',128,'__proto__'],['iphone-14','128','good']])assert.throws(()=>estimateTradeIn(...values));
for(let i=0;i<50;i++)assert.equal(estimateTradeIn('iphone-16',256,'used'),9075);
for(const p of catalog.products)for(const storage of p.storage)for(const condition of ['good','used','repair'])assert.ok(Number.isSafeInteger(estimateTradeIn(p.id,storage,condition)));
console.log('PASS Trade-in: examples, invalid/incompatible inputs, all supported variants and 50 repeated calls');
