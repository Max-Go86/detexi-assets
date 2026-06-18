(function(){
'use strict';
if(document.getElementById('_dtx'))return;

var WH='https://max-go.app.n8n.cloud/webhook/5a36b2a9-5d3a-47b5-a65e-f83b9ee9abdb';
var SRC='detexi-web-v1';
var MAX_MSG=10,WIN_MS=60000,MAX_LEN=500;
var CDN='https://cdn.jsdelivr.net/gh/Max-Go86/detexi-assets@main/';
var AV_ICO='<svg viewBox="0 0 24 24" width="15" height="15" fill="none"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" fill="#fff"/></svg>'; // avatar agent (inline, jamais cassé)
var LOGO_URL='https://qelzuiqqkygusrbwaerp.supabase.co/storage/v1/object/public/logo_Detexi/detexi_logo_rounded.png'; // logo Supabase (header)

// Police officielle Detexi : Poppins (Google Fonts) — chargée en dur
(function(){var l=document.createElement('link');l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap';document.head.appendChild(l);})();

var sid=(function(){var s=sessionStorage.getItem('_dtxs');if(!s){s=Date.now().toString(36)+Math.random().toString(36).slice(2);sessionStorage.setItem('_dtxs',s);}return s;})();
var fp=(function(){try{return btoa([navigator.language,screen.width,screen.height,screen.colorDepth,navigator.hardwareConcurrency||0,Intl.DateTimeFormat().resolvedOptions().timeZone].join('|')).slice(0,24);}catch(e){return'x';}})();
var _rt=[];
function rateOk(){var n=Date.now();_rt=_rt.filter(function(x){return n-x<60000;});if(_rt.length>=10)return false;_rt.push(n);return true;}
function clean(s){return s.replace(/<[^>]*>/g,'').replace(/[\x00-\x08\x0B\x0E-\x1F\x7F]/g,'').replace(/\bignore\s+(all\s+)?(previous|above|prior)\s+instructions?/gi,'[x]').replace(/\bsystem\s*:/gi,'[x]').replace(/\[INST\]|\[\/INST\]|###\s*[Ss]ystem/g,'[x]').replace(/\bpretend\s+(you\s+are|to\s+be)\b/gi,'[x]').replace(/\bjailbreak\b/gi,'[x]').replace(/\bDAN\s+mode\b/gi,'[x]').trim().slice(0,500);}
function detectLang(t){if(/\b(ik|je|jij|de|het|een|beveiliging|alarm|prijs|installeren|woning)\b/i.test(t))return'nl';if(/[àâçéèêëîïôûùü]|\b(bonjour|merci|prix|sécurité|alarme|devis|maison)\b/i.test(t))return'fr';return'nl';}
function typingDelay(r){return Math.min(1800,400+r.length*11);}

var T={
  nl:{welcome:'Goeiedag! 👋 Hoe kan ik u helpen?',status:'Virtuele assistent · online',placeholder:'Stel uw vraag…',error:'Er is een probleem opgetreden. Bel ons op <a href="tel:+32485280280" style="color:#39b6aa">+32 485 280 280</a>.',rateLimit:'Te veel berichten. Wacht even voor u verdergaat.'},
  fr:{welcome:'Bonjour ! 👋 Comment puis-je vous aider ?',status:'Assistant virtuel · en ligne',placeholder:'Posez votre question…',error:'Une erreur est survenue. Appelez-nous au <a href="tel:+32485280280" style="color:#39b6aa">+32 485 280 280</a>.',rateLimit:'Trop de messages. Veuillez patienter.'}
};

var CHAT_ICO='<svg viewBox="0 0 24 24" fill="none" width="28" height="28"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" fill="white" opacity=".97"/><circle cx="9" cy="10" r="1.3" fill="#39b6aa"/><circle cx="12" cy="10" r="1.3" fill="#39b6aa"/><circle cx="15" cy="10" r="1.3" fill="#39b6aa"/></svg>';
var CLOSE='<svg viewBox="0 0 24 24" fill="none" width="15" height="15"><path d="M18 6L6 18M6 6l12 12" stroke="white" stroke-width="2.2" stroke-linecap="round"/></svg>';
var CLOSE_DARK='<svg viewBox="0 0 24 24" fill="none" width="15" height="15"><path d="M18 6L6 18M6 6l12 12" stroke="#131413" stroke-width="2.2" stroke-linecap="round"/></svg>';
var SEND='<svg viewBox="0 0 24 24" fill="none" width="17" height="17"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

var CSS='#_dtx,#_dtx *{box-sizing:border-box;margin:0;padding:0;font-family:\'Poppins\',-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}'
+'#_dtxf{position:fixed;bottom:24px;right:24px;z-index:2147483647;width:60px;height:60px;border-radius:50%;background:#39b6aa;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 24px rgba(1,59,49,.4);transition:transform .2s,box-shadow .2s}'
+'#_dtxf:hover{transform:scale(1.07);box-shadow:0 6px 32px rgba(1,59,49,.55)}'
+'#_dtxbdg{position:absolute;top:-2px;right:-2px;width:16px;height:16px;border-radius:50%;background:#e53e3e;border:2.5px solid #fff;font-size:9px;font-weight:700;color:#fff;display:flex;align-items:center;justify-content:center}'
+'#_dtxw{position:fixed;bottom:96px;right:24px;z-index:2147483646;width:362px;max-height:540px;border-radius:20px;background:#fff;display:flex;flex-direction:column;box-shadow:0 16px 56px rgba(1,59,49,.18),0 0 0 1px rgba(0,0,0,.06);opacity:0;transform:translateY(16px) scale(.97);pointer-events:none;transition:opacity .2s,transform .28s cubic-bezier(.34,1.56,.64,1)}'
+'#_dtxw.on{opacity:1;transform:none;pointer-events:all}'
+'#_dtxhd{background:#ECEEED;border-bottom:1px solid #dbe5e2;border-radius:20px 20px 0 0;padding:13px 16px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0}'
+'._hd-left{display:flex;align-items:center;gap:11px}'
+'._hlogo{height:30px;width:auto;display:block}'
+'._st{font-size:10px;color:#5b7873;display:flex;align-items:center;gap:5px;margin-top:1px}'
+'._sd{width:6px;height:6px;border-radius:50%;background:#39b6aa;flex-shrink:0;animation:_pls 2.2s infinite}'
+'@keyframes _pls{0%,100%{opacity:1}50%{opacity:.3}}'
+'#_dtxcl{background:rgba(0,0,0,.06);border:none;border-radius:50%;width:30px;height:30px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .15s;flex-shrink:0}'
+'#_dtxcl:hover{background:rgba(0,0,0,.12)}'
+'#_dtxms{flex:1;overflow-y:auto;padding:14px 14px;display:flex;flex-direction:column;gap:11px;scroll-behavior:smooth;min-height:120px}'
+'#_dtxms::-webkit-scrollbar{width:3px}#_dtxms::-webkit-scrollbar-thumb{background:#e2e8f0;border-radius:2px}'
+'._mw{display:flex;gap:8px;align-items:flex-end;animation:_min .18s ease}'
+'@keyframes _min{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:none}}'
+'._mw.u{flex-direction:row-reverse}'
+'._mb{max-width:82%;padding:11px 15px;border-radius:16px;font-size:14px;line-height:1.55;word-break:break-word}'
+'._mw.b ._mb{background:#f1f3f5;color:#1a2332;border-bottom-left-radius:3px}'
+'._mw.u ._mb{background:#39b6aa;color:#fff;border-bottom-right-radius:3px}'
+'._mb a{color:#39b6aa;text-decoration:underline}'
+'._mw.u ._mb a{color:#fff}'
+'._mav{width:28px;height:28px;border-radius:50%;flex-shrink:0;background:#39b6aa;display:flex;align-items:center;justify-content:center}'
+'._ty{display:flex;gap:5px;padding:10px 13px;align-items:center}'
+'._ty span{width:7px;height:7px;border-radius:50%;background:#b0bec5;animation:_bo .85s ease infinite}'
+'._ty span:nth-child(2){animation-delay:.15s}._ty span:nth-child(3){animation-delay:.3s}'
+'@keyframes _bo{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}'
+'._err{font-size:11px;color:#c53030;background:#fff5f5;padding:7px 11px;border-radius:8px;border:1px solid #fed7d7}'
+'#_dtxia{padding:11px 13px;border-top:1px solid #f0f2f4;display:flex;gap:9px;align-items:flex-end;flex-shrink:0;background:#fff;border-radius:0 0 20px 20px}'
+'#_dtxta{flex:1;border:1.5px solid #e2e8f0;border-radius:20px;padding:9px 14px;font-size:13px;resize:none;max-height:88px;outline:none;line-height:1.45;transition:border-color .18s;font-family:inherit;color:#1a2332;background:#fff}'
+'#_dtxta:focus{border-color:#39b6aa}'
+'#_dtxta::placeholder{color:#a0aec0}'
+'#_dtxsb{width:38px;height:38px;border-radius:50%;flex-shrink:0;background:#39b6aa;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .15s,transform .1s}'
+'#_dtxsb:hover{background:#117B69}'
+'#_dtxsb:active{transform:scale(.91)}'
+'#_dtxsb:disabled{background:#b0bec5;cursor:not-allowed}'
+'#_dtxpw{text-align:center;padding:5px 0 7px;font-size:9px;color:#9fb4af;flex-shrink:0;line-height:1.5}'
+'#_dtxpw a{color:#39b6aa;text-decoration:underline}'
+'@media(max-width:400px){#_dtxw{width:calc(100vw - 20px);right:10px;bottom:88px}}';

var root=document.createElement('div');root.id='_dtx';
var sty=document.createElement('style');sty.textContent=CSS;root.appendChild(sty);
var fab=document.createElement('button');fab.id='_dtxf';fab.setAttribute('aria-label','DETEXI chat');
fab.innerHTML=CHAT_ICO;
var bdg=document.createElement('div');bdg.id='_dtxbdg';bdg.textContent='1';fab.appendChild(bdg);
root.appendChild(fab);
var win=document.createElement('div');win.id='_dtxw';win.setAttribute('role','dialog');win.setAttribute('aria-modal','true');
var hd=document.createElement('div');hd.id='_dtxhd';
hd.innerHTML='<div class="_hd-left"><img class="_hlogo" src="'+LOGO_URL+'" alt="DETEXI"/><div class="_st"><span class="_sd"></span><span id="_dtxstatus"></span></div></div><button id="_dtxcl" aria-label="Sluiten">'+CLOSE_DARK+'</button>';
win.appendChild(hd);
var ms=document.createElement('div');ms.id='_dtxms';ms.setAttribute('role','log');ms.setAttribute('aria-live','polite');win.appendChild(ms);
var ia=document.createElement('div');ia.id='_dtxia';
ia.innerHTML='<textarea id="_dtxta" rows="1" maxlength="500" aria-label="Typ uw vraag"></textarea><button id="_dtxsb" aria-label="Verzenden">'+SEND+'</button>';
win.appendChild(ia);
var pw=document.createElement('div');pw.id='_dtxpw';win.appendChild(pw);
root.appendChild(win);document.body.appendChild(root);
var ta=document.getElementById('_dtxta'),sb=document.getElementById('_dtxsb'),open=false,busy=false;
var uiLang=(function(){var p=(document.documentElement.lang||navigator.language||'nl').toLowerCase();return p.startsWith('fr')?'fr':'nl';})();
var t=T[uiLang];ta.placeholder=t.placeholder;
var _st=document.getElementById('_dtxstatus');if(_st)_st.textContent=t.status;
pw.innerHTML=(uiLang==='fr'?'Assistant virtuel Detexi · vos données sont traitées selon notre <a href="https://detexi.be/privacybeleid" target="_blank" rel="noopener">politique de confidentialité</a>':'Virtuele assistent Detexi · uw gegevens worden verwerkt volgens ons <a href="https://detexi.be/privacybeleid" target="_blank" rel="noopener">privacybeleid</a>');
function mkAv(){var d=document.createElement('div');d.className='_mav';d.innerHTML=AV_ICO;return d;}
function mdClean(s){return String(s).replace(/\*\*(.*?)\*\*/g,'$1').replace(/__(.*?)__/g,'$1').replace(/^#{1,6}\s+/gm,'').replace(/^\s*[-*]\s+/gm,'• ').replace(/\*\*/g,'').replace(/\n/g,'<br>');}
function addMsg(html,role){var w=document.createElement('div');w.className='_mw '+(role==='user'?'u':'b');if(role!=='user'){w.appendChild(mkAv());}var b=document.createElement('div');b.className='_mb';b.innerHTML=html;w.appendChild(b);ms.appendChild(w);ms.scrollTop=ms.scrollHeight;}
function showTyping(){var w=document.createElement('div');w.className='_mw b';w.id='_dtxty';w.appendChild(mkAv());var b=document.createElement('div');b.className='_mb _ty';b.innerHTML='<span></span><span></span><span></span>';w.appendChild(b);ms.appendChild(w);ms.scrollTop=ms.scrollHeight;}
function hideTyping(){var x=document.getElementById('_dtxty');if(x)x.remove();}
function esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
function showErr(html){var w=document.createElement('div');w.className='_mw b';w.appendChild(mkAv());var b=document.createElement('div');b.className='_mb _err';b.innerHTML=html;w.appendChild(b);ms.appendChild(w);ms.scrollTop=ms.scrollHeight;}
function send(){if(busy)return;var raw=ta.value.trim();if(!raw)return;if(!rateOk()){showErr(t.rateLimit);return;}var msg=clean(raw);if(!msg)return;ta.value='';ta.style.height='auto';addMsg(esc(msg),'user');busy=true;sb.disabled=true;showTyping();var url=new URL(WH);url.searchParams.set('chatInput',msg);url.searchParams.set('sessionId',sid);url.searchParams.set('lang',detectLang(msg));url.searchParams.set('_fp',fp);url.searchParams.set('_src',SRC);fetch(url.toString(),{method:'GET',headers:{'Accept':'application/json'}}).then(function(r){if(!r.ok)throw new Error('HTTP '+r.status);return r.json();}).then(function(d){var reply=((Array.isArray(d)&&d[0]&&(d[0].output||d[0].response||d[0].text))||d.output||d.response||d.message||d.text||null);if(!reply)throw new Error('empty');setTimeout(function(){hideTyping();addMsg(mdClean(reply),'bot');busy=false;sb.disabled=false;},typingDelay(reply));}).catch(function(){hideTyping();showErr(t.error);busy=false;sb.disabled=false;});}
function toggle(){open=!open;win.classList.toggle('on',open);if(open){bdg.style.display='none';fab.innerHTML=CLOSE;setTimeout(function(){ta.focus();},280);}else{fab.innerHTML=CHAT_ICO;fab.appendChild(bdg);bdg.style.display='flex';}}
fab.addEventListener('click',toggle);document.getElementById('_dtxcl').addEventListener('click',toggle);sb.addEventListener('click',send);
ta.addEventListener('keydown',function(e){if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send();}});
ta.addEventListener('input',function(){ta.style.height='auto';ta.style.height=Math.min(ta.scrollHeight,88)+'px';});
setTimeout(function(){addMsg(t.welcome,'bot');},700);
})();
