/*!
 * Detexi — Bandeau de capture flottant (bas d'ecran)
 * v2.0
 *
 * Remplace la carte inline de la v1, trop encombrante dans le hero.
 * Le bandeau reste discret, present sur toute la navigation, et ne pousse
 * jamais le contenu.
 *
 * Pose : une seule ligne dans le Footer code du site. Aucun bloc Embed
 * necessaire, le bandeau s'affiche tout seul.
 *
 * Comportement :
 *   - apparait apres 1,2 s ou des le premier scroll
 *   - desktop : champs en ligne dans le bandeau
 *   - mobile  : bandeau compact, se deplie au clic
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
      pitch: 'Gratis veiligheidsaudit aan huis',
      pitchSub: 'Een gecertificeerde technicus belt u binnen 24u terug.',
      nom: 'Uw naam',
      tel: 'Telefoonnummer',
      cp: 'Postcode',
      cta: 'Vraag mijn audit aan',
      ctaShort: 'Vraag audit',
      sending: 'Versturen…',
      okTitle: 'Bedankt !',
      okText: 'We bellen u binnen 24u terug.',
      errNom: 'Vul uw naam in.',
      errTel: 'Ongeldig telefoonnummer.',
      errCp: 'Postcode: 4 cijfers.',
      errNet: 'Er ging iets mis. Bel ons op +32 485 28 02 80.',
      close: 'Sluiten'
    },
    fr: {
      pitch: 'Audit de sécurité gratuit à domicile',
      pitchSub: 'Un technicien certifié vous rappelle sous 24h.',
      nom: 'Votre nom',
      tel: 'Téléphone',
      cp: 'Code postal',
      cta: 'Demander mon audit',
      ctaShort: 'Demander',
      sending: 'Envoi…',
      okTitle: 'Merci !',
      okText: 'Nous vous rappelons sous 24h.',
      errNom: 'Indiquez votre nom.',
      errTel: 'Numéro invalide.',
      errCp: 'Code postal : 4 chiffres.',
      errNet: 'Un problème est survenu. Appelez-nous au +32 485 28 02 80.',
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
    '#dtxbar{position:fixed;left:0;right:0;bottom:0;z-index:2147483000;background:#013B31;color:#fff;box-shadow:0 -6px 28px rgba(1,59,49,.28);transform:translateY(110%);transition:transform .38s cubic-bezier(.22,1,.36,1);padding-bottom:env(safe-area-inset-bottom)}',
    '#dtxbar.on{transform:none}',
    '#dtxbar-in{max-width:1180px;margin:0 auto;padding:14px 96px 14px 20px;display:flex;align-items:center;gap:16px}',
    '.dtxb-txt{flex:0 0 auto;max-width:300px}',
    '.dtxb-t{font-size:15px;font-weight:600;line-height:1.25}',
    '.dtxb-s{font-size:12.5px;color:rgba(255,255,255,.72);line-height:1.35;margin-top:2px}',
    '.dtxb-f{flex:1;display:flex;gap:8px;align-items:flex-start;min-width:0}',
    '.dtxb-fld{flex:1;min-width:0;position:relative}',
    '.dtxb-fld--s{flex:0 0 118px}',
    '.dtxb-i{width:100%;height:46px;padding:0 13px;font-size:14.5px;font-family:inherit;color:#131413;background:#fff;border:1.5px solid transparent;border-radius:9px;outline:none;transition:border-color .15s;-webkit-appearance:none}',
    '.dtxb-i::placeholder{color:#9aa3a0}',
    '.dtxb-i:focus{border-color:#27B3A8}',
    '.dtxb-i.err{border-color:#ff8f8f;background:#fff6f6}',
    '.dtxb-e{display:none;font-size:11px;color:#ffc9c9;margin:3px 0 0 3px;line-height:1.3}',
    '.dtxb-e.on{display:block}',
    '.dtxb-hp{position:absolute!important;left:-9999px!important;width:1px!important;height:1px!important;opacity:0!important}',
    '.dtxb-btn{flex:0 0 auto;height:46px;padding:0 22px;font-family:"Instrument Sans",Poppins,sans-serif;font-size:14.5px;font-weight:600;color:#fff;background:#117B69;border:none;border-radius:9px;cursor:pointer;white-space:nowrap;transition:background .15s,transform .06s}',
    '.dtxb-btn:hover:not(:disabled){background:#27B3A8}',
    '.dtxb-btn:active:not(:disabled){transform:translateY(1px)}',
    '.dtxb-btn:disabled{opacity:.6;cursor:default}',
    '.dtxb-x{position:absolute;top:10px;right:14px;width:28px;height:28px;border:none;border-radius:50%;background:rgba(255,255,255,.12);color:#fff;font-size:17px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .15s}',
    '.dtxb-x:hover{background:rgba(255,255,255,.24)}',
    '.dtxb-ok{padding:18px 20px;text-align:center;font-size:15px}',
    '.dtxb-ok b{color:#7fe3d4}',
    '@media(max-width:860px){',
    '#dtxbar-in{padding:11px 14px;gap:10px;flex-wrap:wrap}',
    '.dtxb-txt{flex:1;max-width:none}',
    '.dtxb-t{font-size:14px}',
    '.dtxb-s{display:none}',
    '.dtxb-f{display:none;flex:0 0 100%;flex-wrap:wrap;gap:8px;order:3}',
    '#dtxbar.open .dtxb-f{display:flex}',
    '#dtxbar.open .dtxb-txt{flex:0 0 100%}',
    '#dtxbar.open .dtxb-s{display:block}',
    '.dtxb-fld{flex:1 1 100%}',
    '.dtxb-fld--s{flex:1 1 100%}',
    '#dtxbar.open .dtxb-fld--tel{flex:1 1 55%}',
    '#dtxbar.open .dtxb-fld--s{flex:1 1 35%}',
    '.dtxb-btn{flex:0 0 auto;padding:0 16px;font-size:14px}',
    '#dtxbar.open .dtxb-btn{flex:1 1 100%}',
    '.dtxb-x{top:8px;right:10px;width:24px;height:24px;font-size:15px}',
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
  function liftChat(height) {
    var id = 'dtxbar-chatlift';
    var el = document.getElementById(id);
    if (!el) { el = document.createElement('style'); el.id = id; document.head.appendChild(el); }
    el.textContent = height
      ? '#_dtxf{bottom:calc(24px + ' + height + 'px)!important}#_dtxw{bottom:calc(96px + ' + height + 'px)!important}'
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
        '<div class="dtxb-txt">' +
          '<div class="dtxb-t">' + t.pitch + '</div>' +
          '<div class="dtxb-s">' + t.pitchSub + '</div>' +
        '</div>' +
        '<div class="dtxb-f" id="dtxb-f">' +
          '<div class="dtxb-fld"><input class="dtxb-i" id="dtxb-n" type="text" autocomplete="name" placeholder="' + t.nom + '"><div class="dtxb-e" id="dtxb-en"></div></div>' +
          '<div class="dtxb-fld dtxb-fld--tel"><input class="dtxb-i" id="dtxb-t" type="tel" inputmode="tel" autocomplete="tel" placeholder="' + t.tel + '"><div class="dtxb-e" id="dtxb-et"></div></div>' +
          '<div class="dtxb-fld dtxb-fld--s"><input class="dtxb-i" id="dtxb-p" type="text" inputmode="numeric" maxlength="4" autocomplete="postal-code" placeholder="' + t.cp + '"><div class="dtxb-e" id="dtxb-ep"></div></div>' +
          '<input class="dtxb-hp" type="text" tabindex="-1" aria-hidden="true" autocomplete="off" id="dtxb-h">' +
        '</div>' +
        '<button class="dtxb-btn" type="button" id="dtxb-go">' + t.cta + '</button>' +
      '</div>';
    document.body.appendChild(bar);

    var inn = document.getElementById('dtxbar-in');
    var elN = document.getElementById('dtxb-n');
    var elT = document.getElementById('dtxb-t');
    var elP = document.getElementById('dtxb-p');
    var elH = document.getElementById('dtxb-h');
    var btn = document.getElementById('dtxb-go');

    function isMobile() { return window.matchMedia('(max-width:860px)').matches; }
    function sync() { liftChat(bar.classList.contains('on') ? bar.offsetHeight : 0); }

    if (isMobile()) btn.textContent = t.ctaShort;

    // Affichage : apres 1,2 s ou au premier scroll significatif
    var shown = false;
    function show() {
      if (shown) return;
      shown = true;
      bar.classList.add('on');
      setTimeout(sync, 420);
    }
    setTimeout(show, 1200);
    window.addEventListener('scroll', function onS() {
      if (window.scrollY > 120) { show(); window.removeEventListener('scroll', onS); }
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
    function clearErrs() {
      ['dtxb-en', 'dtxb-et', 'dtxb-ep'].forEach(function (i) { err(i, ''); });
      [elN, elT, elP].forEach(function (i) { i.classList.remove('err'); });
    }
    [elN, elT, elP].forEach(function (i) {
      i.addEventListener('input', function () { i.classList.remove('err'); });
      i.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); go(); } });
    });

    function go() {
      // Mobile : le premier clic deplie le bandeau
      if (isMobile() && !bar.classList.contains('open')) {
        bar.classList.add('open');
        btn.textContent = t.cta;
        setTimeout(function () { sync(); elN.focus(); }, 60);
        return;
      }

      clearErrs();
      var n = elN.value.trim(), tel = elT.value.trim(), cp = elP.value.trim(), bad = false;
      if (n.length < 2) { err('dtxb-en', t.errNom); elN.classList.add('err'); bad = true; }
      if (tel.replace(/\D/g, '').length < 8) { err('dtxb-et', t.errTel); elT.classList.add('err'); bad = true; }
      if (!/^\d{4}$/.test(cp)) { err('dtxb-ep', t.errCp); elP.classList.add('err'); bad = true; }
      if (bad) { sync(); return; }

      btn.disabled = true;
      btn.textContent = t.sending;
      var a = attribution();

      fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Detexi-Token': TOKEN },
        body: JSON.stringify({
          nom: n, telephone: tel, code_postal: cp, langue: L,
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
                event: 'lead_submitted', form_type: 'sticky_bar',
                lang: L, source: 'web_form', value: 60, currency: 'EUR'
              });
            } catch (e) {}
            inn.innerHTML = '<div class="dtxb-ok"><b>' + t.okTitle + '</b> ' + t.okText + '</div>';
            sync();
            setTimeout(function () { bar.classList.remove('on'); liftChat(0); }, 5000);
            try { sessionStorage.setItem(DISMISS_KEY, '1'); } catch (e) {}
          } else {
            btn.disabled = false; btn.textContent = t.cta;
            err('dtxb-et', (d && d.message) ? d.message : t.errNet);
            sync();
          }
        })
        .catch(function () {
          btn.disabled = false; btn.textContent = t.cta;
          err('dtxb-et', t.errNet);
          sync();
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
