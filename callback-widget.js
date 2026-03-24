(function(){
'use strict';
if(document.getElementById('_dtx_cb_style'))return;

var WH='https://max-go.app.n8n.cloud/webhook/detexi-outbound-call';
var TOKEN='dtx_web_8f3a1c9e2b6d4f7a0e8c3b5d9f2a7e4c';
var PHONE_RE=/^(0[2-9]\d{1,2}[\s.\-]?\d{2}[\s.\-]?\d{2}[\s.\-]?\d{2}|\+32[\s.\-]?\d{1,3}[\s.\-]?\d{2}[\s.\-]?\d{2}[\s.\-]?\d{2})$/;

function e164(raw){
  var p=raw.replace(/[\s\-\.\(\)]/g,'');
  if(p.startsWith('00'))return'+'+p.slice(2);
  if(p.startsWith('0'))return'+32'+p.slice(1);
  if(!p.startsWith('+'))return'+32'+p;
  return p;
}

var CSS=`
.dtx-cb-wrap*{box-sizing:border-box;margin:0;padding:0;font-family:Raleway,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
.dtx-cb-wrap{background:#131413 !important;border-radius:14px;padding:20px 20px 20px 0;width:100%;display:flex;overflow:hidden;border:0.5px solid rgba(255,255,255,0.08);position:relative;}
.dtx-cb-wrap.hero{background:rgba(19,20,19,0.92) !important;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);}
#dtx-callback-hero{position:absolute !important;bottom:40px !important;right:40px !important;width:300px !important;z-index:10 !important;display:block !important;}
._cb-accent{width:4px;background:#2aa8a8;border-radius:0 2px 2px 0;flex-shrink:0;margin-right:18px;}
._cb-content{flex:1;min-width:0;}
._cb-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;}
._cb-title{font-size:16px;font-weight:700;color:#ffffff !important;letter-spacing:-0.01em;}
._cb-badge{background:transparent;border:1px solid rgba(255,255,255,0.25);border-radius:20px;padding:3px 10px;font-size:11px;color:#ffffff;font-weight:600;letter-spacing:0.06em;white-space:nowrap;}
._cb-sub{font-size:12px;color:#94a3b8;margin-bottom:14px;line-height:1.5;}
._cb-row{display:flex;gap:8px;align-items:center;}
._cb-input{flex:1;min-width:0;padding:10px 14px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);border-radius:8px;font-size:13px;color:#f1f5f9;outline:none;transition:border-color .18s;font-family:inherit;}
._cb-input::placeholder{color:#475569}
._cb-input:focus{border-color:#2aa8a8}
._cb-input.error{border-color:#ef4444}
._cb-errmsg{font-size:10px;color:#ef4444;margin-top:4px;display:none;}
._cb-errmsg.show{display:block}
._cb-btn{padding:10px 18px;background:#2aa8a8;border:none;border-radius:8px;font-size:13px;font-weight:700;color:#fff;white-space:nowrap;cursor:pointer;transition:background .15s,transform .1s;font-family:inherit;display:flex;align-items:center;justify-content:center;gap:6px;letter-spacing:0.01em;}
._cb-btn:hover:not(:disabled){background:#1d7a7a}
._cb-btn:active:not(:disabled){transform:scale(.98)}
._cb-btn:disabled{opacity:0.6;cursor:not-allowed;background:#334155;color:#94a3b8}
._cb-spinner{width:12px;height:12px;border-radius:50%;border:2px solid rgba(255,255,255,0.2);border-top-color:#fff;animation:_cbspin .7s linear infinite;flex-shrink:0;}
@keyframes _cbspin{to{transform:rotate(360deg)}}
._cb-legal{font-size:10px;color:#475569;margin-top:10px;line-height:1.5;}
._cb-legal a{color:#2aa8a8;text-decoration:none;}
._cb-legal a:hover{text-decoration:underline}
._cb-err-banner{background:rgba(239,68,68,0.1);border:0.5px solid rgba(239,68,68,0.25);border-radius:8px;padding:7px 10px;font-size:10px;color:#f87171;margin-top:8px;display:none;text-align:center;}
._cb-err-banner.show{display:block}
._cb-success{text-align:center;padding:12px 0;}
._cb-success-icon{font-size:28px;margin-bottom:6px;}
._cb-success-title{font-size:14px;font-weight:600;color:#f1f5f9;margin-bottom:4px;}
._cb-success-sub{font-size:11px;color:#64748b;line-height:1.5;}

@media(max-width:768px){
  #dtx-callback-hero{display:none !important;}
  ._cb-row{flex-direction:column;align-items:stretch;}
  ._cb-input{width:100%;}
  ._cb-btn{width:100%;padding:11px 16px;font-size:13px;}
}
`;

var PHONE_SVG='<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C9.61 21 3 14.39 3 6a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.25 1.01l-2.2 2.2z" fill="currentColor"/></svg>';

var _submitted=[];

function mount(target, isHero){
  if(!document.getElementById('_dtx_cb_style')){
    var s=document.createElement('style');
    s.id='_dtx_cb_style';s.textContent=CSS;
    document.head.appendChild(s);
  }
  if(isHero && target.parentElement){
    var par=target.parentElement;
    var cs=window.getComputedStyle(par);
    if(cs.position==='static') par.style.position='relative';
  }
  var cooldown=0;
  var timer=null;
  var uid=isHero?'h':'m';

  function render(state){
    target.innerHTML='';
    var wrap=document.createElement('div');
    wrap.className='dtx-cb-wrap'+(isHero?' hero':'');
    if(state==='success'){
      wrap.innerHTML=`
        <div class="_cb-accent"></div>
        <div class="_cb-content">
          <div class="_cb-success">
            <div class="_cb-success-icon">✅</div>
            <div class="_cb-success-title">U wordt zo dadelijk gebeld!</div>
            <div class="_cb-success-sub">Houd uw telefoon bij de hand.<br>Onze adviseur belt u binnen 30 seconden.</div>
          </div>
        </div>`;
    } else {
      wrap.innerHTML=`
        <div class="_cb-accent"></div>
        <div class="_cb-content">
          <div class="_cb-top">
            <div class="_cb-title">Terugbelverzoek</div>
            <div class="_cb-badge">GRATIS</div>
          </div>
          <div class="_cb-sub">Een adviseur belt u terug binnen 30 seconden.</div>
          <div class="_cb-row">
            <input id="_cb_phone_${uid}" class="_cb-input" type="tel" placeholder="0471 23 45 67" maxlength="20" autocomplete="tel"/>
            <button id="_cb_btn_${uid}" class="_cb-btn" type="button">${PHONE_SVG} Bel me</button>
          </div>
          <div id="_cb_errmsg_${uid}" class="_cb-errmsg">Ongeldig Belgisch nummer</div>
          <div id="_cb_dupmsg_${uid}" class="_cb-errmsg">Dit nummer is al ingediend.</div>
          <div id="_cb_errbanner_${uid}" class="_cb-err-banner">❌ Fout. Probeer opnieuw of bel <a href="tel:+32485280280">+32 485 28 02 80</a>.</div>
          <div class="_cb-legal">Door op "Bel me" te klikken bevestigt u dat u onze <a href="https://www.detexi.be/nl/privacyverklaring" target="_blank" rel="noopener">privacyverklaring</a> heeft gelezen en aanvaard.</div>
        </div>`;
    }
    target.appendChild(wrap);
    if(state==='success') return;
    var inp=document.getElementById('_cb_phone_'+uid);
    var btn=document.getElementById('_cb_btn_'+uid);
    var errmsg=document.getElementById('_cb_errmsg_'+uid);
    var dupmsg=document.getElementById('_cb_dupmsg_'+uid);
    var errbanner=document.getElementById('_cb_errbanner_'+uid);
    if(cooldown>0) setDisabled(btn,cooldown);
    inp.addEventListener('input',function(){
      inp.classList.remove('error');
      errmsg.classList.remove('show');
      dupmsg.classList.remove('show');
      errbanner.classList.remove('show');
    });
    btn.addEventListener('click',function(){
      var raw=inp.value.trim();
      errmsg.classList.remove('show');
      dupmsg.classList.remove('show');
      errbanner.classList.remove('show');
      if(!PHONE_RE.test(raw)){inp.classList.add('error');errmsg.classList.add('show');return;}
      var fmt=e164(raw);
      if(_submitted.includes(fmt)){dupmsg.classList.add('show');return;}
      doSubmit(fmt,btn,errbanner);
    });
    inp.addEventListener('keydown',function(e){if(e.key==='Enter')btn.click();});
  }

  function setDisabled(btn,secs){
    if(!btn)return;
    btn.disabled=true;
    btn.innerHTML='<span class="_cb-spinner"></span>'+secs+'s...';
    if(timer)clearInterval(timer);
    timer=setInterval(function(){
      secs--;cooldown=secs;
      if(secs<=0){
        clearInterval(timer);
        if(btn){btn.disabled=false;btn.innerHTML=PHONE_SVG+' Bel me';}
      } else {
        if(btn)btn.innerHTML='<span class="_cb-spinner"></span>'+secs+'s...';
      }
    },1000);
  }

  async function doSubmit(fmt,btn,errbanner){
    btn.disabled=true;
    btn.innerHTML='<span class="_cb-spinner"></span>Even wachten...';
    var ctrl=new AbortController();
    var to=setTimeout(function(){ctrl.abort();},10000);
    try{
      var res=await fetch(WH,{
        method:'POST',
        headers:{'Content-Type':'application/json','X-Detexi-Token':TOKEN},
        signal:ctrl.signal,
        body:JSON.stringify({phone:fmt,source:isHero?'webflow_hero':'webflow_alarmsysteem',timestamp:new Date().toISOString()})
      });
      clearTimeout(to);
      if(!res.ok)throw new Error('HTTP '+res.status);
      _submitted.push(fmt);
      render('success');
    }catch(err){
      clearTimeout(to);
      cooldown=60;
      setDisabled(btn,60);
      errbanner.classList.add('show');
    }
  }
  render('form');
}

function init(){
  var t1=document.getElementById('dtx-callback');
  if(t1) mount(t1, false);
  var t2=document.getElementById('dtx-callback-hero');
  if(t2) mount(t2, true);
}

if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',init);
} else {
  init();
}
})();
