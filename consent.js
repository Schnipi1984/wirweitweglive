(function(){
  var GA_ID = 'G-1HJNKXTYYZ';
  var COOKIE = 'wwwconsent';

  function getCookie(name){
    var m = document.cookie.match('(?:^|;)\\s*'+name+'=([^;]*)');
    return m ? decodeURIComponent(m[1]) : null;
  }
  function setCookie(name, val, days){
    var d = new Date();
    d.setTime(d.getTime() + days*86400000);
    document.cookie = name+'='+encodeURIComponent(val)+';expires='+d.toUTCString()+';path=/;SameSite=Lax';
  }

  function loadGA(){
    if(window._gaLoaded) return;
    window._gaLoaded = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID);
  }

  function removeBanner(){
    var b = document.getElementById('wwwconsent');
    if(b) b.remove();
  }

  function showBanner(){
    var css = '#wwwconsent{position:fixed;bottom:0;left:0;right:0;z-index:9999;background:#fff;border-top:1px solid #e6e3dc;padding:1rem 1.5rem;display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap;font-family:\'Nunito\',sans-serif;font-size:.85rem;color:#5a5550;box-shadow:0 -4px 20px rgba(0,0,0,.08);}#wwwconsent p{margin:0;flex:1;min-width:220px;}#wwwconsent p a{color:#2d6a4f;font-weight:700;}#wwwconsent-btns{display:flex;gap:.65rem;flex-shrink:0;}#wwwconsent-accept{background:#2d6a4f;color:#fff;border:none;border-radius:100px;padding:.5rem 1.25rem;font-family:\'Nunito\',sans-serif;font-weight:700;font-size:.85rem;cursor:pointer;}#wwwconsent-decline{background:none;border:1px solid #e6e3dc;border-radius:100px;padding:.5rem 1.25rem;font-family:\'Nunito\',sans-serif;font-weight:700;font-size:.85rem;cursor:pointer;color:#5a5550;}';
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    var banner = document.createElement('div');
    banner.id = 'wwwconsent';
    banner.innerHTML = '<p>Wir nutzen Google Analytics um zu verstehen, welche Inhalte euch helfen. Kein Tracking ohne dein OK. <a href="/datenschutz">Mehr erfahren</a></p><div id="wwwconsent-btns"><button id="wwwconsent-decline">Ablehnen</button><button id="wwwconsent-accept">OK, einverstanden</button></div>';
    document.body.appendChild(banner);

    document.getElementById('wwwconsent-accept').onclick = function(){
      setCookie(COOKIE, 'yes', 365);
      loadGA();
      removeBanner();
    };
    document.getElementById('wwwconsent-decline').onclick = function(){
      setCookie(COOKIE, 'no', 365);
      removeBanner();
    };
  }

  var consent = getCookie(COOKIE);
  if(consent === 'yes'){
    loadGA();
  } else if(consent !== 'no'){
    if(document.readyState === 'loading'){
      document.addEventListener('DOMContentLoaded', showBanner);
    } else {
      showBanner();
    }
  }
})();
