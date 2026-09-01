/*!
 * Detexi — Bandeau de rappel (bas d'ecran)
 * v6.0
 *
 * v6 : correction de specificite CSS. En v5 les selecteurs etaient de
 *      simples classes (.dtxb-btn, .dtxb-i), donc les regles Webflow du
 *      site les ecrasaient : bouton sans padding, champs trop serres.
 *      Tous les selecteurs sont desormais prefixes par #dtxbar (ID + classe),
 *      ce qui passe devant les styles du site sans recourir a !important.
 *      Respiration augmentee : champs 18px, bouton 28px.
 *
 * Tokens core (valeur fixe, resolus hors du wrapper de theme Webflow) :
 *   --_colors---core-neutral-color--neutral-secondary   fond
 *   --_colors---core-neutral-color--neutral-inverse     texte
 *   --_colors---core-color-tint--neutral-inverse-a10/20/50/60
 *   --_colors---core-accent-color--accent-primary(-hover)
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

  var CSS = [
    '#dtxbar{--dtx-bg:var(--_colors---core-neutral-color--neutral-secondary,#1B1D1C);',
    '--dtx-fg:var(--_colors---core-neutral-color--neutral-inverse,#ECEEED);',
    '--dtx-fg2:var(--_colors---core-color-tint--neutral-inverse-a60,rgba(236,238,237,.6));',
    '--dtx-bd:var(--_colors---core-color-tint--neutral-inverse-a10,rgba(236,238,237,.1));',
    '--dtx-in-bd:var(--_colors---core-color-tint--neutral-inverse-a20,rgba(236,238,237,.2));',
    '--dtx-in-ph:var(--_colors---core-color-tint--neutral-inverse-a50,rgba(236,238,237,.5));',
    '--dtx-acc:var(--_colors---core-accent-color--accent-primary,#117B69);',
    '--dtx-acc-h:var(--_colors---core-accent-color--accent-primary-hover,#27B3A8);}',

    '#dtxbar,#dtxbar *{box-sizing:border-box;margin:0;padding:0}',
    '#dtxbar{position:fixed;left:0;right:0;bottom:0;z-index:2147483000;',
    'background:var(--dtx-bg);color:var(--dtx-fg);',
    'border-top:1px solid var(--dtx-bd);',
    'font-family:Poppins,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;',
    'transform:translateY(110%);transition:transform .34s cubic-bezier(.22,1,.36,1);',
    'padding-bottom:env(safe-area-inset-bottom)}',
    '#dtxbar.on{transform:none}',

    '#dtxbar #dtxbar-in{max-width:1120px;margin:0 auto;padding:14px 76px 14px 24px;',
    'display:flex;align-items:center;gap:16px}',
    '#dtxbar .dtxb-t{flex:0 0 auto;font-size:15px;font-weight:500;letter-spacing:-.01em;',
    'white-space:nowrap;color:var(--dtx-fg);line-height:1.3}',
    '#dtxbar .dtxb-f{flex:1;display:flex;gap:10px;align-items:center;justify-content:flex-end;min-width:0}',
    '#dtxbar .dtxb-fld{position:relative;flex:0 1 220px;min-width:0}',
    '#dtxbar .dtxb-fld--s{flex:0 1 132px}',

    '#dtxbar .dtxb-i{display:block;width:100%;height:48px;',
    'padding:0 18px;margin:0;text-indent:0;',
    'font-family:inherit;font-size:14.5px;font-weight:400;line-height:48px;',
    'color:var(--dtx-fg);background:transparent;border:1px solid var(--dtx-in-bd);',
    'border-radius:10px;outline:none;box-shadow:none;',
    'transition:border-color .15s;-webkit-appearance:none;appearance:none}',
    '#dtxbar .dtxb-i::placeholder{color:var(--dtx-in-ph);opacity:1}',
    '#dtxbar .dtxb-i:focus{border-color:var(--dtx-acc);box-shadow:none}',
    '#dtxbar .dtxb-i.err{border-color:#e05252}',

    '#dtxbar .dtxb-e{display:none;position:absolute;top:-18px;left:2px;font-size:11px;',
    'color:#f0a0a0;white-space:nowrap}',
    '#dtxbar .dtxb-e.on{display:block}',
    '#dtxbar .dtxb-hp{position:absolute!important;left:-9999px!important;width:1px!important;height:1px!important;opacity:0!important}',

    '#dtxbar .dtxb-btn{display:inline-flex;align-items:center;justify-content:center;',
    'flex:0 0 auto;height:48px;min-width:150px;padding:0 28px;margin:0;',
    'font-family:"Instrument Sans",Poppins,sans-serif;font-size:14.5px;font-weight:600;line-height:1;',
    'color:#fff;background:var(--dtx-acc);border:none;border-radius:10px;',
    'cursor:pointer;white-space:nowrap;text-decoration:none;box-shadow:none;',
    'transition:background .18s,transform .06s}',
    '#dtxbar .dtxb-btn:hover:not(:disabled){background:var(--dtx-acc-h)}',
    '#dtxbar .dtxb-btn:active:not(:disabled){transform:translateY(1px)}',
    '#dtxbar .dtxb-btn:disabled{opacity:.5;cursor:default}',

    '#dtxbar .dtxb-x{position:absolute;top:50%;right:24px;transform:translateY(-50%);',
    'width:28px;height:28px;padding:0;margin:0;border:none;border-radius:50%;',
    'background:transparent;color:var(--dtx-fg2);font-size:20px;line-height:1;',
    'cursor:pointer;display:flex;align-items:center;justify-content:center;',
    'transition:color .15s;font-family:inherit}',
    '#dtxbar .dtxb-x:hover{color:var(--dtx-fg)}',
    '#dtxbar .dtxb-ok{padding:18px 20px;text-align:center;font-size:15px;color:var(--dtx-fg)}',
    '#dtxbar .dtxb-ok b{color:var(--dtx-acc-h);font-weight:600}',

    '@media(max-width:900px){',
    '#dtxbar #dtxbar-in{padding:12px 14px 16px;gap:9px;flex-wrap:wrap;align-items:stretch}',
    '#dtxbar .dtxb-t{flex:0 0 100%;font-size:13.5px;white-space:normal;padding-right:32px}',
    '#dtxbar .dtxb-f{flex:0 0 100%;gap:9px;justify-content:stretch}',
    '#dtxbar .dtxb-fld{flex:1 1 58%}',
    '#dtxbar .dtxb-fld--s{flex:1 1 34%}',
    '#dtxbar .dtxb-i{height:46px;line-height:46px;font-size:16px;padding:0 16px}',
    '#dtxbar .dtxb-btn{flex:0 0 100%;width:100%;height:48px;min-width:0}',
    '#dtxbar .dtxb-e{top:auto;bottom:-15px}',
    '#dtxbar .dtxb-x{top:10px;right:10px;transform:none}}',
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
