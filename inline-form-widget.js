/*!
 * Detexi — Bandeau de rappel (bas d'ecran)
 * v3.0
 *
 * v3 : fond blanc (le vert fonce ecrasait la page), 2 champs seulement
 *      (telephone + code postal), accroche courte, champs plus fins.
 *
 * Pose : une seule ligne dans le Footer code du site. Aucun bloc Embed.
 *
 * Comportement :
 *   - apparait apres 1,5 s ou des le premier scroll
 *   - desktop : accroche + telephone + code postal + bouton, sur une ligne
 *   - mobile  : accroche + bouton ; le clic deplie les 2 champs
 *   - fermable ; ne revient pas avant la prochaine session
 *   - remonte automatiquement la bulle de chat Detexi (#_dtxf)
 */
(function () {
  'use strict';

  if (window.__detexiInlineFormLoaded) return;
  window.__detexiInlineFormLoaded = true;

  var ENDPOINT = 'https://max-go.app.n8n.cloud/webhook/detexi-form-inline-r7k2';
  var TOKEN = 'dtx_web_8f3a1c9e2b6d4f7a0e8c3b5d9f2a7e4c';
  var DISMISS_KEY = '_dtxBarClosed';

  var T = {
    nl: {
      pitch: 'Word binnen 24u teruggebeld',
      tel: 'Telefoonnummer',
      cp: 'Postcode',
      cta: 'Bel mij terug',
      sending: 'Versturen…',
      ok: '<b>Bedankt!</b> We bellen u binnen 24u terug.',
      errTel: 'Ongeldig nummer',
      errCp: '4 cijfers',
      errNet: 'Probleem — bel ons op +32 485 28 02 80',
      close: 'Sluiten'
    },
    fr: {
      pitch: 'Soyez rappelé sous 24h',
      tel: 'Téléphone',
      cp: 'Code postal',
      cta: 'Rappelez-moi',
      sending: 'Envoi…',
      ok: '<b>Merci !</b> Nous vous rappelons sous 24h.',
      errTel: 'Numéro invalide',
      errCp: '4 chiffres',
      errNet: 'Problème — appelez-nous au +32 485 28 02 80',
      close: 'Fermer'
    }
  };

  function lang() {
    if (/\/fr-be(\/|$)/i.test(location.pathname)) return 'fr';
    var h = (document.documentElement.getAttribute('lang') || '').toLowerCase();
    return h.indexOf('fr') === 0 ? 'fr' : 'nl';
  }

  function param(n) {
    try { return new URLSearchParams(location.search).get(n) || ''; } catch (e) { return ''; }
  }

  function attribution() {
    var o = { gclid: '', utm_source: '', utm_medium: '', utm_campaign: '' };
    try {
      var raw = localStorage.getItem('dtx_attrib');
      if (raw) {
        var a = JSON.parse(raw);
        o.gclid = a.gclid || ''; o.utm_source = a.utm_source || '';
        o.utm_medium = a.utm_medium || ''; o.utm_campaign = a.utm_campaign || '';
      }
    } catch (e) {}
    o.gclid = o.gclid || param('gclid');
    o.utm_source = o.utm_source || param('utm_source');
    o.utm_medium = o.utm_medium || param('utm_medium');
    o.utm_campaign = o.utm_campaign || param('utm_campaign');
    return o;
  }

  var CSS = [
    '#dtxbar,#dtxbar *{box-sizing:border-box;margin:0;padding:0;font-family:Poppins,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}',
    '#dtxbar{position:fixed;left:0;right:0;bottom:0;z-index:2147483000;background:#fff;border-top:1px solid #e6eae9;box-shadow:0 -4px 26px rgba(19,20,19,.09);transform:translateY(110%);transition:transform .34s cubic-bezier(.22,1,.36,1);padding-bottom:env(safe-area-inset-bottom)}',
    '#dtxbar.on{transform:none}',
    '#dtxbar-in{max-width:1120px;margin:0 auto;padding:13px 84px 13px 24px;display:flex;align-items:center;gap:14px}',
    '.dtxb-t{flex:0 0 auto;font-size:15px;font-weight:600;color:#131413;letter-spacing:-.01em;white-space:nowrap}',
    '.dtxb-f{flex:1;display:flex;gap:8px;align-items:center;justify-content:flex-end;min-width:0}',
    '.dtxb-fld{position:relative;flex:0 1 230px;min-width:0}',
    '.dtxb-fld--s{flex:0 1 130px}',
    '.dtxb-i{width:100%;height:44px;padding:0 14px;font-size:14.5px;font-family:inherit;color:#131413;background:#f7f9f8;border:1.5px solid #e2e7e5;border-radius:8px;outline:none;transition:border-color .15s,background .15s;-webkit-appearance:none}',
    '.dtxb-i::placeholder{color:#9aa3a0}',
    '.dtxb-i:focus{border-color:#117B69;background:#fff}',
    '.dtxb-i.err{border-color:#e53e3e;background:#fff7f7}',
    '.dtxb-e{display:none;position:absolute;top:-19px;left:2px;font-size:11px;color:#c53030;white-space:nowrap}',
    '.dtxb-e.on{display:block}',
    '.dtxb-hp{position:absolute!important;left:-9999px!important;width:1px!important;height:1px!important;opacity:0!important}',
    '.dtxb-btn{flex:0 0 auto;height:44px;padding:0 24px;font-family:"Instrument Sans",Poppins,sans-serif;font-size:14.5px;font-weight:600;color:#fff;background:#117B69;border:none;border-radius:8px;cursor:pointer;white-space:nowrap;transition:background .15s,transform .06s}',
    '.dtxb-btn:hover:not(:disabled){background:#27B3A8}',
    '.dtxb-btn:active:not(:disabled){transform:translateY(1px)}',
    '.dtxb-btn:disabled{opacity:.55;cursor:default}',
    '.dtxb-x{position:absolute;top:50%;right:22px;transform:translateY(-50%);width:26px;height:26px;border:none;border-radius:50%;background:transparent;color:#9aa3a0;font-size:19px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .15s,color .15s}',
    '.dtxb-x:hover{background:#f0f3f2;color:#131413}',
    '.dtxb-ok{padding:16px 20px;text-align:center;font-size:15px;color:#131413}',
    '.dtxb-ok b{color:#117B69}',
    '@media(max-width:900px){',
    '#dtxbar-in{padding:11px 46px 11px 16px;gap:10px;flex-wrap:wrap}',
    '.dtxb-t{flex:1;font-size:14px;white-space:normal}',
    '.dtxb-f{display:none;flex:0 0 100%;order:3;justify-content:stretch;gap:8px}',
    '#dtxbar.open .dtxb-f{display:flex}',
    '.dtxb-fld{flex:1 1 60%}',
    '.dtxb-fld--s{flex:1 1 34%}',
    '.dtxb-e{top:auto;bottom:-17px}',
    '.dtxb-btn{padding:0 18px;font-size:14px}',
    '#dtxbar.open .dtxb-btn{flex:1 1 100%;order:4}',
    '.dtxb-x{right:12px}',
    '}',
    '@media(prefers-reduced-motion:reduce){#dtxbar{transition:none}}'
  ].join('');

  function injectCSS() {
    if (document.getElementById('dtxbar-css')) return;
    var s = document.createElement('style');
    s.id = 'dtxbar-css';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  // Remonte la bulle de chat Detexi pour qu'elle ne soit pas masquee par le bandeau.
  function liftChat(h) {
    var id = 'dtxbar-chatlift';
    var el = document.getElementById(id);
    if (!el) { el = document.createElement('style'); el.id = id; document.head.appendChild(el); }
    el.textContent = h
      ? '#_dtxf{bottom:calc(24px + ' + h + 'px)!important}#_dtxw{bottom:calc(96px + ' + h + 'px)!important}'
      : '';
  }

  function build() {
    var L = lang(), t = T[L];

    var bar = document.createElement('div');
    bar.id = 'dtxbar';
    bar.setAttribute('role', 'region');
    bar.setAttribute('aria-label', t.pitch);
    bar.innerHTML =
      '<button class="dtxb-x" type="button" id="dtxb-x" aria-label="' + t.close + '">&times;</button>' +
      '<div id="dtxbar-in">' +
        '<div class="dtxb-t">' + t.pitch + '</div>' +
        '<div class="dtxb-f">' +
          '<div class="dtxb-fld"><div class="dtxb-e" id="dtxb-et"></div><input class="dtxb-i" id="dtxb-t" type="tel" inputmode="tel" autocomplete="tel" placeholder="' + t.tel + '"></div>' +
          '<div class="dtxb-fld dtxb-fld--s"><div class="dtxb-e" id="dtxb-ep"></div><input class="dtxb-i" id="dtxb-p" type="text" inputmode="numeric" maxlength="4" autocomplete="postal-code" placeholder="' + t.cp + '"></div>' +
          '<input class="dtxb-hp" type="text" tabindex="-1" aria-hidden="true" autocomplete="off" id="dtxb-h">' +
        '</div>' +
        '<button class="dtxb-btn" type="button" id="dtxb-go">' + t.cta + '</button>' +
      '</div>';
    document.body.appendChild(bar);

    var inn = document.getElementById('dtxbar-in');
    var elT = document.getElementById('dtxb-t');
    var elP = document.getElementById('dtxb-p');
    var elH = document.getElementById('dtxb-h');
    var btn = document.getElementById('dtxb-go');

    function isMobile() { return window.matchMedia('(max-width:900px)').matches; }
    function sync() { liftChat(bar.classList.contains('on') ? bar.offsetHeight : 0); }

    var shown = false;
    function show() {
      if (shown) return;
      shown = true;
      bar.classList.add('on');
      setTimeout(sync, 400);
    }
    setTimeout(show, 1500);
    window.addEventListener('scroll', function onS() {
      if (window.scrollY > 140) { show(); window.removeEventListener('scroll', onS); }
    }, { passive: true });
    window.addEventListener('resize', sync);

    document.getElementById('dtxb-x').addEventListener('click', function () {
      bar.classList.remove('on');
      liftChat(0);
      try { sessionStorage.setItem(DISMISS_KEY, '1'); } catch (e) {}
    });

    function err(id, msg) {
      var b = document.getElementById(id);
      if (b) { b.textContent = msg || ''; b.className = 'dtxb-e' + (msg ? ' on' : ''); }
    }
    [elT, elP].forEach(function (i) {
      i.addEventListener('input', function () { i.classList.remove('err'); });
      i.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); go(); } });
    });

    function go() {
      // Mobile : le premier clic deplie les champs
      if (isMobile() && !bar.classList.contains('open')) {
        bar.classList.add('open');
        setTimeout(function () { sync(); elT.focus(); }, 60);
        return;
      }

      err('dtxb-et', ''); err('dtxb-ep', '');
      elT.classList.remove('err'); elP.classList.remove('err');

      var tel = elT.value.trim(), cp = elP.value.trim(), bad = false;
      if (tel.replace(/\D/g, '').length < 8) { err('dtxb-et', t.errTel); elT.classList.add('err'); bad = true; }
      if (!/^\d{4}$/.test(cp)) { err('dtxb-ep', t.errCp); elP.classList.add('err'); bad = true; }
      if (bad) return;

      btn.disabled = true;
      btn.textContent = t.sending;
      var a = attribution();

      fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Detexi-Token': TOKEN },
        body: JSON.stringify({
          telephone: tel, code_postal: cp, langue: L,
          page: location.pathname, company_website: elH.value,
          gclid: a.gclid, utm_source: a.utm_source,
          utm_medium: a.utm_medium, utm_campaign: a.utm_campaign,
          token: TOKEN
        })
      })
        .then(function (r) { return r.json().catch(function () { return { ok: r.ok }; }); })
        .then(function (d) {
          if (d && d.ok) {
            try {
              window.dataLayer = window.dataLayer || [];
              window.dataLayer.push({
                event: 'lead_submitted', form_type: 'callback_bar',
                lang: L, source: 'web_form', value: 60, currency: 'EUR'
              });
            } catch (e) {}
            inn.innerHTML = '<div class="dtxb-ok">' + t.ok + '</div>';
            sync();
            setTimeout(function () { bar.classList.remove('on'); liftChat(0); }, 5000);
            try { sessionStorage.setItem(DISMISS_KEY, '1'); } catch (e) {}
          } else {
            btn.disabled = false; btn.textContent = t.cta;
            err('dtxb-et', t.errNet);
          }
        })
        .catch(function () {
          btn.disabled = false; btn.textContent = t.cta;
          err('dtxb-et', t.errNet);
        });
    }

    btn.addEventListener('click', go);
  }

  function init() {
    try { if (sessionStorage.getItem(DISMISS_KEY) === '1') return; } catch (e) {}
    injectCSS();
    build();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
