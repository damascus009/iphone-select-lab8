import { addToCart } from './cart.js';
import { catalog } from './catalog-snapshot.mjs';
import { loadCatalog } from './catalog-data.mjs';
import { estimateTradeIn } from './trade-in.mjs';
const $=selector=>document.querySelector(selector), products=catalog.products;
const fields=[$('#model-search'),$('#mobile-model-search')].filter(Boolean),filter=$('#model-filter');
const storageLabel=n=>n===1024?'1 ТБ':`${n} ГБ`;
function filterCards(){
 const query=(fields[0]?.value||'').trim().toLocaleLowerCase('uk');let count=0;
 for(const p of products){const visible=(!filter.value||p.id===filter.value)&&p.name.toLocaleLowerCase('uk').includes(query);
  document.querySelector(`[data-product-id="${p.id}"]`).hidden=!visible;
  document.querySelector(`[data-compare-model="${p.id}"]`).hidden=!visible;
  if(visible)count++;
 }
 $('#search-empty').classList.toggle('hidden',count!==0);
 $('#catalog-status').textContent=`Знайдено моделей: ${count} з ${products.length}.`;
}
fields.forEach(field=>field.addEventListener('input',()=>{fields.forEach(other=>other.value=field.value);filterCards();}));
filter.addEventListener('change',()=>{filterCards();if(filter.value){$('#config-model').value=filter.value;updateConfigModel();}});
$('#model-reset').addEventListener('click',()=>{filter.value='';fields.forEach(f=>f.value='');filterCards();filter.focus();});
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
 $('#catalog-status').textContent=`Каталог із data.json: ${fresh.length} моделей. Характеристики перевірено 22.11.2026.`;
}).catch(()=>{$('#catalog-status').textContent='Завантажено збережену версію каталогу. Оновлення з мережі недоступне.';});
