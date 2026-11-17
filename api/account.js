const {prepare,client,ORIGIN}=require('../lib/http.cjs');
module.exports=async function(req,res){
 if(!prepare(req,res))return;
 try {
  const auth=client(req,res).auth;
  if(req.method==='GET'){
   if(typeof req.query.code==='string'){
    const {error}=await auth.exchangeCodeForSession(req.query.code);
    res.setHeader('Location',ORIGIN+'/contacts.html'+(error?'?account=confirmation-error':'')+'#account');return res.status(303).end();
   }
   const {data,error}=await auth.getUser();return res.status(200).json({user:!error&&data.user?{email:data.user.email}:null});
  }
  const {action,email,password}=req.body||{};
  if(action==='logout') {const {error}=await auth.signOut();if(error)throw error;return res.json({user:null});}
  if(!['login','signup'].includes(action)||typeof email!=='string'||email.length>254||! /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||typeof password!=='string'||password.length<12||password.length>128)return res.status(400).json({error:'Вкажіть email і пароль від 12 до 128 символів.'});
  const result=action==='signup'?await auth.signUp({email,password,options:{emailRedirectTo:ORIGIN+'/api/account'}}):await auth.signInWithPassword({email,password});
  if(result.error)return res.status(result.error.status===429?429:400).json({error:result.error.status===429?'Забагато спроб. Спробуйте пізніше.':'Не вдалося виконати дію. Перевірте дані та підтвердження email.'});
  res.json({user:result.data.session?{email:result.data.user.email}:null,message:action==='signup'?'Якщо реєстрація доступна, перевірте пошту для підтвердження. Після підтвердження увійдіть.':'Вхід виконано.'});
 } catch {res.status(503).json({error:'Сервіс облікових записів тимчасово недоступний.'});}
};
