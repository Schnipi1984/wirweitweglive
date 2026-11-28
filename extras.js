(function(){
'use strict';
var P='M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z';
function canon(){var l=document.querySelector('link[rel=canonical]');return l?l.href:location.origin+location.pathname}
function best(img){
  var ss=img.getAttribute('srcset'),u=img.getAttribute('src');
  if(ss){var m=0;ss.split(',').forEach(function(c){var p=c.trim().split(/\s+/),w=parseInt(p[1],10)||0;if(w>=m){m=w;u=p[0]}})}
  return new URL(u,location.href).href.replace(/\?.*$/,'');
}
function cur(frame){
  var tr=frame.querySelector('.slider-track'),sl=frame.querySelectorAll('.slide');
  var i=tr&&tr.clientWidth?Math.round(tr.scrollLeft/tr.clientWidth):0;
  return sl[Math.max(0,Math.min(sl.length-1,i))];
}
function href(frame){
  var s=cur(frame);if(!s)return'#';
  var img=s.querySelector('img');if(!img)return'#';
  var sec=frame.closest('section[id]');
  var url=canon()+(sec&&sec.id?'#'+sec.id:'');
  var d=(s.getAttribute('data-cap')||img.alt||'').trim();
  return 'https://www.pinterest.com/pin/create/button/?url='+encodeURIComponent(url)+'&media='+encodeURIComponent(best(img))+'&description='+encodeURIComponent((d?d+' | ':'')+'WirWeitWeg');
}
function init(){
  document.querySelectorAll('[data-slider] .slider-frame').forEach(function(frame){
    if(frame.querySelector('.pin-btn')||!frame.querySelector('.slide img'))return;
    var a=document.createElement('a');
    a.className='pin-btn';a.target='_blank';a.rel='noopener noreferrer';a.href='#';
    a.setAttribute('aria-label','Dieses Foto auf Pinterest merken (öffnet in neuem Tab)');a.title='Auf Pinterest merken';
    a.innerHTML='<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="'+P+'"/></svg>';
    function upd(){a.href=href(frame)}
    a.addEventListener('click',upd);a.addEventListener('pointerdown',upd);a.addEventListener('focus',upd);a.addEventListener('mouseenter',upd);a.addEventListener('touchstart',upd,{passive:true});
    frame.appendChild(a);upd();
  });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
