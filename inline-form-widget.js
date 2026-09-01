/*!
 * Detexi — Bandeau de rappel (bas d'ecran)
 * v4.0 — aligne sur le design system Webflow
 *
 * v4 : plus AUCUNE couleur codee en dur. Le bandeau consomme les variables
 *      CSS natives du site (collection "Colors"), donc il herite du theme
 *      exactement comme un composant Webflow. Si les tokens changent dans
 *      le Designer, le bandeau suit sans redeploiement.
 *
 * Tokens utilises :
 *   --_colors---background-color--bg-secondary        fond du bandeau
 *   --_colors---text-color--text-primary              texte
 *   --_colors---border-color--border-primary          bordures
 *   --_colors---border-color--border-accent           focus champ
 *   --_colors---input--input-primary-bg / -text / -border / -text-placeholder
 *   --_colors---button--button-primary-bg / -bg-hover / -text / -border
 *
 * Pose : une seule ligne dans le Footer code du site. Aucun bloc Embed.
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

  // Les fallbacks apres la virgule ne servent que si le site n'expose pas
  // les variables (ex. preview isole). En production, ce sont les tokens
  // Webflow qui pilotent.
  var CSS = [
    '#dtxbar{--dtx-bg:var(--_colors---background-color--bg-secondary,#1B1D1C);',
    '--dtx-fg:var(--_colors---text-color--text-primary,#ECEEED);',
    '--dtx-fg2:var(--_colors---text-color--text-secondary,rgba(236,238,237,.6));',
    '--dtx-bd:var(--_colors---border-color--border-primary,rgba(236,238,237,.1));',
    '--dtx-bd-acc:var(--_colors---border-color--border-accent,#117B69);',
    '--dtx-in-bg:var(--_colors---input--input-primary-bg,transparent);',
    '--dtx-in-fg:var(--_colors---input--input-primary-text,#ECEEED);',
    '--dtx-in-ph:var(--_colors---input--input-primary-text-placeholder,rgba(236,238,237,.35));',
    '--dtx-in-bd:var(--_colors---input--input-primary-border,rgba(236,238,237,.1));',
    '--dtx-btn-bg:var(--_colors---button--button-primary-bg,rgba(17,123,105,.1));',
    '--dtx-btn-bg-h:var(--_colors---button--button-primary-bg-hover,#117B69);',
    '--dtx-btn-fg:var(--_colors---button--button-primary-text,#fff);',
    '--dtx-btn-bd:var(--_colors---button--button-primary-border,transparent);',
    '--dtx-acc:var(--_colors---core-accent-color--accent-primary,#117B69);}',

    '#dtxbar,#dtxbar *{box-sizing:border-box;margin:0;padding:0}',
    '#dtxbar{position:fixed;left:0;right:0;bottom:0;z-index:2147483000;',
    'background:var(--dtx-bg);color:var(--dtx-fg);',
    'border-top:1px solid var(--dtx-bd);',
    'font-family:Poppins,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;',
    'transform:translateY(110%);transition:transform .34s cubic-bezier(.22,1,.36,1);',
    'padding-bottom:env(safe-area-inset-bottom)}',
    '#dtxbar.on{transform:none}',
    '#dtxbar-in{max-width:1120px;margin:0 auto;padding:14px 76px 14px 24px;display:flex;align-items:center;gap:16px}',
    '.dtxb-t{flex:0 0 auto;font-size:15px;font-weight:500;letter-spacing:-.01em;white-space:nowrap;color:var(--dtx-fg)}',
    '.dtxb-f{flex:1;display:flex;gap:10px;align-items:center;justify-content:flex-end;min-width:0}',
    '.dtxb-fld{position:relative;flex:0 1 220px;min-width:0}',
    '.dtxb-fld--s{flex:0 1 128px}',
    '.dtxb-i{width:100%;height:46px;padding:0 15px;font-family:inherit;font-size:14.5px;',
    'color:var(--dtx-in-fg);background:var(--dtx-in-bg);border:1px solid var(--dtx-in-bd);',
    'border-radius:8px;outline:none;transition:border-color .15s;-webkit-appearance:none}',
    '.dtxb-i::placeholder{color:var(--dtx-in-ph)}',
    '.dtxb-i:focus{border-color:var(--dtx-bd-acc)}',
    '.dtxb-i.err{border-color:#e05252}',
    '.dtxb-e{display:none;position:absolute;top:-18px;left:2px;font-size:11px;color:#f0a0a0;white-space:nowrap}',
    '.dtxb-e.on{display:block}',
    '.dtxb-hp{position:absolute!important;left:-9999px!important;width:1px!important;height:1px!important;opacity:0!important}',
    '.dtxb-btn{flex:0 0 auto;height:46px;padding:0 26px;font-family:"Instrument Sans",Poppins,sans-serif;',
    'font-size:14.5px;font-weight:600;color:var(--dtx-btn-fg);background:var(--dtx-btn-bg);',
    'border:1px solid var(--dtx-btn-bd);border-radius:8px;cursor:pointer;white-space:nowrap;',
    'transition:background .18s,transform .06s}',
    '.dtxb-btn:hover:not(:disabled){background:var(--dtx-btn-bg-h)}',
    '.dtxb-btn:active:not(:disabled){transform:translateY(1px)}',
    '.dtxb-btn:disabled{opacity:.5;cursor:default}',
    '.dtxb-x{position:absolute;top:50%;right:24px;transform:translateY(-50%);width:26px;height:26px;',
    'border:none;border-radius:50%;background:transparent;color:var(--dtx-fg2);font-size:19px;line-height:1;',
    'cursor:pointer;display:flex;align-items:center;justify-content:center;transition:color .15s;font-family:inherit}',
    '.dtxb-x:hover{color:var(--dtx-fg)}',
    '.dtxb-ok{padding:17px 20px;text-align:center;font-size:15px;color:var(--dtx-fg)}',
    '.dtxb-ok b{color:var(--dtx-acc);font-weight:600}',

    '@media(max-width:900px){',
    '#dtxbar-in{padding:12px 44px 12px 16px;gap:10px;flex-wrap:wrap}',
    '.dtxb-t{flex:1;font-size:14px;white-space:normal}',
    '.dtxb-f{display:none;flex:0 0 100%;order:3;gap:8px}',
    '#dtxbar.open .dtxb-f{display:flex}',
    '.dtxb-fld{flex:1 1 58%}.dtxb-fld--s{flex:1 1 36%}',
    '.dtxb-e{top:auto;bottom:-16px}',
    '.dtxb-btn{padding:0 18px;font-size:14px}',
    '#dtxbar.open .dtxb-btn{flex:1 1 100%;order:4}',
    '.dtxb-x{right:12px}}',
    '@media(prefers-reduced-motion:reduce){#dtxbar{transition:none}}'
  ].join('');

  function injectCSS() {
    if (document.getElementById('dtxbar-css')) return;
    var s = document.createElement('style');
    s.id = 'dtxbar-css';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  // Remonte la bulle de chat Detexi pour eviter le chevauchement.
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
