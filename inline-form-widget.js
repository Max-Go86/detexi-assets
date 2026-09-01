/*!
 * Detexi — Formulaire inline (capture rapide 3 champs)
 * v1.0 — staging
 *
 * Objectif : capter le lead sur la page elle-meme, sans redirection vers
 * offerte.detexi.be. Le funnel complet reste disponible pour ceux qui veulent
 * detailler leur demande.
 *
 * Pose :
 *   <div data-detexi-form></div>
 *   <script src="https://cdn.jsdelivr.net/gh/Max-Go86/detexi-assets@SHA/inline-form-widget.js" defer></script>
 *
 * Options sur le conteneur (toutes facultatives) :
 *   data-lang="fr"        force la langue (sinon detectee via /fr-be/ ou <html lang>)
 *   data-variant="card"   "card" (defaut) ou "bare" (sans fond ni bordure)
 *   data-title="..."      remplace le titre
 */
(function () {
  'use strict';

  if (window.__detexiInlineFormLoaded) return;
  window.__detexiInlineFormLoaded = true;

  var ENDPOINT = 'https://max-go.app.n8n.cloud/webhook/detexi-form-inline-r7k2';
  var TOKEN = 'dtx_web_8f3a1c9e2b6d4f7a0e8c3b5d9f2a7e4c';

  var T = {
    nl: {
      title: 'Gratis veiligheidsaudit aan huis',
      subtitle: 'Laat uw nummer achter. Een gecertificeerde technicus belt u binnen 24u terug — vrijblijvend.',
      nom: 'Uw naam',
      tel: 'Telefoonnummer',
      cp: 'Postcode',
      cta: 'Vraag mijn gratis audit aan',
      sending: 'Versturen...',
      okTitle: 'Bedankt !',
      okText: 'We bellen u binnen 24u terug op het nummer dat u heeft opgegeven.',
      errNom: 'Vul uw naam in.',
      errTel: 'Vul een geldig telefoonnummer in.',
      errCp: 'Vul een geldige postcode in (4 cijfers).',
      errNet: 'Er ging iets mis. Probeer opnieuw of bel ons op +32 485 28 02 80.',
      legal: 'Uw gegevens worden enkel gebruikt om u te contacteren. Geen doorverkoop.'
    },
    fr: {
      title: 'Audit de sécurité gratuit à domicile',
      subtitle: 'Laissez votre numéro. Un technicien certifié vous rappelle sous 24h — sans engagement.',
      nom: 'Votre nom',
      tel: 'Numéro de téléphone',
      cp: 'Code postal',
      cta: 'Demander mon audit gratuit',
      sending: 'Envoi...',
      okTitle: 'Merci !',
      okText: 'Nous vous rappelons sous 24h au numéro indiqué.',
      errNom: 'Indiquez votre nom.',
      errTel: 'Indiquez un numéro de téléphone valide.',
      errCp: 'Indiquez un code postal valide (4 chiffres).',
      errNet: 'Un problème est survenu. Réessayez ou appelez-nous au +32 485 28 02 80.',
      legal: 'Vos données servent uniquement à vous recontacter. Aucune revente.'
    }
  };

  function detectLang(el) {
    var forced = el.getAttribute('data-lang');
    if (forced) return forced.toLowerCase() === 'fr' ? 'fr' : 'nl';
    if (/\/fr-be(\/|$)/i.test(location.pathname)) return 'fr';
    var htmlLang = (document.documentElement.getAttribute('lang') || '').toLowerCase();
    if (htmlLang.indexOf('fr') === 0) return 'fr';
    return 'nl';
  }

  function param(name) {
    try {
      return new URLSearchParams(location.search).get(name) || '';
    } catch (e) { return ''; }
  }

  // Attribution : on lit d'abord ce que le site a deja stocke (dtx_attrib),
  // sinon on retombe sur les parametres d'URL courants.
  function attribution() {
    var out = { gclid: '', utm_source: '', utm_medium: '', utm_campaign: '' };
    try {
      var raw = localStorage.getItem('dtx_attrib');
      if (raw) {
        var a = JSON.parse(raw);
        out.gclid = a.gclid || '';
        out.utm_source = a.utm_source || '';
        out.utm_medium = a.utm_medium || '';
        out.utm_campaign = a.utm_campaign || '';
      }
    } catch (e) { /* localStorage indisponible : on continue */ }
    out.gclid = out.gclid || param('gclid');
    out.utm_source = out.utm_source || param('utm_source');
    out.utm_medium = out.utm_medium || param('utm_medium');
    out.utm_campaign = out.utm_campaign || param('utm_campaign');
    return out;
  }

  function injectStyles() {
    if (document.getElementById('dtx-inline-form-styles')) return;
    var css = [
      '.dtx-if{font-family:Poppins,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;box-sizing:border-box;width:100%;max-width:560px}',
      '.dtx-if *,.dtx-if *::before,.dtx-if *::after{box-sizing:border-box}',
      '.dtx-if--card{background:#fff;border:1px solid #e4e8e7;border-radius:16px;padding:28px;box-shadow:0 6px 28px rgba(19,20,19,.08)}',
      '.dtx-if__title{font-size:21px;font-weight:600;color:#131413;margin:0 0 6px;line-height:1.3}',
      '.dtx-if__sub{font-size:14px;color:#5b625f;margin:0 0 18px;line-height:1.5}',
      '.dtx-if__row{display:flex;gap:10px;margin-bottom:10px}',
      '.dtx-if__row>*{flex:1;min-width:0}',
      '.dtx-if__field{position:relative;margin-bottom:10px}',
      '.dtx-if__input{width:100%;height:50px;padding:0 14px;font-family:inherit;font-size:15px;color:#131413;background:#fff;border:1.5px solid #d9dedc;border-radius:10px;outline:none;transition:border-color .15s,box-shadow .15s;-webkit-appearance:none}',
      '.dtx-if__input::placeholder{color:#9aa3a0}',
      '.dtx-if__input:focus{border-color:#117B69;box-shadow:0 0 0 3px rgba(17,123,105,.12)}',
      '.dtx-if__input--err{border-color:#e53e3e}',
      '.dtx-if__err{display:none;font-size:12.5px;color:#c53030;margin:4px 2px 0}',
      '.dtx-if__err--on{display:block}',
      '.dtx-if__hp{position:absolute!important;left:-9999px!important;width:1px!important;height:1px!important;opacity:0!important;pointer-events:none!important}',
      '.dtx-if__btn{width:100%;height:52px;margin-top:6px;font-family:"Instrument Sans",Poppins,sans-serif;font-size:16px;font-weight:600;color:#fff;background:#117B69;border:none;border-radius:10px;cursor:pointer;transition:background .15s,transform .05s}',
      '.dtx-if__btn:hover:not(:disabled){background:#27B3A8}',
      '.dtx-if__btn:active:not(:disabled){transform:translateY(1px)}',
      '.dtx-if__btn:disabled{opacity:.65;cursor:default}',
      '.dtx-if__legal{font-size:11.5px;color:#8a918e;margin:12px 0 0;line-height:1.45;text-align:center}',
      '.dtx-if__ok{text-align:center;padding:14px 4px}',
      '.dtx-if__ok-ic{width:52px;height:52px;margin:0 auto 14px;border-radius:50%;background:rgba(17,123,105,.1);display:flex;align-items:center;justify-content:center}',
      '.dtx-if__ok-t{font-size:20px;font-weight:600;color:#117B69;margin:0 0 6px}',
      '.dtx-if__ok-x{font-size:14.5px;color:#5b625f;margin:0;line-height:1.55}',
      '@media(max-width:520px){.dtx-if--card{padding:22px 18px;border-radius:14px}.dtx-if__row{flex-direction:column;gap:0}.dtx-if__title{font-size:19px}}',
      '@media(prefers-reduced-motion:reduce){.dtx-if__btn,.dtx-if__input{transition:none}}'
    ].join('');
    var s = document.createElement('style');
    s.id = 'dtx-inline-form-styles';
    s.textContent = css;
    document.head.appendChild(s);
  }

  function build(container) {
    var lang = detectLang(container);
    var t = T[lang];
    var variant = container.getAttribute('data-variant') === 'bare' ? '' : ' dtx-if--card';
    var title = container.getAttribute('data-title') || t.title;
    var uid = 'dtx' + Math.random().toString(36).slice(2, 8);

    container.className = (container.className ? container.className + ' ' : '') + 'dtx-if' + variant;
    container.innerHTML =
      '<h3 class="dtx-if__title">' + title + '</h3>' +
      '<p class="dtx-if__sub">' + t.subtitle + '</p>' +
      '<div class="dtx-if__field">' +
        '<input class="dtx-if__input" id="' + uid + 'n" type="text" name="name" autocomplete="name" placeholder="' + t.nom + '">' +
        '<div class="dtx-if__err" data-for="' + uid + 'n"></div>' +
      '</div>' +
      '<div class="dtx-if__row">' +
        '<div class="dtx-if__field">' +
          '<input class="dtx-if__input" id="' + uid + 't" type="tel" name="tel" inputmode="tel" autocomplete="tel" placeholder="' + t.tel + '">' +
          '<div class="dtx-if__err" data-for="' + uid + 't"></div>' +
        '</div>' +
        '<div class="dtx-if__field">' +
          '<input class="dtx-if__input" id="' + uid + 'p" type="text" name="zip" inputmode="numeric" maxlength="4" autocomplete="postal-code" placeholder="' + t.cp + '">' +
          '<div class="dtx-if__err" data-for="' + uid + 'p"></div>' +
        '</div>' +
      '</div>' +
      '<input class="dtx-if__hp" type="text" tabindex="-1" aria-hidden="true" autocomplete="off" id="' + uid + 'h" name="company_website">' +
      '<button class="dtx-if__btn" type="button" id="' + uid + 'b">' + t.cta + '</button>' +
      '<div class="dtx-if__err" data-for="' + uid + 'b" style="text-align:center"></div>' +
      '<p class="dtx-if__legal">' + t.legal + '</p>';

    var elNom = document.getElementById(uid + 'n');
    var elTel = document.getElementById(uid + 't');
    var elCp = document.getElementById(uid + 'p');
    var elHp = document.getElementById(uid + 'h');
    var elBtn = document.getElementById(uid + 'b');

    function err(field, msg) {
      var box = container.querySelector('.dtx-if__err[data-for="' + field + '"]');
      if (!box) return;
      box.textContent = msg || '';
      box.className = 'dtx-if__err' + (msg ? ' dtx-if__err--on' : '');
      if (msg && field !== uid + 'b') box.previousElementSibling.classList.add('dtx-if__input--err');
    }
    function clearErrs() {
      container.querySelectorAll('.dtx-if__err').forEach(function (b) { b.textContent = ''; b.className = 'dtx-if__err'; });
      container.querySelectorAll('.dtx-if__input').forEach(function (i) { i.classList.remove('dtx-if__input--err'); });
    }
    [elNom, elTel, elCp].forEach(function (i) {
      i.addEventListener('input', function () {
        i.classList.remove('dtx-if__input--err');
        var b = container.querySelector('.dtx-if__err[data-for="' + i.id + '"]');
        if (b) { b.textContent = ''; b.className = 'dtx-if__err'; }
      });
      i.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); submit(); } });
    });

    function success() {
      container.innerHTML =
        '<div class="dtx-if__ok">' +
          '<div class="dtx-if__ok-ic">' +
            '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#117B69" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>' +
          '</div>' +
          '<p class="dtx-if__ok-t">' + t.okTitle + '</p>' +
          '<p class="dtx-if__ok-x">' + t.okText + '</p>' +
        '</div>';
    }

    function submit() {
      clearErrs();
      var nom = elNom.value.trim();
      var tel = elTel.value.trim();
      var cp = elCp.value.trim();
      var bad = false;

      if (nom.length < 2) { err(uid + 'n', t.errNom); bad = true; }
      if (tel.replace(/\D/g, '').length < 8) { err(uid + 't', t.errTel); bad = true; }
      if (!/^\d{4}$/.test(cp)) { err(uid + 'p', t.errCp); bad = true; }
      if (bad) return;

      elBtn.disabled = true;
      elBtn.textContent = t.sending;

      var a = attribution();
      var payload = {
        nom: nom, telephone: tel, code_postal: cp, langue: lang,
        page: location.pathname,
        company_website: elHp.value,
        gclid: a.gclid, utm_source: a.utm_source,
        utm_medium: a.utm_medium, utm_campaign: a.utm_campaign,
        token: TOKEN
      };

      fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Detexi-Token': TOKEN },
        body: JSON.stringify(payload)
      })
        .then(function (r) { return r.json().catch(function () { return { ok: r.ok }; }); })
        .then(function (d) {
          if (d && d.ok) {
            // Conversion : on reutilise la chaine GTM existante (Custom Event lead_submitted
            // -> balise GA4 ads_conversion_submit_lead_form -> import Google Ads).
            try {
              window.dataLayer = window.dataLayer || [];
              window.dataLayer.push({
                event: 'lead_submitted',
                form_type: 'inline_quick',
                lang: lang,
                source: 'web_form',
                value: 60,
                currency: 'EUR'
              });
            } catch (e) { /* ne jamais bloquer l'UX */ }
            success();
          } else {
            elBtn.disabled = false;
            elBtn.textContent = t.cta;
            err(uid + 'b', (d && d.message) ? d.message : t.errNet);
          }
        })
        .catch(function () {
          elBtn.disabled = false;
          elBtn.textContent = t.cta;
          err(uid + 'b', t.errNet);
        });
    }

    elBtn.addEventListener('click', submit);
  }

  function init() {
    var targets = document.querySelectorAll('[data-detexi-form]');
    if (!targets.length) return;
    injectStyles();
    targets.forEach(build);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
