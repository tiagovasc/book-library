import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHmac,createHash,timingSafeEqual} from 'node:crypto';
import zlib from 'node:zlib';
import {promisify} from 'node:util';

const brotli=promisify(zlib.brotliCompress), gzip=promisify(zlib.gzip);
const root=path.dirname(fileURLToPath(import.meta.url));
const base=process.env.SUPABASE_URL, key=process.env.SUPABASE_SECRET_KEY;
const port=Number(process.env.PORT||8732);
const table='book_library_state';
const attempts=new Map();
const digest=value=>createHash('sha256').update(value).digest();
const sign=value=>createHmac('sha256',process.env.SESSION_SECRET||'unconfigured').update(value).digest('hex');

// ---------- headers shared by every response ----------
const SECURITY={
  'X-Content-Type-Options':'nosniff',
  'X-Frame-Options':'DENY',
  'Referrer-Policy':'strict-origin-when-cross-origin',
  'Permissions-Policy':'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  'Cross-Origin-Opener-Policy':'same-origin'
};
// The page is a single file with inline script and style, so 'unsafe-inline' is required; everything else stays on this origin.
const CSP="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; font-src 'self'; object-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'";

function authenticated(req){
  if(!process.env.LIBRARY_PASSWORD||!process.env.SESSION_SECRET)return false;
  const cookie=(req.headers.cookie||'').split(';').map(x=>x.trim()).find(x=>x.startsWith('library_session='));
  if(!cookie)return false;
  const [expiry,signature]=cookie.slice(16).split('.');
  return Number(expiry)>Date.now()&&typeof signature==='string'&&signature.length===64&&timingSafeEqual(Buffer.from(signature),Buffer.from(sign(expiry)));
}

const escapeHtml=value=>String(value).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function loginPage(message=''){
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light dark"><meta name="robots" content="noindex"><title>Admin login · Tiago’s Library</title><link rel="icon" href="/favicon.svg" type="image/svg+xml"><style>
:root{color-scheme:light dark;--bg:#EDEDEA;--field:#FFFFFF;--ink:#1C1C1E;--muted:#5A5A5F;--line:rgba(28,28,30,.18);--btn:#1C1C1E;--btn-ink:#FFFFFF;--err:#B4343A}
@media (prefers-color-scheme:dark){:root{--bg:#000;--field:#1C1C1E;--ink:#F5F5F7;--muted:#A1A1A6;--line:rgba(255,255,255,.17);--btn:#F5F5F7;--btn-ink:#111;--err:#F0A49F}}
body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.45 system-ui,-apple-system,"Segoe UI",sans-serif;display:grid;place-items:center;min-height:100vh;min-height:100dvh}
form{width:min(340px,calc(100vw - 32px))}h1{font-size:24px;margin:0 0 4px}p{color:var(--muted);margin:0 0 14px}
input,button{box-sizing:border-box;width:100%;min-height:48px;padding:12px 14px;border:1px solid var(--line);border-radius:12px;background:var(--field);color:var(--ink);font:inherit;margin:6px 0}
input:focus-visible,button:focus-visible,a:focus-visible{outline:2px solid var(--ink);outline-offset:2px}
button{background:var(--btn);color:var(--btn-ink);border-color:transparent;cursor:pointer;font-weight:600}button:active{opacity:.85}
.err{color:var(--err);font-weight:600;margin:0 0 10px}a{color:var(--muted);display:inline-block;margin-top:14px;padding:6px 0}
</style></head><body><form method="post" action="/login"><h1>Tiago’s Library</h1><p>Enter the admin password to edit.</p>${message?`<p class="err" role="alert">${escapeHtml(message)}</p>`:''}<input type="password" name="password" autocomplete="current-password" autofocus required aria-label="Library password"><button>Sign in</button><a href="/">Back to the library</a></form></body></html>`;
}

// ---------- storage ----------
async function db(method,query,body){
  const res=await fetch(`${base}/rest/v1/${table}${query}`,{method,signal:AbortSignal.timeout(10000),headers:{apikey:key,Authorization:`Bearer ${key}`,'Content-Type':'application/json',Prefer:'return=representation'},body:body===undefined?undefined:JSON.stringify(body)});
  if(!res.ok)throw new Error(`Storage response ${res.status}`);
  return res.json();
}
function send(res,status,data,headers={}){res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store',...SECURITY,...headers});res.end(JSON.stringify(data));}
export function validBooks(books){
  return Array.isArray(books)&&books.length<=10000&&new Set(books.map(b=>b?.id)).size===books.length&&books.every(b=>b&&typeof b.id==='string'&&typeof b.title==='string'&&Number.isInteger(b.rating)&&b.rating>=0&&b.rating<=5);
}
// A save must never silently wipe or gut the library (for example after an accidental import of the wrong file).
export function plausibleSave(previousCount,nextCount){
  if(nextCount===0)return false;
  if(typeof previousCount==='number'&&previousCount>=20&&nextCount<previousCount*0.5)return false;
  return true;
}

// ---------- compression and conditional responses ----------
async function compressed(buf,level){
  return {raw:buf,br:await brotli(buf,{params:{[zlib.constants.BROTLI_PARAM_QUALITY]:level,[zlib.constants.BROTLI_PARAM_SIZE_HINT]:buf.length}}),gz:await gzip(buf,{level:9})};
}
function pickEncoding(req,variant){
  const accept=String(req.headers['accept-encoding']||'');
  if(/\bbr\b/.test(accept)&&variant.br)return ['br',variant.br];
  if(/\bgzip\b/.test(accept)&&variant.gz)return ['gzip',variant.gz];
  return [null,variant.raw];
}
function matches(req,etag){
  const header=req.headers['if-none-match'];
  return !!header&&header.split(',').some(tag=>{tag=tag.trim();return tag===etag||tag==='W/'+etag||tag==='*';});
}
function sendVariant(req,res,variant,{type,etag,cache,extra={}}){
  const headers={'Content-Type':type,'Cache-Control':cache,ETag:etag,Vary:'Accept-Encoding',...SECURITY,...extra};
  if(matches(req,etag)){res.writeHead(304,headers);return res.end();}
  const [encoding,body]=pickEncoding(req,variant);
  if(encoding)headers['Content-Encoding']=encoding;
  headers['Content-Length']=body.length;
  res.writeHead(200,headers);res.end(req.method==='HEAD'?undefined:body);
}

// ---------- page: the hosted page loads its books from /books.json, so the embedded offline copy is not sent ----------
let page=null;
async function pageVariants(){
  const file=path.join(root,'index.html'), st=await stat(file), stamp=`${st.mtimeMs}:${st.size}`;
  if(page&&page.stamp===stamp)return page;
  let html=(await readFile(file)).toString();
  const at=html.indexOf('var SEED = ');
  if(at>0){const end=html.indexOf('\n',at);html=html.slice(0,at)+'var SEED = [];'+(end<0?'':html.slice(end));}
  const build=async editable=>{
    const text=html.replace('<head>',`<head><script>window.CLOUD_LIBRARY=true;window.CLOUD_CAN_EDIT=${editable};if(!window.CLOUD_CAN_EDIT)document.documentElement.classList.add('public-library');</script>`);
    const buf=Buffer.from(text);
    return {...await compressed(buf,9),etag:`"${createHash('sha1').update(buf).digest('hex').slice(0,20)}"`};
  };
  page={stamp,public:await build(false),admin:await build(true)};
  return page;
}

// ---------- library snapshot cache, keyed by the stored revision ----------
let snapshot=null; // {revision,count,variant|null}
async function librarySnapshot(){
  const [meta]=await db('GET','?id=eq.library&select=revision');
  if(!meta)return null;
  if(snapshot&&snapshot.revision===meta.revision&&snapshot.variant)return snapshot;
  const [row]=await db('GET','?id=eq.library&select=books,revision');
  if(!row)return null;
  const buf=Buffer.from(JSON.stringify(row.books));
  snapshot={revision:row.revision,count:row.books.length,variant:await compressed(buf,6)};
  return snapshot;
}
export function resetCaches(){page=null;snapshot=null;attempts.clear();}

const STATIC_TYPES={'.svg':'image/svg+xml','.ico':'image/x-icon','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.jpeg':'image/jpeg'};
const TBR_FILES={'tbr.js':'text/javascript; charset=utf-8','tbr.css':'text/css; charset=utf-8','tbr-bookshops.json':'application/json; charset=utf-8'};
const tbrVariants=new Map();
const ROOT_FILES=['favicon.svg','favicon.ico','apple-touch-icon.png'];
const COVER=/^covers\/(?:web\/)?[a-zA-Z0-9_.-]+\.(jpg|png|webp|jpeg)$/;

export const server=http.createServer(async(req,res)=>{
  try{
    const url=new URL(req.url,'http://localhost');
    const wantsHtml=String(req.headers.accept||'').includes('text/html');
    const htmlReply=(status,message)=>{res.writeHead(status,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','Content-Security-Policy':CSP,...SECURITY});res.end(loginPage(message));};
    if(url.pathname==='/login'&&req.method==='POST'){
      if(req.headers.origin&&new URL(req.headers.origin).host!==req.headers.host)return send(res,403,{error:'Origin rejected'});
      const ip=req.socket.remoteAddress;const recent=attempts.get(ip)||{count:0,until:Date.now()+60000};if(recent.until<Date.now()){recent.count=0;recent.until=Date.now()+60000;}
      if(recent.count>=10){res.setHeader('Retry-After','60');return wantsHtml?htmlReply(429,'Too many attempts. Wait a minute and try again.'):send(res,429,{error:'Wait a minute before trying again'},{'Retry-After':'60'});}
      let raw='';for await(const chunk of req){raw+=chunk;if(raw.length>2048)return send(res,413,{error:'Request too large'});}
      const password=new URLSearchParams(raw).get('password')||'';
      if(!process.env.LIBRARY_PASSWORD||!process.env.SESSION_SECRET||!timingSafeEqual(digest(password),digest(process.env.LIBRARY_PASSWORD))){
        // Only failures count toward the limit, so a shared proxy address cannot lock the owner out by successful visits.
        recent.count++;if(attempts.size>2000)attempts.clear();attempts.set(ip,recent);
        return wantsHtml?htmlReply(401,'Incorrect password. Try again.'):send(res,401,{error:'Incorrect library password'});
      }
      attempts.delete(ip);
      const expiry=String(Date.now()+7*86400000);res.writeHead(303,{Location:'/', 'Set-Cookie':`library_session=${expiry}.${sign(expiry)}; HttpOnly; SameSite=Strict; Path=/; Max-Age=604800${process.env.NODE_ENV==='production'?'; Secure':''}`,'Cache-Control':'no-store',...SECURITY});return res.end();
    }
    if(url.pathname==='/login'&&req.method==='GET'){return htmlReply(200,'');}
    if(url.pathname==='/logout'){res.writeHead(303,{Location:'/', 'Set-Cookie':'library_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0','Cache-Control':'no-store',...SECURITY});return res.end();}
    if(url.pathname==='/save'&&!authenticated(req))return send(res,401,{error:'Enter the library password to enable edits'});
    if(url.pathname==='/health'){if(!base||!key)return send(res,503,{ok:false});const rows=await db('GET','?id=eq.library&select=revision');return send(res,rows.length?200:503,{ok:!!rows.length});}
    if(url.pathname==='/books.json'&&req.method==='GET'){
      const snap=await librarySnapshot();if(!snap)return send(res,503,{error:'Library is not initialized'});
      return sendVariant(req,res,snap.variant,{type:'application/json',etag:`"r${snap.revision}"`,cache:'no-cache',extra:{'X-Library-Revision':String(snap.revision)}});
    }
    if(url.pathname==='/save'&&req.method==='POST'){
      if(req.headers.origin&&new URL(req.headers.origin).host!==req.headers.host)return send(res,403,{error:'Origin rejected'});
      let body='',size=0;for await(const chunk of req){size+=chunk.length;if(size>12*1024*1024)return send(res,413,{error:'Library too large'});body+=chunk;}
      let books;try{books=JSON.parse(body);}catch{return send(res,400,{error:'Invalid JSON'});}
      if(!validBooks(books))return send(res,400,{error:'Invalid library or rating'});
      const revision=Number(req.headers['x-library-revision']);if(!Number.isSafeInteger(revision)||revision<1)return send(res,409,{error:'Reload the library before saving'});
      let previous=snapshot&&snapshot.revision===revision?snapshot.count:null;
      if(previous===null){const [current]=await db('GET',`?id=eq.library&revision=eq.${revision}&select=books`);if(!current)return send(res,409,{error:'Another session changed the library. Export your changes, then reload.'});previous=current.books.length;}
      if(!plausibleSave(previous,books.length))return send(res,400,{error:'Refusing to save: this would remove most of the library. Reload the page and check the change.'});
      const rows=await db('PATCH',`?id=eq.library&revision=eq.${revision}`,{books,revision:revision+1,updated_at:new Date().toISOString()});
      if(!rows.length)return send(res,409,{error:'Another session changed the library. Export your changes, then reload.'});
      snapshot={revision:revision+1,count:books.length,variant:null};
      return send(res,200,{ok:true},{'X-Library-Revision':String(revision+1)});
    }
    if(!['GET','HEAD'].includes(req.method))return send(res,405,{error:'Method not allowed'});
    const filename=url.pathname==='/'?'index.html':url.pathname.slice(1);
    if(filename==='index.html'){
      const pages=await pageVariants();
      return sendVariant(req,res,authenticated(req)?pages.admin:pages.public,{type:'text/html; charset=utf-8',etag:(authenticated(req)?pages.admin:pages.public).etag,cache:'no-cache',extra:{'Content-Security-Policy':CSP}});
    }
    if(Object.hasOwn(TBR_FILES,filename)){
      const file=path.join(root,filename),st=await stat(file).catch(()=>null);
      if(!st||!st.isFile())return send(res,404,{error:'Not found'});
      const etag=`W/"${st.size.toString(16)}-${Math.floor(st.mtimeMs).toString(16)}"`;
      let cached=tbrVariants.get(filename);
      if(!cached||cached.etag!==etag){cached={etag,variant:await compressed(await readFile(file),5)};tbrVariants.set(filename,cached);}
      return sendVariant(req,res,cached.variant,{type:TBR_FILES[filename],etag,cache:'no-cache'});
    }
    if(!(ROOT_FILES.includes(filename)||COVER.test(filename)))return send(res,404,{error:'Not found'});
    const file=path.join(root,filename), st=await stat(file).catch(()=>null);
    if(!st||!st.isFile())return send(res,404,{error:'Not found'});
    const etag=`W/"${st.size.toString(16)}-${Math.floor(st.mtimeMs).toString(16)}"`;
    const headers={'Content-Type':STATIC_TYPES[path.extname(filename).toLowerCase()]||'application/octet-stream','Cache-Control':'public, max-age=86400, stale-while-revalidate=604800',ETag:etag,'Last-Modified':st.mtime.toUTCString(),...SECURITY};
    if(matches(req,etag)){res.writeHead(304,headers);return res.end();}
    headers['Content-Length']=st.size;res.writeHead(200,headers);
    return res.end(req.method==='HEAD'?undefined:await readFile(file));
  }catch(error){console.error('Request failed:',error.message);if(!res.headersSent)send(res,503,{error:'Library storage unavailable. Your changes remain in this browser.'});else res.end();}
});
// Reverse proxies reuse connections for longer than Node's 5 second default, which otherwise causes sporadic 502s.
server.keepAliveTimeout=65000;server.headersTimeout=66000;
if(process.argv[1]===fileURLToPath(import.meta.url)){
  server.listen(port,'0.0.0.0',()=>console.log(`Library listening on ${port}`));
  // A deploy sends SIGTERM: stop accepting connections, let in-flight saves finish, then exit.
  for(const signal of ['SIGTERM','SIGINT'])process.on(signal,()=>{console.log(`${signal} received, shutting down`);server.close(()=>process.exit(0));server.closeIdleConnections?.();setTimeout(()=>process.exit(0),10000).unref();});
}
