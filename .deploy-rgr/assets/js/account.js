const form=document.querySelector('#account-form'),status=document.querySelector('#account-status'),panel=document.querySelector('#account-session'),logout=document.querySelector('#account-logout');
async function request(body){
 const response=await fetch('/api/account',body?{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}:{cache:'no-store'});
 const data=await response.json();if(!response.ok)throw new Error(data.error||'Не вдалося виконати запит.');return data;
}
function render(data){form.hidden=!!data.user;panel.hidden=!data.user;document.querySelector('#account-email-current').textContent=data.user?.email||'';}
request().then(render).catch(()=>{status.textContent='Сервіс облікових записів недоступний. Спробуйте пізніше.';});
form.addEventListener('submit',async event=>{
 event.preventDefault();const buttons=[...form.querySelectorAll('button')];buttons.forEach(b=>b.disabled=true);status.textContent='Зачекайте…';
 try{const data=await request({action:event.submitter?.value||'login',email:form.elements.email.value.trim(),password:form.elements.password.value});render(data);status.textContent=data.message||'';form.elements.password.value='';}
 catch(error){status.textContent=error.message;}finally{buttons.forEach(b=>b.disabled=false);}
});
logout.addEventListener('click',async()=>{logout.disabled=true;try{render(await request({action:'logout'}));status.textContent='Ви вийшли з облікового запису.';}catch(error){status.textContent=error.message;}finally{logout.disabled=false;}});
