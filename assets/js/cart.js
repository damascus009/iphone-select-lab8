import {PRODUCTS,cleanCart,changeQuantity,receipt} from './cart-state.mjs';
const key='iphone-select-cart-v1',list=document.querySelector('#cart-lines'),status=document.querySelector('#cart-status'),checkout=document.querySelector('#cart-checkout'),result=document.querySelector('#cart-receipt');
let cart={};
try{cart=cleanCart(JSON.parse(localStorage.getItem(key)));}catch{}
function render(){
 list.replaceChildren();let total=0;
 for(const [id,quantity]of Object.entries(cart)){
  total+=quantity;const row=document.createElement('li'),name=document.createElement('span');name.textContent=`${PRODUCTS[id]} — ${quantity} шт.`;row.append(name);
  for(const [label,next]of [['−',quantity-1],['+',quantity+1],['Видалити',0]]){
   const button=document.createElement('button');button.type='button';button.textContent=label;button.setAttribute('aria-label',`${label==='−'?'Зменшити кількість':label==='+'?'Збільшити кількість':'Видалити'} ${PRODUCTS[id]}`);button.disabled=label==='+'&&quantity===9;
   button.addEventListener('click',()=>update(id,next));row.append(button);
  }list.append(row);
 }
 document.querySelectorAll('#cart-count,[data-cart-count]').forEach(el=>el.textContent=String(total));checkout.disabled=!total;
 if(!total){const empty=document.createElement('li');empty.textContent='Кошик порожній. Оберіть модель у каталозі.';list.append(empty);}
}
function update(id,quantity){
 cart=changeQuantity(cart,id,quantity);result.hidden=true;render();
 try{localStorage.setItem(key,JSON.stringify(cart));status.textContent='Кошик збережено в цьому браузері.';}catch{status.textContent='Кошик доступний до закриття сторінки: сховище браузера недоступне.';}
}
document.querySelectorAll('[data-add-cart]').forEach(button=>button.addEventListener('click',()=>{const id=button.closest('[data-product-id]').dataset.productId;update(id,(cart[id]||0)+1);status.textContent=(cart[id]===9?'Досягнуто ліміт 9 шт.: ':'Додано: ')+PRODUCTS[id];}));
checkout.addEventListener('click',()=>{result.textContent=receipt(cart);result.hidden=false;result.focus();});
window.addEventListener('storage',event=>{if(event.key!==key)return;try{cart=cleanCart(JSON.parse(event.newValue));}catch{cart={};}result.hidden=true;render();});
render();
