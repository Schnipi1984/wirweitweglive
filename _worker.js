export default {
  async fetch(request, env) {
    const url = new URL(request.url);

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

          const brevoRes = await fetch('https://api.brevo.com/v3/contacts/doubleOptinConfirmation', {
            method: 'POST',
            headers: {
              'api-key': env.BREVO_API_KEY,
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              email: email,
              attributes: { VORNAME: vorname },
              includeListIds: [isPdf ? 5 : 2],
              templateId: 2,
              redirectionUrl: isPdf
                ? 'https://wirweitweg.blog/danke-packliste.html'
                : 'https://wirweitweg.blog/danke.html'
            })
          });

          return new Response(JSON.stringify({ status: brevoRes.status }), { status: 200, headers: corsHeaders });
        } catch (e) {
          return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
        }
      }

      if (request.method !== 'POST') {
        return env.ASSETS.fetch(request);
      }

      return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: corsHeaders });
    }

    return env.ASSETS.fetch(request);
  }
};
