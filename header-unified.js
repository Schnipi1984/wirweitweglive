(function(){
var menuToggle=document.querySelector('.menu-toggle');
  var nav=document.getElementById('nav');
  menuToggle.addEventListener('click',()=>{var open=nav.classList.toggle('is-open');menuToggle.setAttribute('aria-expanded',String(open));menuToggle.textContent=open?'Schliessen':'Menü'});
  var mobileNav=()=>getComputedStyle(menuToggle).display!=='none'||matchMedia('(hover:none)').matches;
  nav.querySelectorAll('[data-parent]').forEach(a=>a.addEventListener('click',e=>{if(!mobileNav())return;var host=a.parentElement;if(!host.classList.contains('open')){e.preventDefault();e.stopPropagation();host.parentElement.querySelectorAll(':scope>.open').forEach(x=>x.classList.remove('open'));host.classList.add('open')}}));
  nav.querySelectorAll('a:not([data-parent])').forEach(link=>link.addEventListener('click',()=>{nav.classList.remove('is-open');menuToggle.setAttribute('aria-expanded','false');menuToggle.textContent='Menü'}));
})();
