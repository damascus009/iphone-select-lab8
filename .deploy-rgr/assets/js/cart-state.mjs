export const PRODUCTS = Object.freeze({'iphone-18-pro':'iPhone 18 Pro','iphone-18-pro-max':'iPhone 18 Pro Max'});
export function cleanCart(value) {
 const result={};
 if(!value || typeof value!=='object' || Array.isArray(value))return result;
 for(const id of Object.keys(PRODUCTS))if(Number.isInteger(value[id])&&value[id]>0)result[id]=Math.min(9,value[id]);
 return result;
}
export function changeQuantity(cart,id,quantity){
 const next=cleanCart(cart);
 if(!Object.hasOwn(PRODUCTS,id)||!Number.isInteger(quantity))return next;
 if(quantity<=0)delete next[id];else next[id]=Math.min(9,quantity);
 return next;
}
export function receipt(cart){
 const items=Object.entries(cleanCart(cart)).map(([id,quantity])=>`${PRODUCTS[id]} × ${quantity}`);
 return items.length?`Навчальне замовлення\n${items.join('\n')}\nЦіна не підтверджена. Оплата та доставка не виконуються. Замовлення нікуди не надсилається.`:'';
}
