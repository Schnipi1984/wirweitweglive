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
          // Anmeldung über Kit-Formulare mit Double-Opt-in (Bestätigungsmail und Weiterleitung sind in Kit eingestellt)
          const formId = isPdf ? '10084896' : '10084905';
          const params = new URLSearchParams({ email_address: email });
          if (vorname) params.set('fields[first_name]', vorname);

          const kitRes = await fetch('https://app.kit.com/forms/' + formId + '/subscriptions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json' },
            body: params.toString()
          });
          let ok = false, message = '';
          try { const d = await kitRes.json(); ok = d.status === 'success'; message = d.message || ''; } catch (_) {}

          // status 201 bleibt das Erfolgssignal, auf das die Formulare auf den Seiten warten
          return new Response(JSON.stringify({ status: ok ? 201 : kitRes.status, message }), { status: 200, headers: corsHeaders });
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
