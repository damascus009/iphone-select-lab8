// Run with --env-file=.env.local; never print the connection string.
const {readFileSync}=require('node:fs');
const {Client}=require('pg');
(async()=>{const db=new Client({connectionString:process.env.POSTGRES_URL,connectionTimeoutMillis:15000});
try{await db.connect();await db.query(readFileSync('supabase/001_contact_guard.sql','utf8'));console.log('Contact guard migration applied');}finally{await db.end();}})().catch(e=>{console.error('Migration failed:',e.code||e.name);process.exitCode=1;});
