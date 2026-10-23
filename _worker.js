const SECURITY_HEADERS = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
};

async function serveAssets(request, env) {
  const res = await env.ASSETS.fetch(request);
  const out = new Response(res.body, res);
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) {
    out.headers.set(k, v);
  }
  return out;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Interne Arbeitsdateien (CLAUDE.md, Leitfäden, README) nicht öffentlich ausliefern
    if (url.pathname.toLowerCase().endsWith('.md')) {
      return new Response('Not found', { status: 404, headers: { 'Content-Type': 'text/plain; charset=utf-8', ...SECURITY_HEADERS } });
    }

    // Länderseiten im alten Design vorübergehend gesperrt (im Menü ausgegraut)
    if (/^\/(vietnam|japan|singapur|kambodscha|laos|philippinen)(\.html)?\/?$/i.test(url.pathname)) {
      return new Response(null, { status: 302, headers: { 'Location': '/laenderguides', 'Cache-Control': 'no-store', ...SECURITY_HEADERS } });
    }

    if (url.pathname === '/functions/newsletter' || url.pathname === '/newsletter') {
      const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
      };

      if (request.method === 'OPTIONS') {
        return new Response(null, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
          }
        });
      }

      if (request.method === 'POST') {
        try {
          const body = await request.json();
          const { email, vorname = '', quelle = 'newsletter' } = body;

          if (!email) {
            return new Response(JSON.stringify({ error: 'Fehlende E-Mail' }), { status: 400, headers: corsHeaders });
          }

          const isPdf = quelle === 'packliste';
          // Anmeldung über die Brevo-Formulare mit Double-Opt-in (Bestätigungsmail und Weiterleitung sind dort eingestellt)
          const formUrl = isPdf
            ? 'https://ba178a4e.sibforms.com/serve/MUIFAGRoVCgZjWveO584eiJaJNZhSs_QxlkpczLhJnd2Y3UMVxKBf-1ne6uHNIeJFVOVobaq3c89qrsqyKvJjZJNqb4yT0zxcJ68CEZxrs831oZZkKl7apVMeBGqzR0okEJ-UiLHWOx-7bcjnidisTbJqhqdAtBnGNWu-tkgQBFD2a4Hdouf8VhbO4gJZrwmlMci3bxQePoEAObphQ=='
            : 'https://ba178a4e.sibforms.com/serve/MUIFAKCvcmrmBn6mVyiHyiOnT9yIb12nFVfqtxizRQ7Em4XpcyowPOyZoYLSYn97wPW7WvOogHhMpwQZZ7Q3Gn4DNy4eaucbE_g4IufwxBwHF1O36qhY0NEBGw0GyZ8Gp8kVS5lnr1Yqhq84iny3lC-VUKY-WoVf3GlixKjUFN67CaCzDzdK0ksEdAV7a6tcj9Orwxb3mXZ5kUtFew==';

          const formRes = await fetch(formUrl + '?isAjax=1', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json' },
            body: new URLSearchParams({ EMAIL: email, email_address_check: '', locale: 'de' }).toString()
          });
          let ok = false, message = '';
          try { const d = await formRes.json(); ok = !!d.success; message = d.message || ''; } catch (_) {}

          // status 201 bleibt das Erfolgssignal, auf das die Formulare auf den Seiten warten
          return new Response(JSON.stringify({ status: ok ? 201 : formRes.status, message }), { status: 200, headers: corsHeaders });
        } catch (e) {
          return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
        }
      }

      if (request.method !== 'POST') {
        return serveAssets(request, env);
      }

      return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: corsHeaders });
    }

    return serveAssets(request, env);
  }
};
