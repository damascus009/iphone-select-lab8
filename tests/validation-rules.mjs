import { validators } from '../assets/js/validation-rules.mjs';
import {writeFileSync} from 'node:fs';
const cases = [
 ['username','',false],['username','А',false],['username','  ',false],['username','Іван',true],['username',' Anna ',true],['username','😀',false],['username','12',true],['username','І'.repeat(81),false],
 ['email','test@example.com',true],['email',' user+tag@example.co.uk ',true],['email','wrong-email',false],['email','a@@b.com',false],['email','a@b..com',false],['email','a b@c.com',false],['email','a@b',false],
 ['phone','+380501234567',true],['phone','+380671112233',true],['phone','0501234567',false],['phone','+38050123456',false],['phone','+3805012345678',false],['phone','+380abc123456',false],['phone','+380 50 123 45 67',false],['phone','+380(50)1234567',false],['phone','+380',false],['phone',' +380501234567',false],['phone','+380501234567\n',false],
 ['message','123456789',false],['message','1234567890',true],['message','          ',false],['message','Тестове повідомлення',true],['message','<script>alert(1)</script>',true],['message','😀'.repeat(10),true],['message','x'.repeat(2000),true],['message','x'.repeat(2001),false],['agreement',false,false],['agreement',true,true]
];
const result=cases.map(([field,input,expected])=>{const error=validators[field](input);const actual=error==='';return {field,input:typeof input==='string' && input.length>100 ? `${input.slice(0,12)}… (${input.length} символів)` : input,expected,actual,error,status:expected===actual?'PASS':'FAIL'};});
console.log(JSON.stringify({total:result.length,passed:result.filter(x=>x.status==='PASS').length,failed:result.filter(x=>x.status==='FAIL')},null,2));
if(process.argv[2])writeFileSync(process.argv[2],JSON.stringify(result,null,2));
if(result.some(x=>x.status==='FAIL'))process.exitCode=1;
