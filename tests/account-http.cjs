const assert=require('node:assert/strict');
const {prepare}=require('../lib/http.cjs');
function response(){return {headers:{},code:200,setHeader(k,v){this.headers[k]=v;},status(n){this.code=n;return this;},json(v){this.body=v;return this;}};}
for(const [req,code]of [
 [{method:'DELETE',headers:{}},405],
 [{method:'POST',headers:{origin:'https://evil.example','content-type':'application/json'},body:{}},403],
 [{method:'POST',headers:{origin:'https://iphone-select-rgr.vercel.app','content-type':'text/plain'},body:{}},403],
 [{method:'POST',headers:{origin:'https://iphone-select-rgr.vercel.app','content-type':'application/json'},body:{text:'x'.repeat(12001)}},413]
]){const res=response();assert.equal(prepare(req,res),false);assert.equal(res.code,code);assert.equal(res.headers['Cache-Control'],'private, no-store');}
const res=response();assert.equal(prepare({method:'GET',headers:{}},res),true);
console.log('Account HTTP guard tests passed: methods, origin, content type, body limit, no-store.');
