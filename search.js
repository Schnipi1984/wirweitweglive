(function(){
'use strict';
var IDX=null,loading=null,overlay,input,list,btns=[],active=-1,lastFocus=null;
function norm(s){return String(s).toLowerCase().replace(/ä/g,'a').replace(/ö/g,'o').replace(/ü/g,'u').replace(/ß/g,'ss').normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,' ').trim()}
function alt(t){return t.replace(/ae/g,'a').replace(/oe/g,'o').replace(/ue/g,'u')}
function has(h,t,t2){return h.indexOf(t)>-1||(t2!==t&&h.indexOf(t2)>-1)}
function esc(s){return s.replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function load(){
  if(IDX)return Promise.resolve(IDX);
  if(loading)return loading;
  loading=fetch('/data/search-index.json').then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(d){
    d.pages.forEach(function(p){p.n=norm(p.t+' '+p.d)});
    d.secs.forEach(function(s){s.hn=norm(s[1]);s.tn=norm(s[3])});
    IDX=d;return d;
  });
  return loading;
}
function build(){
  overlay=document.createElement('div');overlay.className='ws-overlay';overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-label','Suche');
  overlay.innerHTML='<div class="ws-box"><div class="ws-head"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg><input class="ws-input" type="search" placeholder="Suchen" aria-label="Suchbegriff" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="search"><button type="button" class="ws-close">Schliessen</button></div><ul class="ws-list" role="listbox" aria-label="Suchergebnisse"></ul></div>';
  document.body.appendChild(overlay);
  input=overlay.querySelector('.ws-input');list=overlay.querySelector('.ws-list');
  overlay.addEventListener('mousedown',function(e){if(e.target===overlay)close()});
  overlay.querySelector('.ws-close').addEventListener('click',close);
  input.addEventListener('input',run);
  overlay.addEventListener('keydown',function(e){
    if(e.key==='Escape'){e.preventDefault();close();return}
    var items=list.querySelectorAll('a');
    if(e.key==='ArrowDown'||e.key==='ArrowUp'){if(!items.length)return;e.preventDefault();active=(active+(e.key==='ArrowDown'?1:-1)+items.length)%items.length;mark(items)}
    else if(e.key==='Enter'){var a=items[active>=0?active:0];if(a){e.preventDefault();location.href=a.href}}
    else if(e.key==='Tab'){var f=overlay.querySelectorAll('input,button,a');if(!f.length)return;var first=f[0],last=f[f.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}
  });
  hint('Tipp einen Begriff ein, zum Beispiel Roller, Wetter, Visum oder Ko Chang.');
}
function mark(items){items.forEach(function(a,i){a.classList.toggle('is-active',i===active);if(i===active)a.scrollIntoView({block:'nearest'})})}
function hint(t){list.innerHTML='<li class="ws-hint">'+esc(t)+'</li>';active=-1}
function open(e){
  if(e)e.preventDefault();
  if(!overlay)build();
  lastFocus=document.activeElement;
  overlay.classList.add('is-open');document.body.classList.add('ws-lock');
  btns.forEach(function(b){b.setAttribute('aria-expanded','true')});
  input.focus();load().then(function(){if(input.value)run()}).catch(function(){hint('Die Suche ist gerade nicht erreichbar. Bitte versuch es später noch einmal.')});
}
function close(){
  overlay.classList.remove('is-open');document.body.classList.remove('ws-lock');
  btns.forEach(function(b){b.setAttribute('aria-expanded','false')});
  if(lastFocus&&lastFocus.focus)lastFocus.focus();
}
function run(){
  var q=norm(input.value);
  if(q.length<2){hint('Tipp einen Begriff ein, zum Beispiel Roller, Wetter, Visum oder Ko Chang.');return}
  if(!IDX){hint('Suche wird geladen …');return}
  var toks=q.split(' ').filter(Boolean),res=[];
  IDX.secs.forEach(function(s){
    var p=IDX.pages[s[0]],sc=0,ok=true;
    for(var i=0;i<toks.length;i++){
      var t=toks[i],t2=alt(t),a=has(s.hn,t,t2),b=has(p.n,t,t2),c=has(s.tn,t,t2);
      if(!a&&!b&&!c){ok=false;break}
      sc+=(a?6:0)+(b?3:0)+(c?1+Math.min(3,(s.tn.split(t).length-1)*.4):0);
    }
    if(!ok)return;
    if(toks.length>1&&s.hn.indexOf(q)>-1)sc+=8;
    if(s[2]==='' && s[1]==='')sc-=0.5;
    res.push({s:s,p:p,sc:sc});
  });
  res.sort(function(a,b){return b.sc-a.sc});
  var per={},out=[];
  res.forEach(function(r){var k=r.p.u;per[k]=(per[k]||0);if(per[k]<2&&out.length<10){per[k]++;out.push(r)}});
  if(!out.length){hint('Nichts gefunden für «'+input.value.trim()+'». Probier ein anderes Wort oder eine kürzere Schreibweise.');return}
  list.innerHTML=out.map(function(r){
    var s=r.s,url=r.p.u+(s[2]?'#'+s[2]:''),title=s[1]||r.p.t;
    return '<li class="ws-item" role="option"><a href="'+esc(url)+'"><span class="ws-page">'+esc(r.p.t.split(':')[0])+'</span><span class="ws-title">'+hl(title,toks)+'</span><span class="ws-snip">'+snip(s[3]||r.p.d,toks)+'</span></a></li>';
  }).join('');
  active=-1;
}
function hl(t,toks){
  var n=norm(t);if(n.length!==t.length)return esc(t);
  var out='',i=0,lo=t.toLowerCase();
  var ranges=[];toks.forEach(function(k){var j=n.indexOf(k);while(j>-1){ranges.push([j,j+k.length]);j=n.indexOf(k,j+k.length)}});
  ranges.sort(function(a,b){return a[0]-b[0]});
  ranges.forEach(function(r){if(r[0]<i)return;out+=esc(t.slice(i,r[0]))+'<mark>'+esc(t.slice(r[0],r[1]))+'</mark>';i=r[1]});
  return out+esc(t.slice(i));
}
function snip(txt,toks){
  var low=txt.toLowerCase().replace(/ä/g,'a').replace(/ö/g,'o').replace(/ü/g,'u'),pos=-1;
  for(var i=0;i<toks.length;i++){var j=low.indexOf(toks[i]);if(j<0)j=low.indexOf(alt(toks[i]));if(j>-1){pos=j;break}}
  if(pos<0||pos<80)return esc(txt.slice(0,170))+(txt.length>170?'…':'');
  var st=Math.max(0,pos-60),sp=txt.indexOf(' ',st);if(sp>-1&&sp<pos)st=sp+1;
  return '…'+esc(txt.slice(st,st+170))+(st+170<txt.length?'…':'');
}
function init(){
  btns=[].slice.call(document.querySelectorAll('.search-btn'));if(!btns.length)return;
  btns.forEach(function(b){b.addEventListener('click',open);b.addEventListener('pointerenter',function(){load().catch(function(){})},{once:true})});
  document.addEventListener('keydown',function(e){
    if(e.key==='/'&&!/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)&&!document.activeElement.isContentEditable){open(e)}
  });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
