export async function onRequestPost(context) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  try {
    const body = await context.request.json();
    const { email, vorname = '', quelle = 'newsletter' } = body;

    if (!email) {
      return new Response(JSON.stringify({ error: 'Fehlende E-Mail' }), { status: 400, headers: corsHeaders });
    }

    const isPdf = quelle === 'packliste';

    const brevoRes = await fetch('https://api.brevo.com/v3/contacts/doubleOptinConfirmation', {
      method: 'POST',
      headers: {
        'api-key': context.env.BREVO_API_KEY,
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

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
