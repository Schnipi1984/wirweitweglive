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
    function gtag(){window.dataLayer.push(arguments);}
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID);
  }

  function loadTP(){
    if(window._tpLoaded) return;
    window._tpLoaded = true;
    var s = document.createElement('script');
    s.async = true;
    s.setAttribute('data-cmp-ab', '2');
    s.src = 'https://tp-em.com/NTk2MjIy.js?t=596222';
    document.head.appendChild(s);
  }

  function loadAll(){
    loadGA();
    loadTP();
  }

  function removeBanner(){
    var b = document.getElementById('wwwconsent');
    if(b) b.remove();
  }

  function withdraw(){
    setCookie(COOKIE, 'no', 365);
    window['ga-disable-' + GA_ID] = true;
    document.cookie = '_ga=;Max-Age=0;path=/;SameSite=Lax';
    document.cookie = '_ga_' + GA_ID.replace('G-', '') + '=;Max-Age=0;path=/;SameSite=Lax';
    window.location.reload();
  }

  window.wwwWithdrawAnalyticsConsent = withdraw;

  function showBanner(){
    var css = '#wwwconsent{position:fixed;bottom:0;left:0;right:0;z-index:9999;background:#fff;border-top:1px solid #d8d3c7;padding:1.1rem max(1.25rem,calc((100vw - 1240px)/2 + 1.75rem));display:flex;align-items:center;justify-content:space-between;gap:1.1rem 2rem;flex-wrap:wrap;font-family:Tajawal,\'DM Sans\',Arial,sans-serif;font-size:1.02rem;line-height:1.55;color:#162f2c;box-shadow:0 -10px 30px rgba(22,60,58,.12);}#wwwconsent p{margin:0;flex:1;min-width:260px;max-width:820px;}#wwwconsent p a{color:#147b76;font-weight:700;text-decoration:underline;text-underline-offset:3px;}#wwwconsent p a:hover{color:#163c3a;}#wwwconsent-btns{display:flex;gap:.7rem;flex-shrink:0;}#wwwconsent-btns button{min-height:46px;padding:0 1.5rem;border-radius:4px;font-family:Tajawal,\'DM Sans\',Arial,sans-serif;font-weight:700;font-size:.95rem;letter-spacing:.01em;cursor:pointer;transition:background .2s,color .2s,border-color .2s;}#wwwconsent-accept{background:#163c3a;color:#fff;border:1px solid #163c3a;}#wwwconsent-accept:hover{background:#147b76;border-color:#147b76;}#wwwconsent-decline{background:#fff;color:#163c3a;border:1px solid #163c3a;}#wwwconsent-decline:hover{background:#e8f3f1;}#wwwconsent-btns button:focus-visible{outline:3px solid #91dad5;outline-offset:2px;}@media(max-width:600px){#wwwconsent{padding:1rem 1.25rem 1.1rem;}#wwwconsent-btns{width:100%;}#wwwconsent-btns button{flex:1;padding:0 .8rem;}}';
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    var banner = document.createElement('div');
    banner.id = 'wwwconsent';
    banner.innerHTML = '<p>Wir nutzen Google Analytics, um zu verstehen, welche Inhalte euch helfen, und Travelpayouts, damit unsere Partner-Links funktionieren. Beides laden wir erst nach deinem OK. <a href="/datenschutz.html">Mehr erfahren</a></p><div id="wwwconsent-btns"><button id="wwwconsent-decline">Ablehnen</button><button id="wwwconsent-accept">OK, einverstanden</button></div>';
    document.body.appendChild(banner);

    document.getElementById('wwwconsent-accept').onclick = function(){
      setCookie(COOKIE, 'yes', 365);
      loadAll();
      removeBanner();
    };
    document.getElementById('wwwconsent-decline').onclick = function(){
      setCookie(COOKIE, 'no', 365);
      removeBanner();
    };
  }

  var consent = getCookie(COOKIE);
  if(consent === 'yes'){
    loadAll();
  } else if(consent !== 'no'){
    if(document.readyState === 'loading'){
      document.addEventListener('DOMContentLoaded', showBanner);
    } else {
      showBanner();
    }
  }
})();
