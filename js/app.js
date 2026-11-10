const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const esc=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const IC={file:'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6',folder:'M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z',folderplus:'M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z M12 11v6M9 14h6',play:'M5 3l14 9-14 9z',trash:'M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6',edit:'M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z',down:'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3',up:'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12',zipup:'M4 4h16v16H4z M12 8v8M9 11l3-3 3 3',term:'M4 17l6-6-6-6M12 19h8',eye:'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6',gear:'M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6',menu:'M3 12h18M3 6h18M3 18h18',x:'M18 6L6 18M6 6l12 12',refresh:'M23 4v6h-6M1 20v-6h6M3.5 9a9 9 0 0 1 15-3.4L23 10M1 14l4.5 4.4A9 9 0 0 0 20.5 15',full:'M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3',monitor:'M2 3h20v14H2z M8 21h8M12 17v4',tablet:'M5 2h14v20H5z M12 18h.01',phone:'M7 2h10v20H7z M12 18h.01'};
const ic=n=>`<svg viewBox="0 0 24 24"><path d="${IC[n]}"/></svg>`;
$$('i[data-i]').forEach(e=>e.outerHTML=ic(e.dataset.i));
const toast=(m)=>{const d=document.createElement('div');d.className='toast';d.textContent=m;$('#toasts').append(d);setTimeout(()=>d.remove(),3000)};
const status=s=>$('#st').textContent=s;
// ---------- storage ----------
let db,files={};
const tx=(m,f)=>new Promise((r,j)=>{const t=db.transaction('f',m);const o=f(t.objectStore('f'));t.oncomplete=()=>r(o&&o.result);t.onerror=()=>j(t.error)});
const put=p=>tx('readwrite',s=>s.put(files[p],p)),rm=p=>tx('readwrite',s=>s.delete(p));
async function load(){db=await new Promise((r,j)=>{const q=indexedDB.open('omni-studio',1);q.onupgradeneeded=()=>q.result.createObjectStore('f');q.onsuccess=()=>r(q.result);q.onerror=()=>j(q.error)});
 const k=await tx('readonly',s=>s.getAllKeys()),v=await tx('readonly',s=>s.getAll());k.forEach((p,i)=>files[p]=v[i])}
// ---------- settings ----------
const cfg=Object.assign({theme:'dark',font:14,wrap:false},JSON.parse(localStorage.getItem('omni-cfg')||'{}'));
const saveCfg=()=>localStorage.setItem('omni-cfg',JSON.stringify(cfg));
const ext=p=>(p.split('.').pop()||'').toLowerCase();
const LANG={js:'javascript',mjs:'javascript',ts:'typescript',py:'python',html:'html',htm:'html',css:'css',json:'json',md:'markdown',txt:'plaintext',xml:'xml',yml:'yaml',yaml:'yaml',sh:'shell',sql:'sql'};
// ---------- templates ----------
const TPL={
 'Website':{'index.html':'<!DOCTYPE html>\n<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>My Site</title><link rel="stylesheet" href="style.css"></head>\n<body><h1>Hello, OMNI</h1><button id="b">Click me</button><p id="o"></p><script src="script.js"></script></body></html>','style.css':'body{font-family:system-ui;background:#0b0b12;color:#eee;text-align:center;padding:3rem}\nbutton{padding:.6rem 1.2rem;border-radius:8px;border:0;background:#8b5cf6;color:#fff}','script.js':'let n=0;document.getElementById("b").onclick=()=>{document.getElementById("o").textContent="Clicks: "+(++n)}'},
 'JavaScript':{'main.js':'const fib=n=>n<2?n:fib(n-1)+fib(n-2);\nfor(let i=0;i<10;i++)console.log(i,fib(i));'},
 'Python':{'main.py':'import sys\nprint("Python", sys.version.split()[0])\nprint(sum(i*i for i in range(10)))'},
 'Markdown':{'README.md':'# Notes\n\n**Bold**, *italic*, `code`\n\n- one\n- two'},
 'JSON':{'data.json':'{"name":"omni","items":[1,2,3]}'}};
async function useTemplate(n){if(Object.keys(files).length&&!confirm('Replace current project with this template?'))return;
 for(const p of Object.keys(files)){await rm(p)}files={};closeAll();for(const[p,c]of Object.entries(TPL[n])){files[p]=c;await put(p)}
 renderTree();open(Object.keys(TPL[n])[0]);toast('Template loaded: '+n)}
// ---------- editor ----------
let monaco,editor,models={},openTabs=[],active=null,sel='',dirs=new Set();
const MT={dark:'omni-dark',light:'vs',midnight:'omni-mid'};
function applyTheme(){document.body.dataset.theme=cfg.theme;monaco&&monaco.editor.setTheme(MT[cfg.theme]);editor&&editor.updateOptions({fontSize:cfg.font,wordWrap:cfg.wrap?'on':'off'});saveCfg()}
function open(p){if(!(p in files))return;if(!openTabs.includes(p))openTabs.push(p);
 if(!models[p])models[p]=monaco.editor.createModel(files[p],LANG[ext(p)]||'plaintext',monaco.Uri.parse('file:///'+p));
 active=p;editor.setModel(models[p]);$('#welcome').hidden=true;tabs();$('#lang').textContent=models[p].getLanguageId();
 if(!models[p]._w){models[p]._w=1;let t;models[p].onDidChangeContent(()=>{status('Editing…');clearTimeout(t);t=setTimeout(()=>flush(p),500)})}
 if(innerWidth<800)$('#side').classList.remove('open');editor.focus()}
async function flush(p=active){if(p&&models[p]&&files[p]!==models[p].getValue()){files[p]=models[p].getValue();await put(p);status('Saved '+p);if(!$('#prev').hidden&&lastPrev)preview(lastPrev,true)}}
function closeTab(p){openTabs=openTabs.filter(x=>x!==p);models[p]?.dispose();delete models[p];if(active===p){active=openTabs.at(-1)||null;active?open(active):($('#welcome').hidden=false,editor.setModel(null))}tabs()}
function closeAll(){[...openTabs].forEach(closeTab)}
function tabs(){$('#tabs').innerHTML=openTabs.map(p=>`<div class="t ${p===active?'on':''}" data-p="${esc(p)}">${esc(p.split('/').pop())}<span data-x="${esc(p)}">${ic('x')}</span></div>`).join('')}
$('#tabs').onclick=e=>{const x=e.target.closest('[data-x]');if(x)return closeTab(x.dataset.x);const t=e.target.closest('.t');t&&open(t.dataset.p)};
// ---------- explorer ----------
function renderTree(){const root={};for(const p of Object.keys(files)){let n=root;const ps=p.split('/');ps.forEach((s,i)=>{if(i===ps.length-1){if(s!=='.keep')n[s]=p}else n=n[s]=(typeof n[s]==='object'?n[s]:{})})}
 const walk=(n,pre,d)=>Object.keys(n).sort((a,b)=>(typeof n[a]==='object')-(typeof n[b]==='object')||a.localeCompare(b)).map(k=>{const v=n[k],pad=`style="padding-left:${6+d*14}px"`;
  if(typeof v==='object'){const fp=pre+k+'/',o=dirs.has(fp);return `<div class="row ${sel===fp?'sel':''}" ${pad} data-d="${esc(fp)}">${ic('folder')}${esc(k)}</div>`+(o?walk(v,fp,d+1):'')}
  return `<div class="row ${sel===v?'sel':''}" ${pad} data-f="${esc(v)}">${ic('file')}${esc(k)}</div>`}).join('');
 $('#tree').innerHTML=walk(root,'',0)||'<p class="m" style="padding:10px">Empty project. Create a file or pick a template on the welcome screen.</p>'}
$('#tree').onclick=e=>{const r=e.target.closest('.row');if(!r)return;if(r.dataset.d){sel=r.dataset.d;dirs.has(sel)?dirs.delete(sel):dirs.add(sel)}else{sel=r.dataset.f;open(sel)}renderTree()};
const base=()=>sel?(sel.endsWith('/')?sel:sel.includes('/')?sel.slice(0,sel.lastIndexOf('/')+1):''):'';
const clean=n=>n.trim().replace(/^\/+|\/+$/g,'').replace(/\.\.+\//g,'');
async function newFile(){const n=prompt('New file name (use / for folders):');if(!n||!clean(n))return;const p=base()+clean(n);if(p in files)return toast('Already exists');files[p]='';await put(p);dirs.add(base());renderTree();open(p)}
async function newDir(){const n=prompt('New folder name:');if(!n||!clean(n))return;const p=base()+clean(n)+'/.keep';files[p]='';await put(p);dirs.add(base());dirs.add(base()+clean(n)+'/');renderTree()}
async function rename(){if(!sel)return toast('Select a file or folder first');const old=sel,n=prompt('Rename to (full path):',old.replace(/\/$/,''));if(!n||!clean(n))return;const nw=clean(n)+(old.endsWith('/')?'/':'');
 const ks=Object.keys(files).filter(k=>k===old||(old.endsWith('/')&&k.startsWith(old)));for(const k of ks){const t=nw+k.slice(old.length);if(t in files&&!ks.includes(t))return toast('Target exists');}
 for(const k of ks){if(openTabs.includes(k))closeTab(k);files[nw+k.slice(old.length)]=files[k];delete files[k];await rm(k);await put(nw+k.slice(old.length))}sel=nw;renderTree()}
async function remove(){if(!sel)return toast('Select a file or folder first');if(!confirm('Delete '+sel+'?'))return;
 for(const k of Object.keys(files).filter(k=>k===sel||(sel.endsWith('/')&&k.startsWith(sel)))){if(openTabs.includes(k))closeTab(k);delete files[k];await rm(k)}sel='';renderTree()}
async function upload(fl){for(const f of fl){if(f.size>2e6){toast(f.name+' too large (2 MB max)');continue}const t=await f.text();if(t.includes('\u0000')){toast(f.name+': binary files not supported');continue}const p=base()+f.name;files[p]=t;await put(p)}renderTree();toast('Uploaded')}
const dl=(b,n)=>{const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=n;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1e4)};
async function zipOut(){const z=new JSZip();for(const[p,c]of Object.entries(files))z.file(p,c);dl(await z.generateAsync({type:'blob'}),'omni-project.zip')}
async function zipIn(f){try{const z=await JSZip.loadAsync(f);let n=0;for(const e of Object.values(z.files)){if(e.dir||e.name.includes('..'))continue;const t=await e.async('string');if(t.includes('\u0000'))continue;files[e.name]=t;await put(e.name);n++}renderTree();toast(n+' files imported')}catch(e){toast('ZIP error: '+e.message)}}
const acts={nf:newFile,nd:newDir,ren:rename,del:remove,up:()=>$('#fUp').click(),zipin:()=>$('#fZip').click(),zipout:zipOut};
$('#side .tb').onclick=e=>{const b=e.target.closest('[data-a]');b&&acts[b.dataset.a]()};
$('#fUp').onchange=e=>{upload(e.target.files);e.target.value=''};$('#fZip').onchange=e=>{e.target.files[0]&&zipIn(e.target.files[0]);e.target.value=''};
// ---------- terminal / console ----------
let term,fit;const hist=[];
function out(s,t=''){term.write((t==='err'?'\x1b[31m':t==='dim'?'\x1b[90m':'')+s.replace(/\r?\n/g,'\r\n')+'\x1b[0m');const d=document.createElement('div');d.className=t;d.textContent=s.replace(/\n$/,'');$('#cons').append(d);$('#cons').scrollTop=1e9;if(t==='err')status('Error — see Console')}
const prompt$=()=>term.write('\x1b[36momni\x1b[0m:\x1b[35m~\x1b[0m$ ');
const abs=p=>clean(p);
const HELP=`Browser terminal (NOT a Linux shell). Commands:
  ls [dir]  cat f  touch f  mkdir d  rm f|d  mv a b  pwd  echo ...  clear  history
  run [f]       run file by type    node f | js f   run JavaScript in a Worker
  python f | py f   run Python (Pyodide)   help   about
`;
async function exec(c){const[a,...r]=c.split(/\s+/),arg=r.join(' ');
 try{switch(a){
 case'help':out(HELP);break;
 case'about':out('Runs entirely in your browser: JS in Web Workers, Python via Pyodide/WebAssembly. No OS, no processes, no sockets, no npm/pip installs from here.\n');break;
 case'clear':term.clear();break;case'pwd':out('/project\n');break;case'echo':out(arg+'\n');break;case'history':out(hist.map((h,i)=>` ${i+1}  ${h}`).join('\n')+'\n');break;
 case'ls':{const d=arg?abs(arg)+'/':'',s=new Set();for(const k of Object.keys(files))if(k.startsWith(d)){const x=k.slice(d.length).split('/');if(x[0]!=='.keep')s.add(x.length>1?x[0]+'/':x[0])}out([...s].sort().join('  ')+'\n');break}
 case'cat':if(!(abs(arg)in files))throw Error('No such file: '+arg);out(files[abs(arg)]+'\n');break;
 case'touch':files[abs(arg)]??='';await put(abs(arg));renderTree();break;
 case'mkdir':files[abs(arg)+'/.keep']='';await put(abs(arg)+'/.keep');renderTree();break;
 case'rm':{const p=abs(arg),ks=Object.keys(files).filter(k=>k===p||k.startsWith(p+'/'));if(!ks.length)throw Error('No such file: '+arg);for(const k of ks){if(openTabs.includes(k))closeTab(k);delete files[k];await rm(k)}renderTree();break}
 case'mv':{const[x,y]=r.map(abs);if(!(x in files))throw Error('No such file: '+x);if(openTabs.includes(x))closeTab(x);files[y]=files[x];delete files[x];await rm(x);await put(y);renderTree();break}
 case'run':await run(arg?abs(arg):active);break;
 case'node':case'js':{const p=abs(arg);if(!(p in files))throw Error('No such file: '+arg);await runJS(files[p]);break}
 case'python':case'python3':case'py':{const p=abs(arg);if(!(p in files))throw Error('No such file: '+arg);await runPy(p);break}
 default:out(`${a}: command not found. This is a browser terminal, not a real shell. Type "help".\n`,'err')}}
 catch(e){out(a+': '+e.message+'\n','err')}}
function initTerm(){term=new Terminal({fontSize:13,cursorBlink:true,convertEol:true,theme:{background:'#00000000'},allowTransparency:true});fit=new FitAddon.FitAddon();term.loadAddon(fit);term.open($('#term'));
 out('OMNI browser terminal — type "help". This is not a Linux shell.\n','dim');prompt$();let buf='',hi=0;
 const set=s=>{term.write('\b \b'.repeat(buf.length));buf=s;term.write(s)};
 term.onData(d=>{if(d==='\r'){term.write('\r\n');const c=buf.trim();buf='';if(c){hist.push(c);hi=hist.length;exec(c).then(prompt$)}else prompt$()}
  else if(d==='\x7f'){if(buf){buf=buf.slice(0,-1);term.write('\b \b')}}
  else if(d==='\x1b[A'){if(hi>0)set(hist[--hi])}else if(d==='\x1b[B'){hi<hist.length-1?set(hist[++hi]):(hi=hist.length,set(''))}
  else if(d>=' '&&d[0]!=='\x1b'){buf+=d;term.write(d)}});
 new ResizeObserver(()=>{try{fit.fit()}catch{}}).observe($('#term'))}
function showBottom(w){$('#bottom').hidden=false;$$('[data-b]').forEach(b=>b.classList.toggle('on',b.dataset.b===w));$('#term').hidden=w!=='term';$('#cons').hidden=w!=='cons';setTimeout(()=>fit.fit(),50)}
$('#bottom .tb').onclick=e=>{const b=e.target.closest('[data-b]');b&&showBottom(b.dataset.b)};
$('#bClr').onclick=()=>{$('#cons').innerHTML='';term.clear()};$('#bHide').onclick=()=>$('#bottom').hidden=true;
// ---------- execution ----------
const blob=c=>URL.createObjectURL(new Blob([c],{type:'text/javascript'}));
const JSW=`onmessage=e=>{const f=t=>(...a)=>postMessage({t,s:a.map(x=>{try{return typeof x==='object'?JSON.stringify(x):String(x)}catch{return String(x)}}).join(' ')+'\\n'});console.log=console.info=f('out');console.error=console.warn=f('err');try{(0,eval)(e.data)}catch(x){postMessage({t:'err',s:(x&&x.stack||String(x))+'\\n'})}postMessage({t:'done'})}`;
function runJS(code){return new Promise(res=>{const w=new Worker(blob(JSW));let k=setTimeout(()=>{out('[stopped: 10 s limit]\n','err');end()},1e4),q;const end=()=>{clearTimeout(k);clearTimeout(q);w.terminate();res()};
 w.onmessage=e=>{const m=e.data;if(m.t==='done')q=setTimeout(end,1500);else out(m.s,m.t)};w.onerror=e=>{out(e.message+'\n','err');end()};w.postMessage(code)})}
const PYW=`let py;onmessage=async e=>{const{code,files}=e.data;try{if(!py){postMessage({t:'out',s:'Loading Pyodide (first run, ~10 MB)...\\n'});importScripts('https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js');py=await loadPyodide();py.setStdout({batched:s=>postMessage({t:'out',s:s+'\\n'})});py.setStderr({batched:s=>postMessage({t:'err',s:s+'\\n'})})}
for(const[p,c]of Object.entries(files)){const d=p.split('/').slice(0,-1);let q='';for(const x of d){q+='/'+x;try{py.FS.mkdir('/home/pyodide'+q)}catch{}}py.FS.writeFile('/home/pyodide/'+p,c)}
await py.runPythonAsync(code)}catch(x){postMessage({t:'err',s:String(x.message||x)+'\\n'})}postMessage({t:'done'})}`;
let pyw,pyq=Promise.resolve();
function runPy(p){const code=files[p];pyq=pyq.then(()=>new Promise(res=>{pyw??=new Worker(blob(PYW));const t=setTimeout(()=>{out('[Python stopped: 30 s limit; worker restarted]\n','err');pyw.terminate();pyw=null;res()},3e4);
 pyw.onmessage=e=>{const m=e.data;if(m.t==='done'){clearTimeout(t);res()}else out(m.s,m.t)};pyw.onerror=e=>{out(e.message+'\n','err');clearTimeout(t);res()};pyw.postMessage({code,files})}));return pyq}
async function run(p=active){if(!p)return toast('Open a file first');await flush(p);const x=ext(p);
 if(['html','htm','md','css'].includes(x))return preview(p);
 if(x==='json'){try{files[p]=JSON.stringify(JSON.parse(files[p]),null,2);models[p]?.setValue(files[p]);await put(p);out('JSON valid, formatted.\n')}catch(e){out('Invalid JSON: '+e.message+'\n','err');showBottom('term')}return}
 showBottom('term');out(`> run ${p}\n`,'dim');status('Running…');
 if(x==='js'||x==='mjs')await runJS(files[p]);else if(x==='py')await runPy(p);else toast('No runner for .'+x);status('Done')}
// ---------- preview ----------
let lastPrev=null;
const md=s=>esc(s).replace(/^### (.*)$/gm,'<h3>$1</h3>').replace(/^## (.*)$/gm,'<h2>$1</h2>').replace(/^# (.*)$/gm,'<h1>$1</h1>').replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').replace(/\*(.+?)\*/g,'<i>$1</i>').replace(/`(.+?)`/g,'<code>$1</code>').replace(/\[(.+?)\]\((https?:\/\/[^)\s]+)\)/g,'<a href="$2" target="_blank" rel="noopener">$1</a>').replace(/^[-*] (.*)$/gm,'<li>$1</li>').replace(/\n{2,}/g,'<br><br>');
const SPY=`<script>addEventListener('error',e=>parent.postMessage({omni:'err',s:e.message+' ('+(e.lineno||0)+')'},'*'));for(const k of['log','error','warn'])(o=>console[k]=(...a)=>{o.apply(console,a);parent.postMessage({omni:k=='log'?'out':'err',s:a.join(' ')},'*')})(console[k]);<\/script>`;
function build(p){const x=ext(p);if(x==='md')return`<body style="font-family:system-ui;padding:1rem;line-height:1.5">${md(files[p])}`;
 if(x==='css'){const i=Object.keys(files).find(k=>/(^|\/)index\.html?$/.test(k));if(!i)return`<p>Add an index.html to preview CSS.</p>`;p=i}
 const dir=p.includes('/')?p.slice(0,p.lastIndexOf('/')+1):'',r=u=>files[dir+u.replace(/^\.\//,'')];
 return SPY+files[p].replace(/<link[^>]*href=["']([^"']+)["'][^>]*>/gi,(m,u)=>/stylesheet/i.test(m)&&r(u)!=null?`<style>${r(u)}</style>`:m).replace(/<script([^>]*?)src=["']([^"']+)["']([^>]*)><\/script>/gi,(m,a,u,b)=>r(u)!=null?`<script${a}${b}>${r(u).replace(/<\/script/gi,'<\\/script')}<\/script>`:m)}
function preview(p,quiet){lastPrev=p;$('#prev').hidden=false;$('#frame').srcdoc=build(p);if(!quiet)status('Preview: '+p)}
addEventListener('message',e=>{if(e.source===$('#frame').contentWindow&&e.data?.omni)out('[preview] '+e.data.s+'\n',e.data.omni)});
$('#pRef').onclick=()=>lastPrev&&preview(lastPrev);$('#pX').onclick=()=>$('#prev').hidden=true;$('#pFull').onclick=()=>$('#frame').requestFullscreen?.();
$('#prev .tb').onclick=e=>{const b=e.target.closest('[data-v]');if(b)$('#frame').style.width=b.dataset.v};
// ---------- UI wiring ----------
function welcome(){$('#welcome').innerHTML=`<h1>OMNI CODE STUDIO</h1><p class="m">A real browser IDE. Files persist in this browser (IndexedDB). Start from a template:</p><div class="cards">${Object.keys(TPL).map(n=>`<div class="card" data-t="${n}"><b>${n}</b><br><span class="m">${Object.keys(TPL[n]).join(', ')}</span></div>`).join('')}</div>`;
 $('#welcome').onclick=e=>{const c=e.target.closest('[data-t]');c&&useTemplate(c.dataset.t)}}
$('#bRun').onclick=()=>run();$('#bMenu').onclick=()=>{$('#side').classList.toggle('open');if(innerWidth>800)$('#side').hidden=!$('#side').hidden};
$('#bPrev').onclick=()=>{$('#prev').hidden=!$('#prev').hidden;if(!$('#prev').hidden){const f=active&&['html','md','css'].includes(ext(active))?active:Object.keys(files).find(k=>/index\.html?$/.test(k));f&&preview(f)}};
$('#bTerm').onclick=()=>{$('#bottom').hidden=!$('#bottom').hidden;setTimeout(()=>fit.fit(),50)};
$('#bSet').onclick=()=>{$('#sTheme').value=cfg.theme;$('#sFont').value=cfg.font;$('#sWrap').checked=cfg.wrap;$('#sLang').innerHTML=[...new Set(Object.values(LANG))].map(l=>`<option>${l}</option>`).join('');if(active)$('#sLang').value=models[active].getLanguageId();$('#set').showModal()};
$('#sOk').onclick=()=>$('#set').close();$('#sTheme').onchange=e=>{cfg.theme=e.target.value;applyTheme()};$('#sFont').onchange=e=>{cfg.font=+e.target.value||14;applyTheme()};$('#sWrap').onchange=e=>{cfg.wrap=e.target.checked;applyTheme()};
$('#sLang').onchange=e=>{if(active){monaco.editor.setModelLanguage(models[active],e.target.value);$('#lang').textContent=e.target.value}};
addEventListener('keydown',e=>{const k=e.ctrlKey||e.metaKey;if(!k)return;if(e.key==='Enter'){e.preventDefault();run()}else if(e.key==='s'){e.preventDefault();flush()}else if(e.key==='b'){e.preventDefault();$('#bMenu').click()}else if(e.key==='`'){e.preventDefault();$('#bTerm').click()}},true);
// ---------- boot ----------
(async()=>{try{await load();
 require.config({paths:{vs:'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs'}});
 window.MonacoEnvironment={getWorkerUrl:()=>blob(`self.MonacoEnvironment={baseUrl:'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/'};importScripts('https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs/base/worker/workerMain.js');`)};
 await new Promise(r=>require(['vs/editor/editor.main'],r));monaco=window.monaco;
 monaco.editor.defineTheme('omni-dark',{base:'vs-dark',inherit:true,rules:[],colors:{'editor.background':'#050508','editorLineNumber.foreground':'#4a4a63','editorCursor.foreground':'#22d3ee','editor.selectionBackground':'#8b5cf655'}});
 monaco.editor.defineTheme('omni-mid',{base:'vs-dark',inherit:true,rules:[],colors:{'editor.background':'#0a1024','editorCursor.foreground':'#22d3ee'}});
 editor=monaco.editor.create($('#ed'),{model:null,theme:MT[cfg.theme],automaticLayout:true,minimap:{enabled:innerWidth>800},fontSize:cfg.font,wordWrap:cfg.wrap?'on':'off',folding:true,lineNumbers:'on',scrollBeyondLastLine:false,fontFamily:'ui-monospace,Consolas,monospace'});
 editor.addCommand(monaco.KeyMod.CtrlCmd|monaco.KeyCode.Enter,()=>run());editor.addCommand(monaco.KeyMod.CtrlCmd|monaco.KeyCode.KeyS,()=>flush());
 initTerm();welcome();renderTree();applyTheme();$('#boot').remove();
 const first=Object.keys(files).find(k=>!k.endsWith('.keep'));if(first)open(first)}catch(e){$('#boot').innerHTML='<p style="color:#f87171;max-width:340px">Failed to start: '+esc(String(e))+'<br>The editor libraries load from cdn.jsdelivr.net — check your connection.</p>'}})();
