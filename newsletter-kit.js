// Anmeldungen an /newsletter direkt aus dem Browser an Kit senden (Double-Opt-in läuft in Kit)
(function () {
  var FORMS = { packliste: '10084896', newsletter: '10084905' };
  var origFetch = window.fetch;
  window.fetch = function (input, init) {
    var url = typeof input === 'string' ? input : (input && input.url) || '';
    var method = ((init && init.method) || 'GET').toUpperCase();
    if (method !== 'POST' || !/\/(functions\/)?newsletter\/?$/.test(url.split('?')[0])) {
      return origFetch.apply(this, arguments);
    }
    var data = {};
    try { data = JSON.parse((init && init.body) || '{}'); } catch (e) {}
    var formId = data.quelle === 'packliste' ? FORMS.packliste : FORMS.newsletter;
    var params = new URLSearchParams({ email_address: data.email || '' });
    if (data.vorname) params.set('fields[first_name]', data.vorname);
    return origFetch('https://app.kit.com/forms/' + formId + '/subscriptions', {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    }).then(function (r) { return r.json(); }).then(function (d) {
      var ok = d && d.status === 'success';
      return new Response(JSON.stringify({ status: ok ? 201 : 400 }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    });
  };
})();
