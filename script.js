function safeGet(key,fallback){ try{ var v=localStorage.getItem(key); return v==null?fallback:v; }catch(e){ return fallback; } }
function safeSet(key,val){ try{ localStorage.setItem(key,val); }catch(e){} }
function navIsCollapsed(nav,toggle){ return !!(toggle && getComputedStyle(toggle).display!=='none' && !nav.classList.contains('nav-expanded')); }
function expandNav(nav,toggle){ nav.classList.add('nav-expanded'); if(toggle)toggle.setAttribute('aria-expanded','true'); }
function collapseNav(nav,toggle){ nav.classList.remove('nav-expanded'); if(toggle)toggle.setAttribute('aria-expanded','false'); }

(function(){
  var tabs=document.querySelectorAll('.shell-tab');
  var panes=document.querySelectorAll('.shell-pane');
  var nav=document.getElementById('shell-nav');
  var toggle=document.getElementById('shell-nav-toggle');
  tabs.forEach(function(t){
    t.addEventListener('click',function(){
      if(navIsCollapsed(nav,toggle)){
        expandNav(nav,toggle);
        return;
      }
      tabs.forEach(function(x){x.classList.remove('on');});
      panes.forEach(function(p){p.classList.remove('on');});
      t.classList.add('on');
      var activePane = document.getElementById('pane-'+t.dataset.pane);
      activePane.classList.add('on');
      activePane.scrollTop = 0;
      window.scrollTo(0,0);
      collapseNav(nav,toggle);
    });
  });
  if(toggle){
    toggle.addEventListener('click',function(){
      var expanded=nav.classList.toggle('nav-expanded');
      toggle.setAttribute('aria-expanded',expanded?'true':'false');
    });
  }
})();

(function(){
"use strict";
function showLoadError(missing){
  try{
    var el=document.createElement('div');
    el.setAttribute('role','alert');
    // Inline styles on purpose: style.css may be the file that failed to load.
    el.style.cssText='position:fixed;top:0;left:0;right:0;z-index:99999;padding:14px 18px;'+
      'background:#7f1d1d;color:#fff;font:14px/1.5 system-ui,-apple-system,sans-serif;text-align:center';
    el.textContent=missing
      ? "This page couldn't load content.js. Keep index.html, style.css and content.js together in the same folder."
      : "The page failed to start. Check the browser console for details.";
    (document.body||document.documentElement).appendChild(el);
  }catch(e){}
}
try{
if(typeof QDATA==='undefined') throw new Error('content.js failed to load');

const MIXED_COLOR="#9aa4c6"; // "Mixed / Applied" is a cross-domain study filter, not a 6th domain
function domainBadge(code){
  const info=DOMAIN_INFO[code]; if(!info) return '';
  return `<span class="domchip" style="color:${info.color};border-color:${info.color}">${code}</span>`;
}
function optionRow(L,text){
  return `<span class="lt">${L}</span><span>${esc(text)}</span>`;
}
function codeChip(code,color){
  return `<span class="qdcode" style="color:${color};border-color:${color}">${code}</span>`;
}


/* ---------- persistence: localStorage (works when this file is opened directly in a browser) ---------- */
const KEY='ccaf_progress_v1';
let STATE={};
const mem={};
async function loadState(){
  try{
    const raw=localStorage.getItem(KEY);
    STATE=raw?JSON.parse(raw):{};
  }catch(e){ STATE=mem[KEY]?JSON.parse(mem[KEY]):{}; }
}
async function saveState(){
  const s=JSON.stringify(STATE); mem[KEY]=s;
  try{ localStorage.setItem(KEY,s); }catch(e){ /* private-browsing or storage disabled: falls back to in-memory only for this tab */ }
}
const mark=(id,v)=>{ if(STATE[id]===v)delete STATE[id]; else STATE[id]=v; saveState(); };

/* ---------- taxonomy indexes ---------- */
const DOMAIN_ORDER=['D1','D2','D3','D4','D5'];
const TS_BY_ID={}; TASK_STATEMENTS.forEach(t=>{ TS_BY_ID[t.id]=t; });
const TS_BY_DOMAIN={}; TASK_STATEMENTS.forEach(t=>{ (TS_BY_DOMAIN[t.domain]=TS_BY_DOMAIN[t.domain]||[]).push(t); });
const Q_BY_TS={}; QDATA.forEach(q=>{ (Q_BY_TS[q.ts]=Q_BY_TS[q.ts]||[]).push(q); });
const CONCEPTS_BY_TS={}; CONCEPTS.forEach(c=>{ (CONCEPTS_BY_TS[c.ts]=CONCEPTS_BY_TS[c.ts]||[]).push(c); });
const MIXED_KEY='__mixed__';
const MIXED_Q=QDATA.filter(q=>q.c==='Mixed / Applied Scenarios'); // cross-cutting, exam-style
const tsKnown=id=>(Q_BY_TS[id]||[]).filter(q=>STATE[q.id]==='known').length;
const tsTitle=id=>{ const t=TS_BY_ID[id]; return t?t.title:id; };
function forEachDomain(cb){ DOMAIN_ORDER.forEach((code,i)=>cb(code,DOMAIN_INFO[code],TS_BY_DOMAIN[code]||[],i)); }

/* ---------- tabs ---------- */
const views={path:'v-path',cheat:'v-cheat',study:'v-study',quiz:'v-quiz',concepts:'v-concepts'};
document.getElementById('tabs').addEventListener('click',e=>{
  const toggleBtn=e.target.closest('#console-tabs-toggle');
  if(toggleBtn){
    const expanded=document.getElementById('tabs').classList.toggle('nav-expanded');
    toggleBtn.setAttribute('aria-expanded',expanded?'true':'false');
    return;
  }
  const b=e.target.closest('.tab'); if(!b)return;
  const tabsNav=document.getElementById('tabs');
  const innerToggle=document.getElementById('console-tabs-toggle');
  if(navIsCollapsed(tabsNav,innerToggle)){
    expandNav(tabsNav,innerToggle);
    return;
  }
  document.querySelectorAll('.tab').forEach(t=>t.classList.toggle('on',t===b));
  Object.values(views).forEach(id=>document.getElementById(id).classList.remove('on'));
  document.getElementById(views[b.dataset.v]).classList.add('on');
  collapseNav(tabsNav,innerToggle);
  if(b.dataset.v==='path')renderPath();
  if(b.dataset.v==='concepts')renderConcepts();
});

/* ---------- learning path (domains → task statements, blueprint weight order) ---------- */
function renderPath(){
  const sp=document.getElementById('spine'); sp.innerHTML='';
  forEachDomain((code,info,tsList,i)=>{
    const total=tsList.reduce((a,t)=>a+((Q_BY_TS[t.id]||[]).length),0);
    const known=tsList.reduce((a,t)=>a+tsKnown(t.id),0);
    const done=total>0&&known===total;
    const el=document.createElement('div'); el.className='phase'+(done?' done':'');
    el.innerHTML=`<div class="node" style="border-color:${info.color}">${done?'✓':i+1}</div>
      <div class="ph-head"><h3>${domainBadge(code)} ${info.label}</h3><span class="ph-prog">${info.weight} · ${known}/${total} <span>known</span></span></div>
      <div class="ph-desc">${DOMAIN_DESC[code]||''}</div>
      <div class="mods"></div>`;
    const box=el.querySelector('.mods');
    tsList.forEach(t=>{
      const list=Q_BY_TS[t.id]||[]; const k=tsKnown(t.id); const pct=list.length?Math.round(k/list.length*100):0;
      const b=document.createElement('button'); b.className='mod';
      b.innerHTML=`<span class="nm"><span class="tscode">${t.id}</span> ${t.title}</span>
        <span class="ct">${k}/${list.length}</span>
        <span class="bar"><i style="width:${pct}%"></i></span>
        <span class="go">→</span>`;
      b.onclick=()=>openTs(t.id);
      box.appendChild(b);
    });
    sp.appendChild(el);
  });
}

/* ---------- cheat sheet ---------- */
function renderCheat(){
  document.getElementById('core').innerHTML=CORE.map(([t,d])=>
    `<div class="c"><b>${t}</b><p>${d}</p></div>`).join('');
  document.getElementById('rules').innerHTML=RULES.map(([grp,rows])=>
    `<div class="rgroup"><h4>${grp}</h4>${rows.map(([iff,then,trap])=>
      `<div>
         <div class="rule">
           <div class="rif"><span class="k">IF THE STEM SAYS</span><span class="t">${iff}</span></div>
           <div class="rarrow">→</div>
           <div class="rthen"><span class="k">REACH FOR</span><span class="t">${then}</span></div>
         </div>
         ${trap&&trap!=='—'?`<div class="rtrap"><b>TRAP</b><span>${trap}</span></div>`:''}
       </div>`).join('')}</div>`).join('');
}

/* ---------- study ---------- */
let curTs=null, studyFilter='all', searchQuery='';  // curTs = a task-statement id, or MIXED_KEY
curTs = (TS_BY_DOMAIN['D1'] && TS_BY_DOMAIN['D1'][0] && TS_BY_DOMAIN['D1'][0].id) || TASK_STATEMENTS[0].id;
const searchCache=new Map();
function searchBlob(q){
  if(searchCache.has(q.id))return searchCache.get(q.id);
  const blob=[q.id,q.ts,q.c,q.q,...Object.values(q.o)].join(' ').toLowerCase();
  searchCache.set(q.id,blob);
  return blob;
}
function searchResults(query){ return QDATA.filter(q=>searchBlob(q).includes(query)); }
function clearSearch(){
  searchQuery='';
  const si=document.getElementById('s-search'); if(si)si.value='';
  const sc=document.getElementById('s-search-clear'); if(sc)sc.hidden=true;
}
function curList(){ return searchQuery ? searchResults(searchQuery) : (curTs===MIXED_KEY ? MIXED_Q : (Q_BY_TS[curTs]||[])); }
function curName(){ return searchQuery ? 'Search results' : (curTs===MIXED_KEY ? 'Mixed / Applied' : tsTitle(curTs)); }
const openRailDomains=new Set();
function curDomainCode(){
  if(curTs===MIXED_KEY)return 'MIX';
  const t=TS_BY_ID[curTs]; return t?t.domain:null;
}
function collapseRailMobile(){
  const rail=document.getElementById('study-rail'); if(!rail)return;
  rail.classList.remove('rail-expanded');
  const t=document.getElementById('rail-toggle'); if(t)t.setAttribute('aria-expanded','false');
}
function renderRail(){
  const r=document.getElementById('rail'); r.innerHTML='';
  const curDom=curDomainCode();
  if(curDom)openRailDomains.add(curDom);
  const addGroup=(code,label,tsOrMixed)=>{
    const isOpen=openRailDomains.has(code);
    const isCurrent=code===curDom;
    const h=document.createElement('div'); h.className='rail-group'+(isOpen?' open':'')+(isCurrent?' current-domain':'');
    h.innerHTML=`<span>${label}</span><span class="rail-chevron">▾</span>`;
    h.onclick=()=>{ if(openRailDomains.has(code))openRailDomains.delete(code); else openRailDomains.add(code); renderRail(); };
    r.appendChild(h);
    const body=document.createElement('div'); body.className='rail-domain-body'+(isOpen?' open':'')+(isCurrent?' current-domain':'');
    tsOrMixed(body);
    r.appendChild(body);
  };
  forEachDomain((code,info,tsList)=>{
    if(!tsList.length) return;
    addGroup(code, `${domainBadge(code)} ${info.label}`, body=>{
      tsList.forEach(t=>{
        const list=Q_BY_TS[t.id]||[];
        const b=document.createElement('button'); if(t.id===curTs)b.classList.add('on');
        b.innerHTML=`<span>${t.title}</span><span class="n">${tsKnown(t.id)}/${list.length}</span>`;
        b.onclick=(e)=>{e.stopPropagation();clearSearch();curTs=t.id;renderStudy();renderRail();collapseRailMobile();};
        body.appendChild(b);
      });
    });
  });
  addGroup('MIX', 'Cross-cutting', body=>{
    const mb=document.createElement('button'); if(curTs===MIXED_KEY)mb.classList.add('on');
    mb.innerHTML=`<span>Mixed / Applied</span><span class="n">${MIXED_Q.filter(q=>STATE[q.id]==='known').length}/${MIXED_Q.length}</span>`;
    mb.onclick=(e)=>{e.stopPropagation();clearSearch();curTs=MIXED_KEY;renderStudy();renderRail();collapseRailMobile();};
    body.appendChild(mb);
  });
}
function openTs(id){
  clearSearch();
  curTs=id;
  document.querySelectorAll('.tab').forEach(t=>t.classList.toggle('on',t.dataset.v==='study'));
  Object.values(views).forEach(v=>document.getElementById(v).classList.remove('on'));
  document.getElementById('v-study').classList.add('on');
  renderRail(); renderStudy();
  window.scrollTo({top:0,behavior:'smooth'});
}
document.getElementById('s-filter').onclick=function(){
  studyFilter=studyFilter==='all'?'review':studyFilter==='review'?'unseen':'all';
  this.textContent=studyFilter==='all'?'All':studyFilter==='review'?'To review':'Not yet known';
  renderStudy();
};
document.getElementById('s-search').addEventListener('input',function(e){
  searchQuery=e.target.value.trim().toLowerCase();
  document.getElementById('s-search-clear').hidden=!searchQuery;
  renderStudy();
});
document.getElementById('s-search-clear').onclick=function(){
  clearSearch();
  renderStudy();
};
function renderStudy(){
  document.getElementById('s-modname').textContent=curName();
  let list=curList();
  if(studyFilter==='review')list=list.filter(q=>STATE[q.id]==='review');
  if(studyFilter==='unseen')list=list.filter(q=>STATE[q.id]!=='known');
  document.getElementById('s-count').textContent=list.length+' Qs';
  const c=document.getElementById('s-list'); c.innerHTML='';
  if(!list.length){
    c.innerHTML=searchQuery
      ? '<div class="card" style="color:var(--ink3)">No questions match this search \u2014 try a different keyword or id.</div>'
      : '<div class="card" style="color:var(--ink3)">Nothing here with this filter. Switch the filter, or you\u2019ve cleared this module \u2014 nice.</div>';
    return;
  }
  list.forEach(q=>c.appendChild(studyCard(q)));
}
const kwCache=new Map();
function keywordsFor(q){
  if(kwCache.has(q.id))return kwCache.get(q.id);
  const text=[q.q,...Object.values(q.o),q.w||''].join(' ');
  const found=[];
  KEYWORDS.forEach(k=>{ if(k.r.test(text)) found.push(k.l); });
  kwCache.set(q.id,found);
  return found;
}
function kwChips(q){
  const tags=keywordsFor(q);
  if(!tags.length)return '';
  return `<div class="kwrow">${tags.map(t=>`<span class="kwchip">${t}</span>`).join('')}</div>`;
}
function studyCard(q){
  const el=document.createElement('div'); el.className='card';
  const st=STATE[q.id];
  const conflictBadge = q.conflict ? `<span class="pill" style="background:var(--rose-soft);color:var(--rose);font-weight:700">⚠ answer conflict</span>` : '';
  el.innerHTML=`<div style="margin-bottom:8px"><span class="tscode">${q.id}</span></div>
    <div class="qtext">${esc(q.q)} ${conflictBadge}</div>
    ${kwChips(q)}
    <div class="opts"></div>
    <div class="qactions">
      <button class="mini reveal" data-a="reveal">Show answer</button>
      <button class="mini ${st==='known'?'act known':''}" data-a="known">Known</button>
      <button class="mini ${st==='review'?'act review':''}" data-a="review">Review later</button>
    </div>`;
  const ob=el.querySelector('.opts');
  ['A','B','C','D'].forEach(L=>{ if(!q.o[L])return;
    const o=document.createElement('div'); o.className='opt'; o.dataset.l=L;
    o.innerHTML=optionRow(L,q.o[L]);
    ob.appendChild(o);
  });
  const reveal=()=>{
    el.querySelectorAll('.opt').forEach(o=>{
      if(o.dataset.l===q.a)o.classList.add('correct');
    });
    if(!el.querySelector('.why')){
      const w=document.createElement('div'); w.className='why';
      w.innerHTML=q.w
        ? `<b>Why</b><br>${esc(q.w)}`
        : `<b>Answer</b><br>Correct choice: <b style="font-family:var(--mono)">${q.a}</b>. (No written explanation in the source for this one.)`;
      el.querySelector('.qactions').before(w);
    }
  };
  el.querySelector('.qactions').addEventListener('click',e=>{
    const b=e.target.closest('.mini'); if(!b)return;
    const a=b.dataset.a;
    if(a==='reveal'){reveal();b.style.display='none';return;}
    mark(q.id,a);
    renderRail();
    b.classList.toggle('act');
    b.classList.toggle(a);
    // clear sibling active
    const other=a==='known'?'review':'known';
    const ob2=el.querySelector(`.mini[data-a="${other}"]`);
    if(ob2){ob2.classList.remove('act',other);}
  });
  return el;
}

/* ---------- concept library ---------- */
function renderConcepts(){
  const root=document.getElementById('concepts-root');
  let html='<div class="eyebrow">Concept library</div>'
    +'<h2 class="vt">59 concepts across the 5 domains</h2>'
    +'<p class="lede">Every testable concept from the official blueprint, grouped by domain and task statement. Each shows its core insight and a difficulty level.</p>';
  forEachDomain((code,info,tsList)=>{
    const nConc=tsList.reduce((a,t)=>a+((CONCEPTS_BY_TS[t.id]||[]).length),0);
    html+=`<section class="conc-domain"><div class="conc-dhead" style="border-color:${info.color}">`
      +codeChip(code,info.color)
      +`<span class="qdlabel">${info.label}</span><span class="qdweight">${info.weight} \u00b7 ${nConc} concepts</span></div>`;
    tsList.forEach(t=>{
      const cs=CONCEPTS_BY_TS[t.id]||[];
      if(!cs.length) return;
      html+=`<div class="conc-ts"><div class="conc-tshead"><span class="tscode">${t.id}</span> ${esc(t.title)}</div>`;
      cs.forEach(c=>{
        html+=`<div class="conc-card"><div class="conc-top"><span class="conc-title">${esc(c.title)}</span>`
          +`<span class="lvl lvl-${c.level.toLowerCase()}">${c.level}</span></div>`
          +`<div class="conc-insight">${esc(c.insight)}</div></div>`;
      });
      html+='</div>';
    });
    html+='</section>';
  });
  root.innerHTML=html;
}

/* ---------- exam by domain ---------- */
let quiz=null;
let examMode=safeGet('ccaf_exam_mode','blind');
function setExamMode(m){ examMode=m; safeSet('ccaf_exam_mode',m); }
function examModeToggleHtml(){
  return `<div class="chips" id="exam-mode-toggle">
    <button type="button" class="chip${examMode==='blind'?' on':''}" data-m="blind">Standard</button>
    <button type="button" class="chip${examMode==='reveal'?' on':''}" data-m="reveal">Instant reveal</button>
  </div>`;
}
function wireExamModeToggle(root){
  const tc=root.querySelector('#exam-mode-toggle'); if(!tc)return;
  tc.querySelectorAll('.chip').forEach(b=>{
    b.onclick=()=>{ setExamMode(b.dataset.m); tc.querySelectorAll('.chip').forEach(x=>x.classList.toggle('on',x===b)); };
  });
}
function quizSetup(){
  const cats=TASK_STATEMENTS.map(t=>t.id).concat([MIXED_KEY]);
  const root=document.getElementById('quiz-root');
  const sel=new Set();
  root.innerHTML=`<div class="eyebrow">Exam mode</div>
    <h2 class="vt">Build an exam by domain</h2>
    <p class="lede">Pick one domain for a focused drill, or several to simulate the real mix. Questions are shuffled, scored at the end, with the explanation shown on every miss.</p>
    <div class="setup">
      <h3>Exam Domains</h3>
      <div class="row" style="margin-bottom:10px">
        <button class="mini" id="qall">Select all</button>
        <button class="mini" id="qnone">Clear</button>
      </div>
      <h3 style="margin-top:16px">Length</h3>
      <div class="chips" id="qlen"></div>
      <h3 style="margin-top:16px">Feedback style</h3>
      ${examModeToggleHtml()}
      <div class="row" style="margin-top:16px"><button class="btn" id="qstart">Start exam</button>
      <span class="ph-prog" id="qavail">0 questions available</span></div>
      <div id="qgroups" style="margin-top:16px"></div>
    </div>`;
  const gc=root.querySelector('#qgroups');
  const allChipBtns=[];
  const mkChip=(key,label,title)=>{
    const b=document.createElement('button'); b.className='chip'; b.textContent=label; if(title)b.title=title;
    b.onclick=()=>{b.classList.toggle('on'); if(sel.has(key))sel.delete(key); else sel.add(key); updAvail();};
    allChipBtns.push(b); return b;
  };
  forEachDomain((code,info,tsList)=>{
    const grp=document.createElement('div'); grp.className='qdgroup';
    grp.innerHTML=`<div class="qdhead" style="border-color:${info.color}">
        ${codeChip(code,info.color)}
        <span class="qdlabel">${info.label}</span>
        <span class="qdweight">${info.weight}</span>
      </div><div class="chips qdchips"></div>`;
    const chipBox=grp.querySelector('.qdchips');
    const keys=[];
    tsList.forEach(t=>{
      const n=(Q_BY_TS[t.id]||[]).length;
      chipBox.appendChild(mkChip(t.id, `${t.id.replace('ts-','')} (${n})`, t.title));
      keys.push(t.id);
    });
    grp.querySelector('.qdhead').onclick=()=>{
      const shouldSelect=!keys.every(k=>sel.has(k));
      chipBox.querySelectorAll('.chip').forEach(b=>b.classList.toggle('on',shouldSelect));
      keys.forEach(k=>{ if(shouldSelect)sel.add(k); else sel.delete(k); });
      updAvail();
    };
    gc.appendChild(grp);
  });
  const mgrp=document.createElement('div'); mgrp.className='qdgroup';
  mgrp.innerHTML=`<div class="qdhead" style="border-color:${MIXED_COLOR}">
      ${codeChip('MIX',MIXED_COLOR)}
      <span class="qdlabel">Mixed / Applied</span>
      <span class="qdweight">cross-cutting</span>
    </div><div class="chips qdchips"></div>`;
  mgrp.querySelector('.qdchips').appendChild(mkChip(MIXED_KEY, `applied (${MIXED_Q.length})`, 'Cross-cutting, exam-style scenarios'));
  gc.appendChild(mgrp);
  root.querySelector('#qall').onclick=()=>{allChipBtns.forEach(b=>b.classList.add('on'));cats.forEach(c=>sel.add(c));updAvail();};
  root.querySelector('#qnone').onclick=()=>{allChipBtns.forEach(b=>b.classList.remove('on'));sel.clear();updAvail();};
  let len=20; const lens=[10,20,60,'All'];
  const lc=root.querySelector('#qlen');
  lens.forEach(n=>{const b=document.createElement('button');b.className='chip'+(n===20?' on':'');b.textContent=n;
    b.onclick=()=>{len=n;lc.querySelectorAll('.chip').forEach(x=>x.classList.remove('on'));b.classList.add('on');};lc.appendChild(b);});
  const pool=()=>{
    const seen=new Set(); const out=[];
    cats.filter(k=>sel.has(k)).forEach(k=>{ (k===MIXED_KEY?MIXED_Q:(Q_BY_TS[k]||[])).forEach(q=>{ if(!seen.has(q.id)){seen.add(q.id);out.push(q);} }); });
    return out;
  };
  const updAvail=()=>{root.querySelector('#qavail').textContent=pool().length+' questions available';};
  updAvail();
  wireExamModeToggle(root);
  root.querySelector('#qstart').onclick=()=>{
    let p=pool(); if(!p.length)return;
    p=shuffle(p.slice()); const n=len==='All'?p.length:Math.min(len,p.length);
    quiz={items:p.slice(0,n),i:0,answers:{},flagged:new Set(),startedAt:Date.now(),mode:examMode}; quizQ();
  };
}
function goToQuestion(idx){
  quiz.i=Math.max(0,Math.min(idx,quiz.items.length-1));
  quizQ();
}
function toggleFlag(){
  const q=quiz.items[quiz.i];
  if(quiz.flagged.has(q.id))quiz.flagged.delete(q.id); else quiz.flagged.add(q.id);
  quizQ();
}
function toggleExamFullscreen(){
  if(document.fullscreenElement)document.exitFullscreen();
  else document.documentElement.requestFullscreen().catch(()=>{});
}
function examSidebarHtml(){
  const answered=quiz.items.filter(q=>quiz.answers[q.id]).length;
  const nums=quiz.items.map((q,idx)=>{
    const cls=['exam-qnum'];
    if(quiz.answers[q.id])cls.push('answered');
    if(idx===quiz.i)cls.push('current');
    if(quiz.flagged.has(q.id))cls.push('flagged');
    return `<button type="button" class="${cls.join(' ')}" data-idx="${idx}">${idx+1}</button>`;
  }).join('');
  return `<aside class="exam-sidebar">
    <div class="exam-sidebar-head"><span>Questions</span><span class="n">${answered}/${quiz.items.length}</span></div>
    <div class="exam-qgrid">${nums}</div>
  </aside>`;
}
function donateCardsHtml(){
  return `<div class="donate-cards">
    ${DONATIONS.map(d=>`<div class="donate-card">
      <div class="donate-cap">${esc(d.label)}</div>
      <img class="donate-qr" src="${esc(d.file)}" alt="${esc(d.label)} QR code" onerror="var c=this.closest('.donate-card'),grid=c.closest('.donate-cards');c.remove();if(grid&&!grid.querySelector('.donate-card')){var wrap=grid.closest('.exam-donate-wrap'),t=wrap||grid,banner=t.closest('.donate-banner');(banner||t).remove();}">
    </div>`).join('')}
  </div>`;
}
function donateModalHtml(id){
  return `<div class="donate-modal" id="${id}-pop">
    <div class="donate-modal-panel">
      <button type="button" class="donate-modal-close" id="${id}-close" aria-label="Close">✕</button>
      <div class="donate-pop-title">☕ Buy me a coffee</div>
      ${donateCardsHtml()}
    </div>
  </div>`;
}
function wireDonateModal(root,id){
  const btn=root.querySelector('#'+id+'-btn'), modal=root.querySelector('#'+id+'-pop');
  if(!btn||!modal)return;
  btn.onclick=()=>modal.classList.add('show');
  const close=()=>modal.classList.remove('show');
  root.querySelector('#'+id+'-close').onclick=close;
  modal.onclick=(e)=>{ if(e.target===modal)close(); };
}
function donateBannerHtml(){
  return `<div class="donate-banner">
    <div class="donate-banner-text">
      <div class="donate-banner-title">Found this useful?</div>
      <div class="donate-banner-sub">Free and open-source practice questions.</div>
    </div>
    <span class="exam-donate-wrap">
      <button type="button" class="btn ghost" id="rdonate-btn">☕ Buy me a coffee</button>
      ${donateModalHtml('rdonate')}
    </span>
  </div>`;
}
function quizQ(){
  const q=quiz.items[quiz.i]; const root=document.getElementById('quiz-root');
  const isLast=quiz.i===quiz.items.length-1;
  const flagged=quiz.flagged.has(q.id);
  const prevGridScroll=root.querySelector('.exam-qgrid')?.scrollTop||0;
  root.innerHTML=`<div class="exam-grid">
    ${examSidebarHtml()}
    <div>
      <div class="exam-topbar">
        <span class="exam-qcounter">Question ${quiz.i+1} of ${quiz.items.length}</span>
        <div class="exam-controls">
          <span class="pill">Practice · untimed</span>
          <button type="button" class="exam-flag${flagged?' on':''}" id="qflag">${flagged?'🚩 Flagged':'⚑ Flag for Review'}</button>
          <button type="button" class="exam-iconbtn" id="qexpand" aria-label="Toggle fullscreen" title="Toggle fullscreen">⤢</button>
        </div>
      </div>
      <div class="card">
        <div class="qtext">${esc(q.q)}</div>
        <div class="opts"></div>
        <div class="qresult"></div>
      </div>
      <div class="exam-bottomnav">
        <button class="btn ghost" id="qprev"${quiz.i===0?' disabled':''}>← Previous</button>
        <button class="btn" id="qnext">${isLast?'Finish exam':'Next →'}</button>
      </div>
    </div>
  </div>`;
  const grid=root.querySelector('.exam-qgrid'); if(grid)grid.scrollTop=prevGridScroll;
  const ob=root.querySelector('.opts');
  const chosen=quiz.answers[q.id];
  const reveal=quiz.mode==='reveal'&&chosen!=null;
  ['A','B','C','D'].forEach(L=>{ if(!q.o[L])return;
    const o=document.createElement('button'); o.dataset.l=L;
    let cls='opt quiz-opt';
    if(reveal){ cls+=L===q.a?' correct':(L===chosen?' wrong':''); o.disabled=true; }
    else cls+=chosen===L?' selected':'';
    o.className=cls;
    o.innerHTML=optionRow(L,q.o[L]);
    o.onclick=()=>{ quiz.answers[q.id]=L; quizQ(); };
    ob.appendChild(o);
  });
  if(reveal){
    const isGood=chosen===q.a;
    const rb=root.querySelector('.qresult');
    rb.innerHTML=`<div class="rt-result ${isGood?'good':'bad'}"><span class="rt-dot"></span>${isGood?'Correct.':'Not this time — correct answer is '+q.a+'.'}</div>`
      +(q.w?`<div class="rt-why">${esc(q.w)}</div>`:`<div class="rt-why empty">No saved explanation for this one.</div>`);
  }
  root.querySelectorAll('.exam-qnum').forEach(b=>{ b.onclick=()=>goToQuestion(+b.dataset.idx); });
  root.querySelector('#qflag').onclick=toggleFlag;
  root.querySelector('#qexpand').onclick=toggleExamFullscreen;
  root.querySelector('#qprev').onclick=()=>goToQuestion(quiz.i-1);
  root.querySelector('#qnext').onclick=()=>{ isLast?quizScore():goToQuestion(quiz.i+1); };
}
function fmtElapsed(ms){
  const s=Math.max(0,Math.round(ms/1000));
  const m=Math.floor(s/60), r=s%60;
  return m>0?`${m}m ${r}s`:`${r}s`;
}
function quizDomainBreakdown(){
  const byDom={};
  quiz.items.forEach(q=>{
    const t=TS_BY_ID[q.ts]; const code=t?t.domain:null; if(!code)return;
    byDom[code]=byDom[code]||{correct:0,total:0};
    byDom[code].total++;
    if(quiz.answers[q.id]===q.a)byDom[code].correct++;
  });
  return DOMAIN_ORDER.filter(c=>byDom[c]).map(code=>{
    const info=DOMAIN_INFO[code], d=byDom[code];
    return {label:info.label,color:info.color,correct:d.correct,total:d.total,pct:Math.round(d.correct/d.total*100)};
  });
}
function reviewBadge(q){
  const a=quiz.answers[q.id];
  if(!a)return '<span class="pill rq-badge rq-skip">Skipped</span>';
  return a===q.a?'<span class="pill rq-badge rq-correct">Correct</span>':'<span class="pill rq-badge rq-incorrect">Incorrect</span>';
}
function renderReviewList(){
  const list=document.getElementById('rq-list'); if(!list)return;
  const filter=quiz.reviewFilter||'all';
  quiz.reviewExpanded=quiz.reviewExpanded||new Set();
  const items=quiz.items.filter(q=>{
    if(filter==='incorrect')return quiz.answers[q.id]&&quiz.answers[q.id]!==q.a;
    if(filter==='flagged')return quiz.flagged.has(q.id);
    return true;
  });
  list.innerHTML='';
  if(!items.length){ list.innerHTML='<div class="card" style="color:var(--ink3)">Nothing matches this filter.</div>'; return; }
  items.forEach(q=>{
    const a=quiz.answers[q.id];
    const qn=quiz.items.indexOf(q)+1;
    const open=quiz.reviewExpanded.has(q.id);
    const el=document.createElement('div'); el.className='rq-row'+(open?' open':'');
    el.innerHTML=`<button type="button" class="rq-row-head">
        <span class="rq-row-chev">▸</span>
        <span class="rq-qn">Q${qn}</span>
        ${reviewBadge(q)}
        ${q.c?`<span class="rt-domain">${esc(q.c)}</span>`:''}
        ${quiz.flagged.has(q.id)?'<span class="pill" style="color:var(--amber);border-color:var(--amber)">🚩</span>':''}
        <span class="rq-row-preview">${esc(q.q)}</span>
      </button>
      <div class="rq-row-body"${open?'':' style="display:none"'}>
        <div class="qtext">${esc(q.q)}</div>
        <div class="opts"></div>
        ${q.w?`<div class="why"><b>Why</b><br>${esc(q.w)}</div>`:''}
        ${kwChips(q)}
      </div>`;
    if(open){
      const ob=el.querySelector('.opts');
      ['A','B','C','D'].forEach(L=>{ if(!q.o[L])return;
        const o=document.createElement('div'); o.className='opt'+(L===q.a?' correct':(L===a?' wrong':''));
        o.innerHTML=optionRow(L,q.o[L]);
        ob.appendChild(o);
      });
    }
    el.querySelector('.rq-row-head').onclick=()=>{
      if(quiz.reviewExpanded.has(q.id))quiz.reviewExpanded.delete(q.id); else quiz.reviewExpanded.add(q.id);
      renderReviewList();
    };
    list.appendChild(el);
  });
}
function quizScore(){
  const correct=quiz.items.filter(q=>quiz.answers[q.id]===q.a).length;
  const incorrect=quiz.items.filter(q=>quiz.answers[q.id]&&quiz.answers[q.id]!==q.a).length;
  const skipped=quiz.items.length-correct-incorrect;
  const tot=quiz.items.length; const pct=Math.round(correct/tot*100);
  const msg=pct>=85?'Exam-ready on this set.':pct>=70?'Solid — tighten the misses.':pct>=50?'Getting there. Re-drill the trap answers.':'Back to the cheat sheet, then run it again.';
  const tierColor=pct>=70?'var(--teal)':pct>=50?'var(--amber)':'var(--rose)';
  const elapsed=quiz.startedAt?fmtElapsed(Date.now()-quiz.startedAt):'—';
  quiz.reviewFilter=quiz.reviewFilter||'all';
  const domains=quizDomainBreakdown();
  const root=document.getElementById('quiz-root');
  root.innerHTML=`<div class="exam-banner" style="border-color:${tierColor}">
      <div class="exam-banner-pct" style="color:${tierColor}">${pct}%</div>
      <div class="exam-banner-msg">${correct} of ${tot} correct · ${msg}</div>
    </div>
    <div class="exam-stats">
      <div class="exam-stat"><div class="exam-stat-icon" style="color:var(--teal);border-color:var(--teal)">✓</div><div class="n" style="color:var(--teal)">${correct}</div><div class="l">Correct</div></div>
      <div class="exam-stat"><div class="exam-stat-icon" style="color:var(--rose);border-color:var(--rose)">✕</div><div class="n" style="color:var(--rose)">${incorrect}</div><div class="l">Incorrect</div></div>
      <div class="exam-stat"><div class="exam-stat-icon" style="color:var(--ink3);border-color:var(--ink3)">–</div><div class="n" style="color:var(--ink3)">${skipped}</div><div class="l">Skipped</div></div>
      <div class="exam-stat"><div class="exam-stat-icon" style="color:var(--indigo);border-color:var(--indigo)">🕐</div><div class="n">${elapsed}</div><div class="l">Time Taken</div></div>
    </div>
    ${donateBannerHtml()}
    ${domains.length?`<div class="exam-domains">
      <h3>Performance by domain</h3>
      ${domains.map(d=>`<div class="exam-domain-row">
        <div class="exam-domain-label"><span>${esc(d.label)}</span><span class="n">${d.correct}/${d.total} (${d.pct}%)</span></div>
        <div class="exam-domain-bar"><i style="width:${d.pct}%;background:${d.color}"></i></div>
      </div>`).join('')}
    </div>`:''}
    <div class="row" style="justify-content:center;margin:22px 0">
      <button class="btn" id="qagain">New exam</button>
      ${incorrect>0?`<button class="btn ghost" id="qretake">Questions you missed</button>`:''}
      ${skipped>0?`<button class="btn ghost" id="qretake-skip">Questions you skipped</button>`:''}
    </div>
    ${(incorrect>0||skipped>0)?`<div class="row" style="justify-content:center;margin:0 0 22px">${examModeToggleHtml()}</div>`:''}
    <div class="exam-review">
      <h3>Review Questions</h3>
      <div class="chips" id="rq-filter">
        <button type="button" class="chip${quiz.reviewFilter==='all'?' on':''}" data-f="all">All <span class="n">(${tot})</span></button>
        <button type="button" class="chip${quiz.reviewFilter==='incorrect'?' on':''}" data-f="incorrect">Incorrect <span class="n">(${incorrect})</span></button>
        <button type="button" class="chip${quiz.reviewFilter==='flagged'?' on':''}" data-f="flagged">Flagged <span class="n">(${quiz.flagged.size})</span></button>
      </div>
      <div id="rq-list"></div>
    </div>`;
  root.querySelector('#qagain').onclick=quizSetup;
  const qretake=root.querySelector('#qretake');
  if(qretake)qretake.onclick=()=>{
    const missed=quiz.items.filter(q=>quiz.answers[q.id]&&quiz.answers[q.id]!==q.a);
    if(!missed.length)return;
    startRetake(missed,'Questions you missed');
  };
  const qretakeSkip=root.querySelector('#qretake-skip');
  if(qretakeSkip)qretakeSkip.onclick=()=>{
    const skippedQs=quiz.items.filter(q=>!quiz.answers[q.id]);
    if(!skippedQs.length)return;
    startRetake(skippedQs,'Questions you skipped');
  };
  wireExamModeToggle(root);
  wireDonateModal(root,'rdonate');
  root.querySelectorAll('#rq-filter .chip').forEach(b=>{
    b.onclick=()=>{
      quiz.reviewFilter=b.dataset.f;
      root.querySelectorAll('#rq-filter .chip').forEach(x=>x.classList.toggle('on',x===b));
      renderReviewList();
    };
  });
  renderReviewList();
}

/* ---------- retake missed questions ---------- */
let retake=null;
function startRetake(items,label){
  retake={items:shuffle(items.slice()),i:0,answers:{},startedAt:Date.now(),mode:examMode,label:label||'Questions you missed'};
  retakeQ();
}
function goToRetakeQuestion(idx){
  retake.i=Math.max(0,Math.min(idx,retake.items.length-1));
  retakeQ();
}
function retakeScoreSoFar(){
  let correct=0,answered=0;
  retake.items.forEach(q=>{ if(retake.answers[q.id]!==undefined){ answered++; if(retake.answers[q.id]===q.a)correct++; } });
  return {correct,answered};
}
function retakeHeaderHtml(){
  const s=retakeScoreSoFar();
  const track=retake.items.map((q,i)=>{
    let cls='';
    const a=retake.answers[q.id];
    if(a!==undefined)cls=a===q.a?'good':'bad';
    else if(i===retake.i)cls='current';
    return `<i class="${cls}"></i>`;
  }).join('');
  return `<div class="rt-top">
    <div class="rt-toprow">
      <h3 class="rt-title"><span class="rt-tag">Retake</span> ${retake.label}</h3>
      <span class="rt-score">${s.answered?s.correct+' / '+s.answered+' correct so far':''}</span>
    </div>
    <div class="rt-progress">${track}</div>
  </div>`;
}
function retakeQ(){
  const q=retake.items[retake.i]; const root=document.getElementById('quiz-root');
  const chosen=retake.answers[q.id]; const answered=chosen!==undefined;
  const isLast=retake.i===retake.items.length-1;
  const reveal=retake.mode!=='blind';
  const optsHtml=['A','B','C','D'].filter(L=>q.o[L]).map(L=>{
    let cls='rt-opt';
    if(reveal&&answered){
      if(L===chosen&&L===q.a)cls+=' pick-good';
      else if(L===chosen&&L!==q.a)cls+=' pick-bad';
      else if(L===q.a)cls+=' reveal-correct';
      else cls+=' dim';
    } else if(!reveal&&L===chosen)cls+=' selected';
    const disabled=reveal&&answered;
    return `<button type="button" class="${cls}" data-l="${L}"${disabled?' disabled':''}><span class="rt-lt">${L}</span><span class="rt-ot">${esc(q.o[L])}</span></button>`;
  }).join('');
  let resultHtml='';
  if(reveal&&answered){
    const isGood=chosen===q.a;
    resultHtml=`<div class="rt-result ${isGood?'good':'bad'}"><span class="rt-dot"></span>${isGood?'Correct.':'Not this time — correct answer is '+q.a+'.'}</div>`;
    resultHtml+=q.w?`<div class="rt-why">${esc(q.w)}</div>`:`<div class="rt-why empty">No saved explanation for this one.</div>`;
  }
  const footHtml=reveal
    ? (answered?`<div class="rt-foot"><button class="btn" id="rtnext">${isLast?'See results':'Next question'}</button></div>`:'')
    : `<div class="rt-foot" style="justify-content:space-between"><button class="btn ghost" id="rtprev"${retake.i===0?' disabled':''}>← Previous</button><button class="btn" id="rtnext">${isLast?'See results':'Next →'}</button></div>`;
  root.innerHTML=retakeHeaderHtml()+`
    <div class="rt-card">
      <div class="rt-cardhead"><span class="rt-qn">Question ${retake.i+1} of ${retake.items.length}</span><span class="rt-domain">${esc(q.c||'')}</span></div>
      <div class="rt-qtext">${esc(q.q)}</div>
      <div class="rt-opts">${optsHtml}</div>
      ${resultHtml}
      ${footHtml}
    </div>`;
  if(reveal){
    if(!answered){
      root.querySelectorAll('.rt-opt').forEach(btn=>{ btn.onclick=()=>{ retake.answers[q.id]=btn.dataset.l; retakeQ(); }; });
    } else {
      const nb=root.querySelector('#rtnext');
      if(nb)nb.onclick=()=>{ if(isLast){ retakeScore(); } else { retake.i++; retakeQ(); } };
    }
  } else {
    root.querySelectorAll('.rt-opt').forEach(btn=>{ btn.onclick=()=>{ retake.answers[q.id]=btn.dataset.l; retakeQ(); }; });
    root.querySelector('#rtprev').onclick=()=>goToRetakeQuestion(retake.i-1);
    root.querySelector('#rtnext').onclick=()=>{ isLast?retakeScore():goToRetakeQuestion(retake.i+1); };
  }
}
function retakeScore(){
  const s=retakeScoreSoFar();
  const wrong=retake.items.filter(q=>retake.answers[q.id]!==undefined&&retake.answers[q.id]!==q.a);
  const stillSkipped=retake.items.filter(q=>retake.answers[q.id]===undefined);
  const misses=wrong.concat(stillSkipped);
  const pct=Math.round(s.correct/retake.items.length*100);
  const root=document.getElementById('quiz-root');
  const missHtml=misses.length
    ? `<div class="rt-misslist">${misses.map(q=>`<div class="rt-missitem"><span class="rt-missdom">${esc(q.c||'')}</span><span class="rt-misstext">${esc(q.q.slice(0,110))}${q.q.length>110?'…':''}</span></div>`).join('')}</div>`
    : `<div class="rt-allclear">All ${retake.items.length} correct this round.</div>`;
  root.innerHTML=`<div class="rt-card">
    <p class="rt-eyebrow">Round complete</p>
    <div class="rt-bigscore"><span class="rt-num">${s.correct}</span><span class="rt-of">/ ${retake.items.length} correct &middot; ${pct}%</span></div>
    ${missHtml}
    <div class="rt-foot" style="justify-content:flex-start">
      <button class="btn" id="rtRetryAll">Retake all ${retake.items.length}</button>
      ${wrong.length?`<button class="btn ghost" id="rtRetryMissed">Retake just the ${wrong.length} missed</button>`:''}
      ${stillSkipped.length?`<button class="btn ghost" id="rtRetrySkipped">Retake just the ${stillSkipped.length} skipped</button>`:''}
      <button class="btn ghost" id="rtBackToExam">Back to exam results</button>
    </div>
  </div>`;
  root.querySelector('#rtRetryAll').onclick=()=>startRetake(retake.items,retake.label);
  const rm=root.querySelector('#rtRetryMissed');
  if(rm)rm.onclick=()=>startRetake(wrong,'Questions you missed');
  const rs=root.querySelector('#rtRetrySkipped');
  if(rs)rs.onclick=()=>startRetake(stillSkipped,'Questions you skipped');
  root.querySelector('#rtBackToExam').onclick=quizScore;
}

/* ---------- utils ---------- */
function esc(s){return (s||'').replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));}
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}

/* ---------- boot ---------- */
(async function(){
  await loadState();
  renderPath(); renderCheat(); renderRail(); renderStudy(); quizSetup();
  const navDonateSlot=document.getElementById('navdonate-slot');
  if(navDonateSlot){
    navDonateSlot.innerHTML=`<span class="exam-donate-wrap">
      <button type="button" class="donate-nav-btn" id="navdonate-btn">☕ Buy me a coffee</button>
      ${donateModalHtml('navdonate')}
    </span>`;
    wireDonateModal(document,'navdonate');
  }
  const railToggle=document.getElementById('rail-toggle');
  if(railToggle){
    railToggle.addEventListener('click',()=>{
      const rail=document.getElementById('study-rail');
      const expanded=rail.classList.toggle('rail-expanded');
      railToggle.setAttribute('aria-expanded',expanded?'true':'false');
    });
  }
  function syncShellNavH(){
    const nav=document.getElementById('shell-nav');
    if(nav)document.documentElement.style.setProperty('--shell-nav-h', nav.offsetHeight+'px');
  }
  syncShellNavH();
  window.addEventListener('resize', syncShellNavH);
  const shellNavEl=document.getElementById('shell-nav');
  if(shellNavEl)new MutationObserver(syncShellNavH).observe(shellNavEl,{attributes:true,attributeFilter:['class']});

  (function(){
    let lastY=window.scrollY, hidden=false;
    const THRESHOLD=8;
    const mq=window.matchMedia('(max-width:640px)');
    function anyNavExpanded(){
      const sn=document.getElementById('shell-nav');
      const tb=document.getElementById('tabs');
      return (sn&&sn.classList.contains('nav-expanded'))||(tb&&tb.classList.contains('nav-expanded'));
    }
    function setHidden(v){
      if(v===hidden)return;
      hidden=v;
      document.documentElement.classList.toggle('headers-hidden',hidden);
    }
    window.addEventListener('scroll',function(){
      if(!mq.matches){ setHidden(false); lastY=window.scrollY; return; }
      const y=window.scrollY;
      if(y<=4){ setHidden(false); lastY=y; return; }
      if(anyNavExpanded()){ lastY=y; return; }
      const delta=y-lastY;
      if(delta>THRESHOLD){ setHidden(true); lastY=y; }
      else if(delta<-THRESHOLD){ setHidden(false); lastY=y; }
    },{passive:true});
  })();
})();

}catch(err){console.error("[CONSOLE]",err);showLoadError(typeof QDATA==='undefined');}
})();

(function(){
"use strict";
try{

  // ----- domain filter -----
  const fbtns = document.querySelectorAll('.fbtn');
  const cards = document.querySelectorAll('.domaincard');
  fbtns.forEach(b=>b.addEventListener('click',()=>{
    fbtns.forEach(x=>x.classList.remove('on'));
    b.classList.add('on');
    const f=b.dataset.f;
    cards.forEach(c=> c.classList.toggle('hidden', f!=='all' && c.dataset.d!==f));
  }));

  // ----- build decoder table from every rule row in the decks -----
  const domainMeta = {
    d1:{label:'D1', color:'var(--d1)'}, d2:{label:'D2', color:'var(--d4)'},
    d3:{label:'D3', color:'var(--d3)'}, d4:{label:'D4', color:'var(--d2)'},
    d5:{label:'D5', color:'var(--d5)'}
  };
  const rows=[];
  cards.forEach(card=>{
    const d=card.dataset.d;
    card.querySelectorAll('.rule').forEach(r=>{
      rows.push({
        d,
        see:r.querySelector('.see').innerHTML,
        ans:r.querySelector('.ans').innerHTML,
        text:(r.querySelector('.see').textContent+' '+r.querySelector('.ans').textContent+' '+d).toLowerCase()
      });
    });
  });
  const body=document.getElementById('decodeBody');
  const countEl=document.getElementById('count');
  const noresult=document.getElementById('noresult');
  function render(list){
    body.innerHTML=list.map(r=>{
      const m=domainMeta[r.d];
      return `<tr><td class="t-see"><span class="dot" style="background:${m.color}"></span>${r.see}</td>`+
             `<td class="t-ans">${r.ans} <span style="color:var(--dim);font-family:'JetBrains Mono',monospace;font-size:10px">${m.label}</span></td></tr>`;
    }).join('');
    countEl.textContent=list.length+' / '+rows.length;
    noresult.classList.toggle('hidden', list.length>0);
  }
  render(rows);
  document.getElementById('search').addEventListener('input',e=>{
    const q=e.target.value.trim().toLowerCase();
    render(q? rows.filter(r=>r.text.includes(q)) : rows);
  });

}catch(err){console.error("[HUB]",err);}
})();

(function(){
"use strict";
try{

const W=1700, H=1700, CX=850, CY=850, R_HUB=220, R_LEAF_MIN=380, R_LEAF_MAX=700;

// domains ordered clockwise from top, by exam weight
const domains=[
  {id:'d1', code:'D1', color:'var(--d1)', hex:'#7aa2ff', w:'27%', name:'Agentic Architecture', leaves:[
    ['a_wfagent','Workflow vs Agent'],['a_patterns','4 Workflow Patterns'],['a_search','Agentic Search'],
    ['a_orch','Orchestrator–Subagent'],['a_parallel','Task = Parallel'],['a_flat','Flat Hierarchy'],['a_goals','Goals > Scripts']
  ]},
  {id:'d3', code:'D3', color:'var(--d3)', hex:'#5fd0a8', w:'20%', name:'Claude Code & Workflows', leaves:[
    ['c_grep','Grep vs Glob'],['c_edit','Read / Edit / Write'],['c_sess','Sessions & Fork'],
    ['c_md','CLAUDE.md'],['c_plan','Plan vs Direct'],['c_caps','Turn / Budget Caps']
  ]},
  {id:'d4', code:'D4', color:'var(--d4)', hex:'#c98bff', w:'20%', name:'Prompt Engineering & Output', leaves:[
    ['p_sys','System Prompt'],['p_fewshot','Few-shot'],['p_prefill','Prefill'],
    ['p_null','Return null'],['p_enum','Enum + other'],['p_choice','tool_choice']
  ]},
  {id:'d2', code:'D2', color:'var(--d2)', hex:'#f7a072', w:'18%', name:'Tool Design & MCP', leaves:[
    ['t_iserr','isError'],['t_structerr','Structured Errors'],['t_desc','Tool Descriptions'],
    ['t_res','MCP Resources'],['t_purpose','Purpose-specific Tools'],['t_idsearch','id + search']
  ]},
  {id:'d5', code:'D5', color:'var(--d5)', hex:'#e56b9e', w:'15%', name:'Context & Reliability', leaves:[
    ['x_stateless','Stateless API'],['x_summary','Progressive Summary'],['x_prune','Prune Context'],
    ['x_batch','Batch API 50%'],['x_hook','Deterministic Hook'],['x_handoff','Structured Handoff']
  ]}
];

// cross-domain synapses: [nodeA, nodeB, label]
const synapses=[
  ['a_orch','x_stateless'],   // explicit context passing
  ['a_orch','x_handoff'],     // structured state / handoff
  ['t_desc','c_grep'],        // descriptions drive tool selection
  ['p_fewshot','t_desc'],     // shape model behaviour via spec/examples
  ['c_sess','x_summary'],     // context continuity
  ['x_hook','t_iserr'],       // guardrails / error handling outside model
  ['a_search','c_grep'],      // retrieval via tools
  ['p_sys','x_prune'],        // context engineering
  ['a_patterns','p_choice']   // control flow decisions
];

const pos={};       // id -> {x,y}
const nodeConn={};  // id -> Set of connected node ids
const edgeRegistry=[]; // {el, a, b}

function polar(cx,cy,r,deg){const a=deg*Math.PI/180;return {x:cx+r*Math.cos(a), y:cy+r*Math.sin(a)};}
function link(a,b){(nodeConn[a]=nodeConn[a]||new Set()).add(b);(nodeConn[b]=nodeConn[b]||new Set()).add(a);}

const svg=document.getElementById('map');
const NS='http://www.w3.org/2000/svg';
function el(t,attrs){const e=document.createElementNS(NS,t);for(const k in attrs)e.setAttribute(k,attrs[k]);return e;}

const gEdges=el('g',{}), gSyn=el('g',{}), gNodes=el('g',{});
svg.append(gSyn,gEdges,gNodes);

// core
pos['core']={x:CX,y:CY};
const nStep=360/domains.length;

domains.forEach((d,i)=>{
  const base=-90+i*nStep;
  const hub=polar(CX,CY,R_HUB,base);
  pos[d.id]=hub;
  link('core',d.id);

  // hub -> leaves fanned across a sector, all on one ring per domain. The
  // ring's radius is solved so the arc is long enough to fit every label at
  // that domain's angular span (plus a gap), capped at R_LEAF_MAX so the
  // whole diagram stays a fixed, scrollable-free-ish size - the busiest
  // domains (D1 especially) may end up with labels sitting close together
  // rather than growing the canvas further to fit them with full clearance.
  const N=d.leaves.length;
  const span=Math.min(68, 44+N*3.4);
  const spanRad=span*Math.PI/180;
  const GAP=18;
  const widths=d.leaves.map(lf=>estW(lf[1]));
  const totalW=widths.reduce((a,b)=>a+b,0)+(N-1)*GAP;
  const rLeaf=Math.min(R_LEAF_MAX, Math.max(R_LEAF_MIN, totalW/spanRad));
  let cum=0;
  d.leaves.forEach((lf,j)=>{
    const frac = N>1 ? (cum+widths[j]/2)/totalW : 0.5;
    cum += widths[j]+GAP;
    const ang = base - span/2 + frac*span;
    const p=polar(CX,CY,rLeaf,ang);
    pos[lf[0]]=p;
    link(d.id,lf[0]);
  });
});
synapses.forEach(s=>link(s[0],s[1]));

// ---- draw structural edges (core->hub, hub->leaf) ----
function drawEdge(aId,bId,color,cls){
  const a=pos[aId],b=pos[bId];
  const e=el('path',{d:`M${a.x} ${a.y} L${b.x} ${b.y}`,class:cls,stroke:color||'var(--line)'});
  (cls==='synapse'?gSyn:gEdges).append(e);
  edgeRegistry.push({el:e,a:aId,b:bId});
}
domains.forEach(d=>{
  drawEdge('core',d.id,d.color,'edge');
  d.leaves.forEach(lf=>drawEdge(d.id,lf[0],d.color,'edge'));
});
// ---- draw synapses as curved arcs bending toward centre ----
synapses.forEach(s=>{
  const a=pos[s[0]],b=pos[s[1]];
  const mx=(a.x+b.x)/2, my=(a.y+b.y)/2;
  // pull control point toward centre for a neuron-like arc
  const cx=mx+(CX-mx)*0.35, cy=my+(CY-my)*0.35;
  const e=el('path',{d:`M${a.x} ${a.y} Q${cx} ${cy} ${b.x} ${b.y}`,class:'synapse',stroke:'var(--signal)'});
  gSyn.append(e);
  edgeRegistry.push({el:e,a:s[0],b:s[1]});
});

// ---- draw nodes ----
const nodeEls={};
function addNode(id,cls){const g=el('g',{class:'node '+cls,'data-id':id});gNodes.append(g);nodeEls[id]=g;return g;}

// core node
(()=>{
  const g=addNode('core','core');
  g.append(el('circle',{cx:CX,cy:CY,r:60}));
  const t=el('text',{x:CX,y:CY-3,'text-anchor':'middle','font-size':'24',fill:'var(--text)'});t.textContent='CCA-F';
  const t2=el('text',{x:CX,y:CY+21,'text-anchor':'middle','font-size':'13',fill:'var(--muted)','font-family':'JetBrains Mono, monospace'});t2.textContent='60 Q · 5 domains';
  g.append(t,t2);
})();

// hubs
domains.forEach(d=>{
  const p=pos[d.id], g=addNode(d.id,'hub');
  g.append(el('circle',{cx:p.x,cy:p.y,r:44,fill:'var(--surface)',stroke:d.color,'stroke-width':2}));
  const t=el('text',{x:p.x,y:p.y-1,'text-anchor':'middle','font-size':'20',fill:d.color});t.textContent=d.code;
  const t2=el('text',{x:p.x,y:p.y+18,'text-anchor':'middle','font-size':'13',fill:'var(--muted)','font-family':'JetBrains Mono, monospace'});t2.textContent=d.w;
  g.append(t,t2);
  // domain name arc label just outside hub, toward centre side
});

// leaves
function estW(txt){return Math.max(84, txt.length*7.8+23);}
domains.forEach(d=>{
  d.leaves.forEach(lf=>{
    const p=pos[lf[0]], g=addNode(lf[0],'leaf');
    const w=estW(lf[1]), h=34;
    g.append(el('rect',{x:p.x-w/2,y:p.y-h/2,width:w,height:h,rx:10,ry:10,class:'leaf-box',fill:'var(--surface)',stroke:d.color}));
    const t=el('text',{x:p.x,y:p.y+5,'text-anchor':'middle',fill:'var(--text)'});t.textContent=lf[1];
    g.append(t);
  });
});

// ---- interactivity: fire a node's connections ----
let locked=null;
function reachable(id){ // node + direct neighbours
  const set=new Set([id]);
  (nodeConn[id]||[]).forEach(n=>set.add(n));
  return set;
}
function fire(id){
  const keep=reachable(id);
  Object.entries(nodeEls).forEach(([nid,g])=>{
    g.classList.toggle('dim', !keep.has(nid));
    g.classList.toggle('lit', keep.has(nid));
  });
  edgeRegistry.forEach(({el,a,b})=>{
    const on=(a===id||b===id);
    el.classList.toggle('lit', on);
    el.classList.toggle('dim', !on);
  });
}
function reset(){
  Object.values(nodeEls).forEach(g=>g.classList.remove('dim','lit'));
  edgeRegistry.forEach(({el})=>el.classList.remove('dim','lit'));
}
Object.entries(nodeEls).forEach(([id,g])=>{
  g.addEventListener('mouseenter',()=>{if(!locked)fire(id);});
  g.addEventListener('mouseleave',()=>{if(!locked)reset();});
  g.addEventListener('click',e=>{e.stopPropagation();locked=(locked===id)?null:id;locked?fire(id):reset();});
});
svg.addEventListener('click',()=>{locked=null;reset();});

// ---- legend toggles whole domains ----
const legend=document.getElementById('legend');
domains.forEach(d=>{
  const b=document.createElement('div');b.className='lg';b.dataset.d=d.id;
  b.innerHTML=`<span class="sw" style="background:${d.hex}"></span>${d.code} · ${d.name} <span style="color:var(--dim)">${d.w}</span>`;
  b.addEventListener('click',()=>{
    b.classList.toggle('off');
    const hide=b.classList.contains('off');
    // hide/show this domain's hub+leaves and their structural edges
    const ids=new Set([d.id,...d.leaves.map(l=>l[0])]);
    ids.forEach(id=>{if(nodeEls[id])nodeEls[id].style.display=hide?'none':'';});
    edgeRegistry.forEach(({el,a,b})=>{
      if(ids.has(a)||ids.has(b)) el.style.display=hide?'none':'';
    });
  });
  legend.append(b);
});

}catch(err){console.error("[MAP]",err);}
})();

(function(){
"use strict";
try{

  const KEY='ccaf_plan_progress_v1';
  const items=[...document.querySelectorAll('.tasks li')];
  const total=items.length;
  const fill=document.getElementById('fill'), pct=document.getElementById('pct');
  const statusEl=document.getElementById('storageStatus');
  const fallbackBar=document.getElementById('fallbackBar');
  const fallbackMsg=document.getElementById('fallbackMsg');
  let state={};
  let canPersist=false;

  function setStatus(kind,msg){ statusEl.className='storage-status '+kind; statusEl.textContent=msg; }

  function paint(){
    let done=0;
    items.forEach(li=>{ const on=!!state[li.dataset.t]; li.classList.toggle('on',on); if(on)done++; });
    const p=Math.round(done/total*100);
    fill.style.width=p+'%'; pct.textContent=p+'%';
  }

  // Probe whether localStorage actually works in THIS context (fails on some file:// setups).
  function storageWorks(){
    try{
      const t='__ccaf_test__';
      localStorage.setItem(t,'1');
      localStorage.removeItem(t);
      return true;
    }catch(e){ return false; }
  }

  function save(){
    if(!canPersist) return;
    try{ localStorage.setItem(KEY, JSON.stringify(state)); }
    catch(e){ canPersist=false; enterFallback('Saving stopped working — use the save-file buttons below.'); }
  }
  function load(){
    try{ const raw=localStorage.getItem(KEY); if(raw) state=JSON.parse(raw); }catch(e){ state={}; }
  }

  function enterFallback(msg){
    fallbackBar.classList.add('show');
    fallbackMsg.textContent = msg || 'This browser blocks automatic saving for files opened directly (common with Safari, or file:// pages). Use these buttons to keep your progress:';
    setStatus('fail','⚠ Automatic saving is unavailable here — manual save-file is ready below.');
  }

  items.forEach(li=>li.addEventListener('click',()=>{
    const id=li.dataset.t;
    state[id]=!state[id]; if(!state[id])delete state[id];
    paint(); save();
  }));

  document.getElementById('reset').addEventListener('click',()=>{ state={}; paint(); save(); });

  // ---- manual save-file fallback (works even when localStorage is blocked) ----
  document.getElementById('fbDownload').addEventListener('click',()=>{
    const payload=JSON.stringify({app:'ccaf-2week-plan',done:Object.keys(state).filter(k=>state[k]).sort()},null,2);
    const blob=new Blob([payload],{type:'application/json'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a'); a.href=url; a.download='ccaf-progress.json';
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  });
  const fbInput=document.getElementById('fbInput');
  document.getElementById('fbLoad').addEventListener('click',()=>fbInput.click());
  fbInput.addEventListener('change',e=>{
    const f=e.target.files[0]; if(!f) return;
    const r=new FileReader();
    r.onload=ev=>{
      try{
        const d=JSON.parse(ev.target.result);
        state={}; (d.done||[]).forEach(id=>{ if(items.some(li=>li.dataset.t===id)) state[id]=true; });
        paint(); save();
        setStatus('ok','✓ Loaded '+Object.keys(state).length+' item(s) from save-file.');
      }catch(err){ setStatus('fail','Could not read that save-file.'); }
    };
    r.readAsText(f); fbInput.value='';
  });

  // ---- init ----
  canPersist = storageWorks();
  if(canPersist){
    load(); paint();
    const n=Object.keys(state).filter(k=>state[k]).length;
    setStatus('ok', n>0 ? ('✓ Loaded '+n+' saved item(s) — this browser is remembering your progress.')
                        : 'Auto-save is on. Check things off and this browser will remember them next time.');
  } else {
    paint();
    enterFallback();
  }

}catch(err){console.error("[PLAN]",err);}
})();

(function(){
    var LANG_DATA={};
  var loadToken=0;
  function loadLang(code,cb){
    if(code==='en'||LANG_DATA[code]){cb();return;}
    var myToken=++loadToken;
    var s=document.createElement('script');
    s.src='translations/'+code+'.js';
    s.onload=function(){
      if(myToken!==loadToken)return;
      LANG_DATA[code]=window['__LANG_'+code.toUpperCase()+'__'];
      cb();
    };
    s.onerror=function(){ if(myToken===loadToken) cb(); };
    document.head.appendChild(s);
  }

  var lang='en', busy=false;
  function norm(s){ return s.trim().replace(/\s+/g,' '); }
  var DYNAMIC_PATTERNS=[
    [/^(\d+)\s+Qs$/, function(m,d){ return d.qsUnit ? m[1]+(d.noSpaceBeforeUnit?'':' ')+d.qsUnit : null; }],
    [/^Question\s+(\d+)\s+of\s+(\d+)$/, function(m,d){ return d.questionFmt ? d.questionFmt(m[1],m[2]) : null; }],
    [/^(\d+)\s*\/\s*(\d+)\s+correct so far$/, function(m,d){ return d.scoreSoFarFmt ? d.scoreSoFarFmt(m[1],m[2]) : null; }],
    [/^\/\s*(\d+)\s+correct\s*·\s*(\d+)%$/, function(m,d){ return d.bigScoreFmt ? d.bigScoreFmt(m[1],m[2]) : null; }],
    [/^All\s+(\d+)\s+correct this round\.$/, function(m,d){ return d.allCorrectFmt ? d.allCorrectFmt(m[1]) : null; }],
    [/^Retake all\s+(\d+)$/, function(m,d){ return d.retakeAllFmt ? d.retakeAllFmt(m[1]) : null; }],
    [/^Retake just the\s+(\d+)\s+missed$/, function(m,d){ return d.retakeMissedFmt ? d.retakeMissedFmt(m[1]) : null; }],
    [/^Retake just the\s+(\d+)\s+skipped$/, function(m,d){ return d.retakeSkippedFmt ? d.retakeSkippedFmt(m[1]) : null; }],
    [/^Not this time — correct answer is\s+([A-D])\.$/, function(m,d){ return d.notThisTimeFmt ? d.notThisTimeFmt(m[1]) : null; }],
    [/^(\d+)\s+questions available$/, function(m,d){ return d.questionsAvailableFmt ? d.questionsAvailableFmt(m[1]) : null; }]
  ];
  function translateNode(n){
    var raw=(n.__en!=null)?n.__en:n.nodeValue;
    if(!raw||!raw.trim())return;
    var d=LANG_DATA[lang]||{};
    var map=d.i18n||{};
    var key=norm(raw), tr=map[key];
    if(tr==null){
      for(var i=0;i<DYNAMIC_PATTERNS.length && tr==null;i++){
        var m=key.match(DYNAMIC_PATTERNS[i][0]);
        if(m) tr=DYNAMIC_PATTERNS[i][1](m,d);
      }
    }
    if(tr!=null){
      if(n.__en==null)n.__en=n.nodeValue;
      var m=raw.match(/^(\s*)([\s\S]*?)(\s*)$/);
      var out=m[1]+tr+m[3];
      if(n.nodeValue!==out)n.nodeValue=out;
    }
  }
  function restoreNode(n){ if(n.__en!=null && n.nodeValue!==n.__en) n.nodeValue=n.__en; }
  function walk(root,fn){
    var w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:function(n){
      if(!n.nodeValue||!n.nodeValue.trim())return NodeFilter.FILTER_REJECT;
      var p=n.parentNode;
      while(p&&p.nodeType===1){
        var t=p.tagName;
        if(t==='SCRIPT'||t==='STYLE')return NodeFilter.FILTER_REJECT;
        if(p.hasAttribute&&p.hasAttribute('data-noi18n'))return NodeFilter.FILTER_REJECT;
        p=p.parentNode;
      }
      return NodeFilter.FILTER_ACCEPT;
    }});
    var n,list=[]; while(n=w.nextNode())list.push(n);
    list.forEach(fn);
  }
  function applyAll(){
    if(busy)return; busy=true;
    var panes=document.getElementById('shell-panes')||document.body;
    walk(panes, lang==='en'?restoreNode:translateNode);
    var navDonate=document.getElementById('navdonate-slot');
    if(navDonate) walk(navDonate, lang==='en'?restoreNode:translateNode);
    document.querySelectorAll('[data-i18n-shell]').forEach(function(el){
      var k=el.getAttribute('data-i18n-shell');
      var shell=(LANG_DATA[lang]&&LANG_DATA[lang].shell);
      if(shell&&shell[k]!=null) el.textContent=shell[k];
      else if(el.getAttribute('data-en')!=null) el.textContent=el.getAttribute('data-en');
    });
    busy=false;
  }
  var mo=null;
  function startObserver(){
    var panes=document.getElementById('shell-panes'); if(!panes)return;
    mo=new MutationObserver(function(){
      if(lang==='en')return;
      if(window.__i18nRaf)cancelAnimationFrame(window.__i18nRaf);
      window.__i18nRaf=requestAnimationFrame(applyAll);
    });
    mo.observe(panes,{childList:true,subtree:true});
  }
  function getLangConfig(){
    var src=(window.CCAF_LANG_CONFIG&&typeof window.CCAF_LANG_CONFIG==='object')?window.CCAF_LANG_CONFIG:{};
    var cfg={}; for(var k in src){ if(Object.prototype.hasOwnProperty.call(src,k)) cfg[k]=src[k]; }
    cfg.en=true;
    return cfg;
  }
  function buildLangOptions(cfg){
    var sel=document.getElementById('lang-select'); if(!sel)return;
    var meta=(window.CCAF_LANG_META&&typeof window.CCAF_LANG_META==='object')?window.CCAF_LANG_META:{en:{nativeName:'English'}};
    sel.innerHTML='';
    Object.keys(meta).forEach(function(code){
      if(cfg[code]===false)return;
      var opt=document.createElement('option');
      opt.value=code;
      opt.textContent=meta[code].nativeName||code;
      sel.appendChild(opt);
    });
  }
  window.__setLang__=function(l){
    lang=l;
    var sel=document.getElementById('lang-select'); if(sel) sel.value=l;
    safeSet('ccaf_lang',l);
    loadLang(l, function(){
      var isRtl=LANG_DATA[l] && LANG_DATA[l].dir==='rtl';
      document.documentElement.setAttribute('dir', isRtl?'rtl':'ltr');
      applyAll();
    });
  };
  var __langCfg = getLangConfig();
  buildLangOptions(__langCfg);
  window.addEventListener('load',function(){
    var cfg=__langCfg;
    var saved=safeGet('ccaf_lang','en');
    var original=saved;
    if(cfg[saved]===false) saved='en';
    setTimeout(function(){
      startObserver();
      try { window.__setLang__(saved); }
      finally { if(saved!==original){ safeSet('ccaf_lang',original); } }
    },150);
  });
})();

(function(){
  var mq=window.matchMedia?window.matchMedia('(prefers-color-scheme: light)'):null;
  function resolve(pref){
    if(pref==='system') return (mq&&mq.matches)?'light':'dark';
    return pref;
  }
  function apply(pref){
    document.documentElement.setAttribute('data-theme', resolve(pref));
    document.querySelectorAll('#theme-toggle button').forEach(function(b){b.classList.toggle('on',b.dataset.theme===pref);});
    safeSet('ccaf_theme',pref);
  }
  window.__setTheme__=function(t){ apply(t); };
  if(mq&&mq.addEventListener){
    mq.addEventListener('change',function(){
      var saved=safeGet('ccaf_theme','system');
      if(saved==='system') apply('system');
    });
  }
  var saved=safeGet('ccaf_theme','dark');
  apply(saved);
})();
