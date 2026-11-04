import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';

// Intended for the published checkout; the maintainer workspace has separate records.
test('published checkout contains only application files and public developer documentation',()=>{
 const files=execFileSync('git',['ls-files'],{encoding:'utf8'}).trim().split(/\r?\n/);
 const roots=new Set(['.gitignore','.env.example','README.md','CONTRIBUTING.md','CHANGELOG.md','index.html','server.mjs','tbr.js','tbr.css','tbr-bookshops.json','package.json','Dockerfile','railway.json','supabase.sql','favicon.svg','favicon.ico','apple-touch-icon.png','test-server.mjs','test-server-prod.mjs','test-tbr.mjs','test-public-boundary.mjs']);
 for(const file of files)assert.ok(roots.has(file)||/^covers\/(?:web\/)?[\w.-]+\.(?:jpg|jpeg|png|webp|svg)$/.test(file),'Unexpected published file: '+file);
 const html=readFileSync('index.html','utf8');
 const seed=html.match(/^var SEED = (.*);$/m);
 assert.ok(seed,'Offline seed declaration exists');
 assert.deepEqual(JSON.parse(seed[1]),[],'Published source must not embed a personal-library export');
 for(const name of ['README.md','CONTRIBUTING.md','CHANGELOG.md','supabase.sql']){
  const text=readFileSync(name,'utf8');
  assert.doesNotMatch(text,/(?:C:[/\\]Users[/\\]|Claude Internal|LLM Project Hub|_build\/)/,'Internal workspace reference in '+name);
 }
});
