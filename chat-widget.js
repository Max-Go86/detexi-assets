(function(){
'use strict';
if(document.getElementById('_dtx'))return;

var WH='https://max-go.app.n8n.cloud/webhook/5a36b2a9-5d3a-47b5-a65e-f83b9ee9abdb';
var SRC='detexi-web-v1';
var MAX_MSG=10,WIN_MS=60000,MAX_LEN=500;
var TEAL='#2aa8a8',DARK='#1d7a7a',LIGHT='#eaf6f6';

/* SESSION */
var sid=(function(){var s=sessionStorage.getItem('_dtxs');if(!s){s=Date.now().toString(36)+Math.random().toString(36).slice(2);sessionStorage.setItem('_dtxs',s);}return s;})();

/* FINGERPRINT anti-bot */
var fp=(function(){try{return btoa([navigator.language,screen.width,screen.height,screen.colorDepth,navigator.hardwareConcurrency||0,Intl.DateTimeFormat().resolvedOptions().timeZone].join('|')).slice(0,24);}catch(e){return'x';}})();

/* RATE LIMIT */
var _rt=[];
function rateOk(){var n=Date.now();_rt=_rt.filter(function(x){return n-x<WIN_MS;});if(_rt.length>=MAX_MSG)return false;_rt.push(n);return true;}

/* SANITIZE + ANTI PROMPT-INJECTION */
function clean(s){
  return s.replace(/<[^>]*>/g,'')
    .replace(/[\x00-\x08\x0B\x0E-\x1F\x7F]/g,'')
    .replace(/\bignore\s+(all\s+)?(previous|above|prior)\s+instructions?/gi,'[x]')
    .replace(/\bsystem\s*:/gi,'[x]')
    .replace(/\[INST\]|\[\/INST\]|###\s*[Ss]ystem/g,'[x]')
    .replace(/\bpretend\s+(you\s+are|to\s+be)\b/gi,'[x]')
    .replace(/\bjailbreak\b/gi,'[x]')
    .replace(/\bDAN\s+mode\b/gi,'[x]')
    .trim().slice(0,MAX_LEN);
}

/* DETECT LANG */
function detectLang(t){
  if(/\b(ik|je|jij|de|het|een|beveiliging|alarm|prijs|installeren|woning)\b/i.test(t))return'nl';
  if(/[\u00e0\u00e2\u00e7\u00e9\u00e8\u00ea\u00eb\u00ee\u00ef\u00f4\u00fb\u00f9\u00fc]|\b(bonjour|merci|prix|s\u00e9curit\u00e9|alarme|devis|maison)\b/i.test(t))return'fr';
  return'nl';
}

/* TYPING DELAY humanise */
function typingDelay(resp){return Math.min(1800,400+resp.length*11);}

/* i18n */
var T={
  nl:{
    welcome:'Goeiedag! Ik ben de DETEXI-assistent \uD83D\uDD12<br>Hoe kan ik u helpen? Stel gerust vragen over onze alarmsystemen, prijzen of vraag een gratis diagnosebezoek aan.',
    placeholder:'Stel uw vraag\u2026',
    typing:'Assistent is aan het typen\u2026',
    error:'Er is een probleem opgetreden. Bel ons op <a href="tel:+32485280280" style="color:#2aa8a8">+32\u00a0485\u00a0280\u00a0280</a>.',
    rateLimit:'Te veel berichten. Wacht even voor u verdergaat.',
    disc:'\uD83E\uDD16 Virtuele assistent (AI) \u2014 geen menselijke medewerker'
  },
  fr:{
    welcome:'Bonjour\u00a0! Je suis l\u2019assistant DETEXI \uD83D\uDD12<br>Comment puis-je vous aider\u00a0? Posez vos questions sur nos syst\u00e8mes d\u2019alarme, nos tarifs ou demandez un diagnostic gratuit.',
    placeholder:'Posez votre question\u2026',
    typing:'L\u2019assistant r\u00e9pond\u2026',
    error:'Une erreur est survenue. Appelez-nous au <a href="tel:+32485280280" style="color:#2aa8a8">+32\u00a0485\u00a0280\u00a0280</a>.',
    rateLimit:'Trop de messages. Veuillez patienter.',
    disc:'\uD83E\uDD16 Assistant virtuel (IA) \u2014 pas un collaborateur humain'
  }
};

/* ICONS */
var ICO={
  shield:'<svg viewBox="0 0 24 24" fill="none" width="22" height="22"><path d="M12 2L3 7v5c0 5.3 3.8 9.8 9 11 5.2-1.2 9-5.7 9-11V7z" fill="white" opacity=".95"/><path d="M9.5 12.5l2 2 3.5-3.5" stroke="'+TEAL+'" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  shieldSm:'<svg viewBox="0 0 24 24" fill="none" width="14" height="14"><path d="M12 2L3 7v5c0 5.3 3.8 9.8 9 11 5.2-1.2 9-5.7 9-11V7z" fill="'+TEAL+'"/><path d="M9.5 12.5l2 2 3.5-3.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  close:'<svg viewBox="0 0 24 24" fill="none" width="15" height="15"><path d="M18 6L6 18M6 6l12 12" stroke="white" stroke-width="2.2" stroke-linecap="round"/></svg>',
  send:'<svg viewBox="0 0 24 24" fill="none" width="17" height="17"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
};

/* CSS */
var CSS='#_dtx,#_dtx *{box-sizing:border-box;margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}'
+'#_dtxf{position:fixed;bottom:24px;right:24px;z-index:2147483647;width:58px;height:58px;border-radius:50%;background:'+TEAL+';border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 24px rgba(42,168,168,.45);transition:transform .2s,box-shadow .2s}'
+'#_dtxf:hover{transform:scale(1.07);box-shadow:0 6px 32px rgba(42,168,168,.6)}'
+'#_dtxbdg{position:absolute;top:-2px;right:-2px;width:16px;height:16px;border-radius:50%;background:#e53e3e;border:2.5px solid #fff;font-size:9px;font-weight:700;color:#fff;display:flex;align-items:center;justify-content:center}'
+'#_dtxw{position:fixed;bottom:94px;right:24px;z-index:2147483646;width:348px;max-height:530px;border-radius:20px;background:#fff;display:flex;flex-direction:column;box-shadow:0 16px 56px rgba(0,0,0,.14),0 0 0 1px rgba(0,0,0,.05);opacity:0;transform:translateY(16px) scale(.97);pointer-events:none;transition:opacity .2s,transform .28s cubic-bezier(.34,1.56,.64,1)}'
+'#_dtxw.on{opacity:1;transform:none;pointer-events:all}'
+'#_dtxhd{padding:15px 18px;background:linear-gradient(135deg,'+TEAL+','+DARK+');border-radius:20px 20px 0 0;display:flex;align-items:center;justify-content:space-between;flex-shrink:0}'
+'._hi{display:flex;align-items:center;gap:11px}'
+'._av{width:38px;height:38px;border-radius:50%;background:rgba(255,255,255,.18);border:2px solid rgba(255,255,255,.32);display:flex;align-items:center;justify-content:center;flex-shrink:0}'
+'._nm{font-size:13.5px;font-weight:600;color:#fff}'
+'._st{font-size:10.5px;color:rgba(255,255,255,.82);display:flex;align-items:center;gap:5px;margin-top:2px}'
+'._sd{width:6px;height:6px;border-radius:50%;background:#48bb78;flex-shrink:0;animation:_pls 2.2s infinite}'
+'@keyframes _pls{0%,100%{opacity:1}50%{opacity:.3}}'
+'#_dtxcl{background:rgba(255,255,255,.14);border:none;border-radius:50%;width:32px;height:32px;cursor:pointer;color:#fff;display:flex;align-items:center;justify-content:center;transition:background .15s;flex-shrink:0}'
+'#_dtxcl:hover{background:rgba(255,255,255,.26)}'
+'#_dtxdc{background:'+LIGHT+';padding:7px 18px;font-size:10px;color:'+DARK+';text-align:center;border-bottom:1px solid rgba(42,168,168,.1);flex-shrink:0}'
+'#_dtxms{flex:1;overflow-y:auto;padding:14px 15px;display:flex;flex-direction:column;gap:12px;scroll-behavior:smooth;min-height:120px}'
+'#_dtxms::-webkit-scrollbar{width:3px}#_dtxms::-webkit-scrollbar-thumb{background:#e2e8f0;border-radius:2px}'
+'._mw{display:flex;gap:8px;align-items:flex-end;animation:_min .18s ease}'
+'@keyframes _min{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:none}}'
+'._mw.u{flex-direction:row-reverse}'
+'._mb{max-width:82%;padding:9px 13px;border-radius:15px;font-size:13px;line-height:1.58;word-break:break-word}'
+'._mw.b ._mb{background:#f1f3f5;color:#1a2332;border-bottom-left-radius:3px}'
+'._mw.u ._mb{background:'+TEAL+';color:#fff;border-bottom-right-radius:3px}'
+'._mb a{color:'+TEAL+';text-decoration:underline}'
+'._mw.u ._mb a{color:#fff}'
+'._mav{width:26px;height:26px;border-radius:50%;background:'+LIGHT+';display:flex;align-items:center;justify-content:center;flex-shrink:0}'
+'._ty{display:flex;gap:5px;padding:10px 13px;align-items:center}'
+'._ty span{width:7px;height:7px;border-radius:50%;background:#b0bec5;animation:_bo .85s ease infinite}'
+'._ty span:nth-child(2){animation-delay:.15s}._ty span:nth-child(3){animation-delay:.3s}'
+'@keyframes _bo{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}'
+'._err{font-size:11px;color:#c53030;background:#fff5f5;padding:7px 11px;border-radius:8px;border:1px solid #fed7d7}'
+'#_dtxia{padding:11px 14px;border-top:1px solid #f0f2f4;display:flex;gap:9px;align-items:flex-end;flex-shrink:0;background:#fff;border-radius:0 0 20px 20px}'
+'#_dtxta{flex:1;border:1.5px solid #e2e8f0;border-radius:20px;padding:9px 14px;font-size:13px;resize:none;max-height:88px;outline:none;line-height:1.45;transition:border-color .18s;font-family:inherit;color:#1a2332;background:#fff}'
+'#_dtxta:focus{border-color:'+TEAL+'}'
+'#_dtxta::placeholder{color:#a0aec0}'
+'#_dtxsb{width:38px;height:38px;border-radius:50%;flex-shrink:0;background:'+TEAL+';border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .15s,transform .1s}'
+'#_dtxsb:hover{background:'+DARK+'}'
+'#_dtxsb:active{transform:scale(.91)}'
+'#_dtxsb:disabled{background:#b0bec5;cursor:not-allowed}'
+'#_dtxpw{text-align:center;padding:5px 0 8px;font-size:9px;color:#cbd5e0;flex-shrink:0}'
+'@media(max-width:400px){#_dtxw{width:calc(100vw - 20px);right:10px;bottom:88px}}';

/* BUILD DOM */
var root=document.createElement('div');
root.id='_dtx';
var sty=document.createElement('style');
sty.textContent=CSS;
root.appendChild(sty);

var fab=document.createElement('button');
fab.id='_dtxf';
fab.setAttribute('aria-label','DETEXI assistent openen');
fab.innerHTML=ICO.shield;
var bdg=document.createElement('div');
bdg.id='_dtxbdg';
bdg.textContent='1';
fab.appendChild(bdg);
root.appendChild(fab);

var win=document.createElement('div');
win.id='_dtxw';
win.setAttribute('role','dialog');
win.setAttribute('aria-modal','true');
win.innerHTML='<div id="_dtxhd"><div class="_hi"><div class="_av">'+ICO.shieldSm+'</div><div><div class="_nm">Assistent DETEXI</div><div class="_st"><span class="_sd"></span>Online &mdash; antwoordt direct</div></div></div><button id="_dtxcl" aria-label="Sluiten">'+ICO.close+'</button></div><div id="_dtxdc"></div><div id="_dtxms" role="log" aria-live="polite"></div><div id="_dtxia"><textarea id="_dtxta" rows="1" maxlength="500" aria-label="Typ uw vraag"></textarea><button id="_dtxsb" aria-label="Verzenden">'+ICO.send+'</button></div><div id="_dtxpw">DETEXI &copy; 2025 &mdash; AI-assistent</div>';
root.appendChild(win);
document.body.appendChild(root);

/* REFS */
var ms=document.getElementById('_dtxms');
var ta=document.getElementById('_dtxta');
var sb=document.getElementById('_dtxsb');
var dc=document.getElementById('_dtxdc');
var open=false,busy=false;

/* UI LANG */
var uiLang=(function(){var p=(document.documentElement.lang||navigator.language||'nl').toLowerCase();return p.startsWith('fr')?'fr':'nl';})();
var t=T[uiLang];
ta.placeholder=t.placeholder;
dc.innerHTML=t.disc;

/* HELPERS */
function addMsg(html,role){var w=document.createElement('div');w.className='_mw '+(role==='user'?'u':'b');if(role!=='user'){w.innerHTML='<div class="_mav">'+ICO.shieldSm+'</div><div class="_mb">'+html+'</div>';}else{w.innerHTML='<div class="_mb">'+html+'</div>';}ms.appendChild(w);ms.scrollTop=ms.scrollHeight;}
function showTyping(){var w=document.createElement('div');w.className='_mw b';w.id='_dtxty';w.innerHTML='<div class="_mav">'+ICO.shieldSm+'</div><div class="_mb _ty"><span></span><span></span><span></span></div>';ms.appendChild(w);ms.scrollTop=ms.scrollHeight;}
function hideTyping(){var x=document.getElementById('_dtxty');if(x)x.remove();}
function esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
function showErr(html){var d=document.createElement('div');d.className='_mw b';d.innerHTML='<div class="_mav">'+ICO.shieldSm+'</div><div class="_mb _err">'+html+'</div>';ms.appendChild(d);ms.scrollTop=ms.scrollHeight;}

/* SEND */
function send(){
  if(busy)return;
  var raw=ta.value.trim();
  if(!raw)return;
  if(!rateOk()){showErr(t.rateLimit);return;}
  var msg=clean(raw);
  if(!msg)return;
  var msgLang=detectLang(msg);
  ta.value='';ta.style.height='auto';
  addMsg(esc(msg),'user');
  busy=true;sb.disabled=true;
  showTyping();
  var url=new URL(WH);
  url.searchParams.set('chatInput',msg);
  url.searchParams.set('sessionId',sid);
  url.searchParams.set('lang',msgLang);
  url.searchParams.set('_fp',fp);
  url.searchParams.set('_src',SRC);
  fetch(url.toString(),{method:'GET',headers:{'Accept':'application/json','X-Widget-Source':SRC}})
  .then(function(r){if(!r.ok)throw new Error('HTTP '+r.status);return r.json();})
  .then(function(d){
    var reply=((Array.isArray(d)&&d[0]&&(d[0].output||d[0].response||d[0].text))||d.output||d.response||d.message||d.text||null);
    if(!reply)throw new Error('empty');
    var delay=typingDelay(reply);
    setTimeout(function(){hideTyping();addMsg(reply.replace(/\n/g,'<br>'),'bot');busy=false;sb.disabled=false;},delay);
  })
  .catch(function(){hideTyping();showErr(t.error);busy=false;sb.disabled=false;});
}

/* TOGGLE */
function toggle(){
  open=!open;
  win.classList.toggle('on',open);
  if(open){bdg.style.display='none';fab.innerHTML=ICO.close;fab.appendChild(bdg);setTimeout(function(){ta.focus();},280);}
  else{fab.innerHTML=ICO.shield;fab.appendChild(bdg);bdg.style.display='flex';}
}

/* EVENTS */
fab.addEventListener('click',toggle);
document.getElementById('_dtxcl').addEventListener('click',toggle);
sb.addEventListener('click',send);
ta.addEventListener('keydown',function(e){if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send();}});
ta.addEventListener('input',function(){ta.style.height='auto';ta.style.height=Math.min(ta.scrollHeight,88)+'px';});

/* WELCOME */
setTimeout(function(){addMsg(t.welcome,'bot');},700);

})();