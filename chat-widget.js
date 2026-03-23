(function(){
'use strict';
if(document.getElementById('_dtx'))return;

var WH='https://max-go.app.n8n.cloud/webhook/5a36b2a9-5d3a-47b5-a65e-f83b9ee9abdb';
var SRC='detexi-web-v1';
var MAX_MSG=10,WIN_MS=60000,MAX_LEN=500;
var CDN='https://cdn.jsdelivr.net/gh/Max-Go86/detexi-assets@main/';
var LOGO_URL=CDN+'detexi-logo-header.png';
var ICON_URL=CDN+'detexi-icon.png';

var sid=(function(){var s=sessionStorage.getItem('_dtxs');if(!s){s=Date.now().toString(36)+Math.random().toString(36).slice(2);sessionStorage.setItem('_dtxs',s);}return s;})();
var fp=(function(){try{return btoa([navigator.language,screen.width,screen.height,screen.colorDepth,navigator.hardwareConcurrency||0,Intl.DateTimeFormat().resolvedOptions().timeZone].join('|')).slice(0,24);}catch(e){return'x';}})();
var _rt=[];
function rateOk(){var n=Date.now();_rt=_rt.filter(function(x){return n-x<60000;});if(_rt.length>=10)return false;_rt.push(n);return true;}
function clean(s){return s.replace(/<[^>]*>/g,'').replace(/[\x00-\x08\x0B\x0E-\x1F\x7F]/g,'').replace(/\bignore\s+(all\s+)?(previous|above|prior)\s+instructions?/gi,'[x]').replace(/\bsystem\s*:/gi,'[x]').replace(/\[INST\]|\[\/INST\]|###\s*[Ss]ystem/g,'[x]').replace(/\bpretend\s+(you\s+are|to\s+be)\b/gi,'[x]').replace(/\bjailbreak\b/gi,'[x]').replace(/\bDAN\s+mode\b/gi,'[x]').trim().slice(0,500);}
function detectLang(t){if(/\b(ik|je|jij|de|het|een|beveiliging|alarm|prijs|installeren|woning)\b/i.test(t))return'nl';if(/[\u00e0\u00e2\u00e7\u00e9\u00e8\u00ea\u00eb\u00ee\u00ef\u00f4\u00fb\u00f9\u00fc]|\b(bonjour|merci|prix|s\u00e9curit\u00e9|alarme|devis|maison)\b/i.test(t))return'fr';return'nl';}
function typingDelay(r){return Math.min(1800,400+r.length*11);}

var T={
  nl:{welcome:'Goeiedag! Ik ben de DETEXI-assistent \uD83D\uDD12<br>Hoe kan ik u helpen? Stel gerust vragen over onze alarmsystemen, prijzen of vraag een gratis diagnosebezoek aan.',placeholder:'Stel uw vraag\u2026',error:'Er is een probleem opgetreden. Bel ons op <a href="tel:+32485280280" style="color:#2aa8a8">+32\u00a0485\u00a0280\u00a0280</a>.',rateLimit:'Te veel berichten. Wacht even voor u verdergaat.',disc:'\uD83E\uDD16 Virtuele assistent (AI) \u2014 geen menselijke medewerker'},
  fr:{welcome:'Bonjour\u00a0! Je suis l\u2019assistant DETEXI \uD83D\uDD12<br>Comment puis-je vous aider\u00a0? Posez vos questions sur nos syst\u00e8mes d\u2019alarme, nos tarifs ou demandez un diagnostic gratuit.',placeholder:'Posez votre question\u2026',error:'Une erreur est survenue. Appelez-nous au <a href="tel:+32485280280" style="color:#2aa8a8">+32\u00a0485\u00a0280\u00a0280</a>.',rateLimit:'Trop de messages. Veuillez patienter.',disc:'\uD83E\uDD16 Assistant virtuel (IA) \u2014 pas un collaborateur humain'}
};

var CLOSE='<svg viewBox="0 0 24 24" fill="none" width="15" height="15"><path d="M18 6L6 18M6 6l12 12" stroke="white" stroke-width="2.2" stroke-linecap="round"/></svg>';
var SEND='<svg viewBox="0 0 24 24" fill="none" width="17" height="17"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

var CSS='#_dtx,#_dtx *{box-sizing:border-box;margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}'
+'#_dtxf{position:fixed;bottom:24px;right:24px;z-index:2147483647;width:58px;height:58px;border-radius:50%;background:#2aa8a8;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 24px rgba(42,168,168,.45);transition:transform .2s,box-shadow .2s;overflow:hidden;padding:2px}'
+'#_dtxf:hover{transform:scale(1.07);box-shadow:0 6px 32px rgba(42,168,168,.6)}'
+'#_dtxbdg{position:absolute;top:-2px;right:-2px;width:16px;height:16px;border-radius:50%;background:#e53e3e;border:2.5px solid #fff;font-size:9px;font-weight:700;color:#fff;display:flex;align-items:center;justify-content:center}'
+'#_dtxw{position:fixed;bottom:94px;right:24px;z-index:2147483646;width:348px;max-height:530px;border-radius:20px;background:#fff;display:flex;flex-direction:column;box-shadow:0 16px 56px rgba(0,0,0,.14),0 0 0 1px rgba(0,0,0,.05);opacity:0;transform:translateY(16px) scale(.97);pointer-events:none;transition:opacity .2s,transform .28s cubic-bezier(.34,1.56,.64,1)}'
+'#_dtxw.on{opacity:1;transform:none;pointer-events:all}'
+'#_dtxhd{padding:14px 18px;background:linear-gradient(135deg,#2aa8a8,#1d7a7a);border-radius:20px 20px 0 0;display:flex;align-items:center;justify-content:space-between;flex-shrink:0}'
+'._hi{display:flex;flex-direction:column;gap:3px}'
+'._logo{height:26px;width:auto;object-fit:contain;display:block;filter:brightness(0) invert(1)}'
+'._st{font-size:10px;color:rgba(255,255,255,.82);display:flex;align-items:center;gap:5px}'
+'._sd{width:6px;height:6px;border-radius:50%;background:#48bb78;flex-shrink:0;animation:_pls 2.2s infinite}'
+'@keyframes _pls{0%,100%{opacity:1}50%{opacity:.3}}'
+'#_dtxcl{background:rgba(255,255,255,.14);border:none;border-radius:50%;width:30px;height:30px;cursor:pointer;color:#fff;display:flex;align-items:center;justify-content:center;transition:background .15s;flex-shrink:0}'
+'#_dtxcl:hover{background:rgba(255,255,255,.26)}'
+'#_dtxdc{background:#eaf6f6;padding:7px 18px;font-size:10px;color:#1d7a7a;text-align:center;border-bottom:1px solid rgba(42,168,168,.1);flex-shrink:0}'
+'#_dtxms{flex:1;overflow-y:auto;padding:14px 15px;display:flex;flex-direction:column;gap:12px;scroll-behavior:smooth;min-height:120px}'
+'#_dtxms::-webkit-scrollbar{width:3px}#_dtxms::-webkit-scrollbar-thumb{background:#e2e8f0;border-radius:2px}'
+'._mw{display:flex;gap:8px;align-items:flex-end;animation:_min .18s ease}'
+'@keyframes _min{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:none}}'
+'._mw.u{flex-direction:row-reverse}'
+'._mb{max-width:82%;padding:9px 13px;border-radius:15px;font-size:13px;line-height:1.58;word-break:break-word}'
+'._mw.b ._mb{background:#f1f3f5;color:#1a2332;border-bottom-left-radius:3px}'
+'._mw.u ._mb{background:#2aa8a8;color:#fff;border-bottom-right-radius:3px}'
+'._mb a{color:#2aa8a8;text-decoration:underline}'
+'._mw.u ._mb a{color:#fff}'
+'._mav{width:28px;height:28px;border-radius:50%;overflow:hidden;flex-shrink:0;background:#eaf6f6;border:1.5px solid rgba(42,168,168,.2)}'
+'._mav img{width:100%;height:100%;object-fit:contain}'
+'._ty{display:flex;gap:5px;padding:10px 13px;align-items:center}'
+'._ty span{width:7px;height:7px;border-radius:50%;background:#b0bec5;animation:_bo .85s ease infinite}'
+'._ty span:nth-child(2){animation-delay:.15s}._ty span:nth-child(3){animation-delay:.3s}'
+'@keyframes _bo{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}'
+'._err{font-size:11px;color:#c53030;background:#fff5f5;padding:7px 11px;border-radius:8px;border:1px solid #fed7d7}'
+'#_dtxia{padding:11px 14px;border-top:1px solid #f0f2f4;display:flex;gap:9px;align-items:flex-end;flex-shrink:0;background:#fff;border-radius:0 0 20px 20px}'
+'#_dtxta{flex:1;border:1.5px solid #e2e8f0;border-radius:20px;padding:9px 14px;font-size:13px;resize:none;max-height:88px;outline:none;line-height:1.45;transition:border-color .18s;font-family:inherit;color:#1a2332;background:#fff}'
+'#_dtxta:focus{border-color:#2aa8a8}'
+'#_dtxta::placeholder{color:#a0aec0}'
+'#_dtxsb{width:38px;height:38px;border-radius:50%;flex-shrink:0;background:#2aa8a8;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .15s,transform .1s}'
+'#_dtxsb:hover{background:#1d7a7a}'
+'#_dtxsb:active{transform:scale(.91)}'
+'#_dtxsb:disabled{background:#b0bec5;cursor:not-allowed}'
+'#_dtxpw{text-align:center;padding:5px 0 8px;font-size:9px;color:#cbd5e0;flex-shrink:0}'
+'@media(max-width:400px){#_dtxw{width:calc(100vw - 20px);right:10px;bottom:88px}}';

var root=document.createElement('div');root.id='_dtx';
var sty=document.createElement('style');sty.textContent=CSS;root.appendChild(sty);
var fab=document.createElement('button');fab.id='_dtxf';fab.setAttribute('aria-label','DETEXI assistent');
var fabImg=document.createElement('img');fabImg.src=ICON_URL;fabImg.alt='DETEXI';fabImg.style.cssText='width:52px;height:52px;object-fit:contain;border-radius:50%';
fab.appendChild(fabImg);
var bdg=document.createElement('div');bdg.id='_dtxbdg';bdg.textContent='1';fab.appendChild(bdg);
root.appendChild(fab);
var win=document.createElement('div');win.id='_dtxw';win.setAttribute('role','dialog');win.setAttribute('aria-modal','true');
var hd=document.createElement('div');hd.id='_dtxhd';
hd.innerHTML='<div class="_hi"><img class="_logo" src="'+LOGO_URL+'" alt="DETEXI"/><div class="_st"><span class="_sd"></span>Online &mdash; antwoordt direct</div></div><button id="_dtxcl" aria-label="Sluiten">'+CLOSE+'</button>';
win.appendChild(hd);
var dc=document.createElement('div');dc.id='_dtxdc';win.appendChild(dc);
var ms=document.createElement('div');ms.id='_dtxms';ms.setAttribute('role','log');ms.setAttribute('aria-live','polite');win.appendChild(ms);
var ia=document.createElement('div');ia.id='_dtxia';ia.innerHTML='<textarea id="_dtxta" rows="1" maxlength="500" aria-label="Typ uw vraag"></textarea><button id="_dtxsb" aria-label="Verzenden">'+SEND+'</button>';win.appendChild(ia);
var pw=document.createElement('div');pw.id='_dtxpw';pw.innerHTML='DETEXI \u00a9 2026 \u2014 AI-assistent';win.appendChild(pw);
root.appendChild(win);document.body.appendChild(root);
var ta=document.getElementById('_dtxta'),sb=document.getElementById('_dtxsb'),open=false,busy=false;
var uiLang=(function(){var p=(document.documentElement.lang||navigator.language||'nl').toLowerCase();return p.startsWith('fr')?'fr':'nl';})();
var t=T[uiLang];ta.placeholder=t.placeholder;dc.innerHTML=t.disc;
function mkAv(){var d=document.createElement('div');d.className='_mav';var i=document.createElement('img');i.src=ICON_URL;i.alt='';d.appendChild(i);return d;}
function addMsg(html,role){var w=document.createElement('div');w.className='_mw '+(role==='user'?'u':'b');if(role!=='user'){w.appendChild(mkAv());}var b=document.createElement('div');b.className='_mb';b.innerHTML=html;w.appendChild(b);ms.appendChild(w);ms.scrollTop=ms.scrollHeight;}
function showTyping(){var w=document.createElement('div');w.className='_mw b';w.id='_dtxty';w.appendChild(mkAv());var b=document.createElement('div');b.className='_mb _ty';b.innerHTML='<span></span><span></span><span></span>';w.appendChild(b);ms.appendChild(w);ms.scrollTop=ms.scrollHeight;}
function hideTyping(){var x=document.getElementById('_dtxty');if(x)x.remove();}
function esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
function showErr(html){var w=document.createElement('div');w.className='_mw b';w.appendChild(mkAv());var b=document.createElement('div');b.className='_mb _err';b.innerHTML=html;w.appendChild(b);ms.appendChild(w);ms.scrollTop=ms.scrollHeight;}
function send(){if(busy)return;var raw=ta.value.trim();if(!raw)return;if(!rateOk()){showErr(t.rateLimit);return;}var msg=clean(raw);if(!msg)return;ta.value='';ta.style.height='auto';addMsg(esc(msg),'user');busy=true;sb.disabled=true;showTyping();var url=new URL(WH);url.searchParams.set('chatInput',msg);url.searchParams.set('sessionId',sid);url.searchParams.set('lang',detectLang(msg));url.searchParams.set('_fp',fp);url.searchParams.set('_src',SRC);fetch(url.toString(),{method:'GET',headers:{'Accept':'application/json','X-Widget-Source':SRC}}).then(function(r){if(!r.ok)throw new Error('HTTP '+r.status);return r.json();}).then(function(d){var reply=((Array.isArray(d)&&d[0]&&(d[0].output||d[0].response||d[0].text))||d.output||d.response||d.message||d.text||null);if(!reply)throw new Error('empty');setTimeout(function(){hideTyping();addMsg(reply.replace(/\n/g,'<br>'),'bot');busy=false;sb.disabled=false;},typingDelay(reply));}).catch(function(){hideTyping();showErr(t.error);busy=false;sb.disabled=false;});}
function toggle(){open=!open;win.classList.toggle('on',open);if(open){bdg.style.display='none';setTimeout(function(){ta.focus();},280);}else{bdg.style.display='flex';}}
fab.addEventListener('click',toggle);document.getElementById('_dtxcl').addEventListener('click',toggle);sb.addEventListener('click',send);
ta.addEventListener('keydown',function(e){if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send();}});
ta.addEventListener('input',function(){ta.style.height='auto';ta.style.height=Math.min(ta.scrollHeight,88)+'px';});
setTimeout(function(){addMsg(t.welcome,'bot');},700);
})();