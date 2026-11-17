const {createServerClient,parseCookieHeader,serializeCookieHeader}=require('@supabase/ssr');
const ORIGIN='https://iphone-select-rgr.vercel.app';
function prepare(req,res) {
 res.setHeader('Cache-Control','private, no-store');res.setHeader('X-Content-Type-Options','nosniff');
 if (!['GET','POST'].includes(req.method)) {res.setHeader('Allow','GET, POST');res.status(405).json({error:'Метод не підтримується.'});return false;}
 if(req.method==='POST') {
  const allowed=[ORIGIN];if(process.env.VERCEL_ENV!=='production')allowed.push('http://localhost:3000','http://127.0.0.1:3000');
  if(!allowed.includes(req.headers.origin)||!String(req.headers['content-type']).startsWith('application/json')) {res.status(403).json({error:'Запит відхилено.'});return false;}
  if(JSON.stringify(req.body||{}).length>12000){res.status(413).json({error:'Завеликий запит.'});return false;}
 }
 return true;
}
function client(req,res) {
 return createServerClient(process.env.SUPABASE_URL,process.env.SUPABASE_PUBLISHABLE_KEY||process.env.SUPABASE_ANON_KEY,{
  cookieOptions:{httpOnly:true,secure:!!process.env.VERCEL_ENV && process.env.VERCEL_ENV!=='development',sameSite:'lax',path:'/'},
  cookies:{getAll:()=>parseCookieHeader(req.headers.cookie||''),setAll(cookies,headers){
   res.setHeader('Set-Cookie',[...(res.getHeader('Set-Cookie')||[]),...cookies.map(({name,value,options})=>serializeCookieHeader(name,value,options))]);
   for(const [key,value]of Object.entries(headers||{}))res.setHeader(key,value);
  }}
 });
}
module.exports={prepare,client,ORIGIN};
