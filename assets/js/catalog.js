import { addToCart } from './cart.js';
import { catalog } from './catalog-snapshot.mjs';
import { loadCatalog } from './catalog-data.mjs';
import { estimateTradeIn } from './trade-in.mjs';
const $=selector=>document.querySelector(selector), products=catalog.products;
const search=$('#mobile-model-search');
const storageLabel=n=>n===1024?'1 ТБ':`${n} ГБ`;
function filterCards(){
 const query=search.value.trim().toLocaleLowerCase('uk');let count=0;
 const conceptVisible='iphone 18 pro'.includes(query);
 $('#iphone18-featured').hidden=!conceptVisible;
 for(const p of products){const visible=p.name.toLocaleLowerCase('uk').includes(query);
  document.querySelector(`[data-product-id="${p.id}"]`).hidden=!visible;
  document.querySelector(`[data-compare-model="${p.id}"]`).hidden=!visible;
  if(visible)count++;
 }
 $('#previous-models-heading').hidden=count===0;
 $('#search-empty').classList.toggle('hidden',count!==0||conceptVisible);
 $('#catalog-status').textContent=`Знайдено: ${conceptVisible?'концепт iPhone 18 Pro та ':''}${count} моделей попередніх поколінь.`;
 const selected=products.find(p=>p.name.toLocaleLowerCase('uk')===query);
 if(selected){$('#config-model').value=selected.id;updateConfigModel();}
}
search.addEventListener('input',filterCards);
search.addEventListener('change',filterCards);
$('#model-reset').addEventListener('click',()=>{search.value='';filterCards();search.focus();});
function options(select,values,label=String){select.replaceChildren(...values.map(value=>new Option(label(value),String(value))));select.disabled=!values.length;}
function updateSummary(){
 const p=products.find(p=>p.id===$('#config-model').value);
 $('#summary-model').textContent=p?.name||'Модель не обрано';$('#summary-color').textContent=$('#config-color').value||'—';
 $('#summary-storage').textContent=$('#config-storage').value?storageLabel(Number($('#config-storage').value)):'—';
 $('#config-add').disabled=!p;
}
function updateConfigModel(){
 const p=products.find(p=>p.id===$('#config-model').value);
 options($('#config-color'),p?.colors||[]);options($('#config-storage'),p?.storage||[],storageLabel);updateSummary();
}
$('#config-model').addEventListener('change',updateConfigModel);
$('#config-form').addEventListener('change',updateSummary);
$('#config-form').addEventListener('submit',e=>e.preventDefault());
$('#config-add').addEventListener('click',()=>addToCart($('#config-model').value));
document.querySelectorAll('[data-configure]').forEach(button=>button.addEventListener('click',()=>{
 $('#config-model').value=button.dataset.configure;updateConfigModel();$('#config-model').focus();$('#configurator').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
}));
const money=n=>new Intl.NumberFormat('uk-UA',{style:'currency',currency:'UAH',maximumFractionDigits:0}).format(n);
$('#trade-model').addEventListener('change',()=>{
 const p=products.find(p=>p.id===$('#trade-model').value);options($('#trade-storage'),p?.storage||[],storageLabel);
 $('#trade-base').textContent=p?`Умовна база ${p.name}: ${money(p.tradeBase)}.`:'Оберіть модель, щоб побачити умовну базу.';
 $('#trade-result').textContent='Параметри змінено. Натисніть «Розрахувати оцінку».';
});
$('#trade-form').addEventListener('change',()=>{$('#trade-result').textContent='Параметри змінено. Натисніть «Розрахувати оцінку».';});
$('#trade-form').addEventListener('submit',event=>{
 event.preventDefault();try{const value=estimateTradeIn($('#trade-model').value,Number($('#trade-storage').value),$('#trade-condition').value);
 $('#trade-result').textContent=`Умовна навчальна оцінка: ${money(value)}. Це не пропозиція викупу.`;
 }catch(error){$('#trade-result').textContent=error.message;}
});
updateConfigModel();filterCards();
// One JSON source with a generated offline copy; never silently mix catalog versions.
loadCatalog().then(fresh=>{
 if(JSON.stringify(fresh)!==JSON.stringify(products))throw new Error('Catalog version changed');
 $('#catalog-status').textContent=`Каталог попередніх поколінь: ${fresh.length} моделей. iPhone 18 Pro представлено окремим концептом.`;
}).catch(()=>{$('#catalog-status').textContent='Завантажено збережену версію каталогу. Оновлення з мережі недоступне.';});
