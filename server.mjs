import http from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHmac,createHash,timingSafeEqual} from 'node:crypto';

const root=path.dirname(fileURLToPath(import.meta.url));
const base=process.env.SUPABASE_URL, key=process.env.SUPABASE_SECRET_KEY;
const port=Number(process.env.PORT||8732);
const table='book_library_state';
const attempts=new Map();
const digest=value=>createHash('sha256').update(value).digest();
const sign=value=>createHmac('sha256',process.env.SESSION_SECRET||'unconfigured').update(value).digest('hex');
function authenticated(req){
  if(!process.env.LIBRARY_PASSWORD||!process.env.SESSION_SECRET)return false;
  const cookie=(req.headers.cookie||'').split(';').map(x=>x.trim()).find(x=>x.startsWith('library_session='));
  if(!cookie)return false;
  const [expiry,signature]=cookie.slice(16).split('.');
  return Number(expiry)>Date.now()&&typeof signature==='string'&&signature.length===64&&timingSafeEqual(Buffer.from(signature),Buffer.from(sign(expiry)));
}
const loginPage='<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Tiago’s Library</title><style>body{background:#000;color:#eee;font:16px system-ui;display:grid;place-items:center;min-height:90vh}form{width:min(320px,85vw)}h1{font-size:24px}p{color:#999}input,button{box-sizing:border-box;width:100%;padding:14px;border:1px solid #333;border-radius:12px;background:#191919;color:#eee;font:inherit;margin:8px 0}button{background:#ddd;color:#111;cursor:pointer}</style><form method="post" action="/login"><h1>Tiago’s Library</h1><p>Enter your library password.</p><input type="password" name="password" autocomplete="current-password" required aria-label="Library password"><button>Open library</button></form>';
async function db(method,query,body){
  const res=await fetch(`${base}/rest/v1/${table}${query}`,{method,headers:{apikey:key,Authorization:`Bearer ${key}`,'Content-Type':'application/json',Prefer:'return=representation'},body:body===undefined?undefined:JSON.stringify(body)});
  if(!res.ok)throw new Error(`Storage response ${res.status}`);
  return res.json();
}
function send(res,status,data,headers={}){res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store',...headers});res.end(JSON.stringify(data));}
export function validBooks(books){
  return Array.isArray(books)&&books.length<=10000&&new Set(books.map(b=>b?.id)).size===books.length&&books.every(b=>b&&typeof b.id==='string'&&typeof b.title==='string'&&Number.isInteger(b.rating)&&b.rating>=0&&b.rating<=5);
}
export const server=http.createServer(async(req,res)=>{
  try{
    const url=new URL(req.url,'http://localhost');
    if(url.pathname==='/login'&&req.method==='POST'){
      if(req.headers.origin&&new URL(req.headers.origin).host!==req.headers.host)return send(res,403,{error:'Origin rejected'});
      const ip=req.socket.remoteAddress;const recent=attempts.get(ip)||{count:0,until:Date.now()+60000};if(recent.until<Date.now()){recent.count=0;recent.until=Date.now()+60000;}recent.count++;if(attempts.size>2000)attempts.clear();attempts.set(ip,recent);
      if(recent.count>10)return send(res,429,{error:'Wait a minute before trying again'});
      let raw='';for await(const chunk of req){raw+=chunk;if(raw.length>2048)return send(res,413,{error:'Request too large'});}
      const password=new URLSearchParams(raw).get('password')||'';
      if(!process.env.LIBRARY_PASSWORD||!process.env.SESSION_SECRET||!timingSafeEqual(digest(password),digest(process.env.LIBRARY_PASSWORD)))return send(res,401,{error:'Incorrect library password'});
      const expiry=String(Date.now()+7*86400000);res.writeHead(303,{Location:'/', 'Set-Cookie':`library_session=${expiry}.${sign(expiry)}; HttpOnly; SameSite=Strict; Path=/; Max-Age=604800${process.env.NODE_ENV==='production'?'; Secure':''}`,'Cache-Control':'no-store'});return res.end();
    }
    if(url.pathname==='/login'&&req.method==='GET'){res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'});return res.end(loginPage);}
    if(url.pathname==='/logout'){res.writeHead(303,{Location:'/', 'Set-Cookie':'library_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0','Cache-Control':'no-store'});return res.end();}
    if(url.pathname==='/save'&&!authenticated(req))return send(res,401,{error:'Enter the library password to enable edits'});
    if(url.pathname==='/health'){if(!base||!key)return send(res,503,{ok:false});const rows=await db('GET','?id=eq.library&select=revision');return send(res,rows.length?200:503,{ok:!!rows.length});}
    if(url.pathname==='/books.json'&&req.method==='GET'){
      const [row]=await db('GET','?id=eq.library&select=books,revision');if(!row)return send(res,503,{error:'Library is not initialized'});
      return send(res,200,row.books,{'X-Library-Revision':String(row.revision)});
    }
    if(url.pathname==='/save'&&req.method==='POST'){
      if(req.headers.origin&&new URL(req.headers.origin).host!==req.headers.host)return send(res,403,{error:'Origin rejected'});
      let body='',size=0;for await(const chunk of req){size+=chunk.length;if(size>12*1024*1024)return send(res,413,{error:'Library too large'});body+=chunk;}
      let books;try{books=JSON.parse(body);}catch{return send(res,400,{error:'Invalid JSON'});}
      if(!validBooks(books))return send(res,400,{error:'Invalid library or rating'});
      const revision=Number(req.headers['x-library-revision']);if(!Number.isSafeInteger(revision)||revision<1)return send(res,409,{error:'Reload the library before saving'});
      const rows=await db('PATCH',`?id=eq.library&revision=eq.${revision}`,{books,revision:revision+1,updated_at:new Date().toISOString()});
      if(!rows.length)return send(res,409,{error:'Another session changed the library. Export your changes, then reload.'});
      return send(res,200,{ok:true},{'X-Library-Revision':String(revision+1)});
    }
    if(!['GET','HEAD'].includes(req.method))return send(res,405,{error:'Method not allowed'});
    let filename=url.pathname==='/'?'index.html':url.pathname.slice(1);
    if(!(filename==='index.html'||/^covers\/[a-zA-Z0-9_.-]+\.(jpg|png|webp|jpeg)$/.test(filename)))return send(res,404,{error:'Not found'});
    let raw=await readFile(path.join(root,filename));
    if(filename==='index.html')raw=Buffer.from(raw.toString().replace('<head>',`<head><script>window.CLOUD_LIBRARY=true;window.CLOUD_CAN_EDIT=${authenticated(req)};</script>`));
    res.writeHead(200,{'Content-Type':filename.endsWith('.html')?'text/html; charset=utf-8':filename.endsWith('.png')?'image/png':filename.endsWith('.webp')?'image/webp':'image/jpeg','X-Content-Type-Options':'nosniff','Cache-Control':filename==='index.html'?'no-cache':'public, max-age=86400'});res.end(req.method==='HEAD'?undefined:raw);
  }catch(error){console.error('Request failed:',error.message);send(res,503,{error:'Library storage unavailable. Your changes remain in this browser.'});}
});
if(process.argv[1]===fileURLToPath(import.meta.url))server.listen(port,'0.0.0.0',()=>console.log(`Library listening on ${port}`));
