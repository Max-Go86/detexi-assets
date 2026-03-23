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
#dtx-callback*{box-sizing:border-box;margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
#dtx-callback{
  background:#0a0a0a;
  border:1.5px solid rgba(42,168,168,0.2);
  border-radius:20px;
  padding:32px;
  max-width:420px;
  width:100%;
  position:relative;
  overflow:hidden;
}
#dtx-callback::before{
  content:'';
  position:absolute;
  top:-60px;right:-60px;
  width:200px;height:200px;
  border-radius:50%;
  background:radial-gradient(circle,rgba(42,168,168,0.08) 0%,transparent 70%);
  pointer-events:none;
}
._cb-badge{
  display:inline-flex;align-items:center;gap:6px;
  background:rgba(42,168,168,0.12);
  border:1px solid rgba(42,168,168,0.25);
  border-radius:20px;padding:4px 12px;
  font-size:11px;font-weight:600;color:#2aa8a8;
  letter-spacing:0.04em;text-transform:uppercase;
  margin-bottom:16px;
}
._cb-dot{
  width:7px;height:7px;border-radius:50%;
  background:#48bb78;
  animation:_cbpls 2s infinite;
}
@keyframes _cbpls{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.8)}}
._cb-title{
  font-size:22px;font-weight:700;
  color:#f5f5f5;line-height:1.25;
  margin-bottom:8px;
}
._cb-sub{
  font-size:13px;color:#888;
  line-height:1.55;margin-bottom:24px;
}
._cb-field{
  position:relative;margin-bottom:12px;
}
._cb-icon{
  position:absolute;left:14px;top:50%;
  transform:translateY(-50%);
  color:#2aa8a8;pointer-events:none;
}
._cb-input{
  width:100%;padding:13px 14px 13px 44px;
  background:rgba(255,255,255,0.05);
  border:1.5px solid rgba(42,168,168,0.2);
  border-radius:12px;
  font-size:14px;color:#f5f5f5;
  outline:none;transition:border-color .18s;
}
._cb-input::placeholder{color:#555}
._cb-input:focus{border-color:rgba(42,168,168,0.55)}
._cb-input.error{border-color:#ef4444}
._cb-errmsg{
  font-size:11px;color:#ef4444;
  margin-top:5px;display:none;
}
._cb-errmsg.show{display:block}
._cb-btn{
  width:100%;padding:14px;
  background:#2aa8a8;border:none;border-radius:12px;
  font-size:15px;font-weight:700;color:#0a0a0a;
  cursor:pointer;transition:background .15s,transform .1s,opacity .15s;
  display:flex;align-items:center;justify-content:center;gap:8px;
  margin-top:4px;
}
._cb-btn:hover:not(:disabled){background:#1d7a7a}
._cb-btn:active:not(:disabled){transform:scale(.98)}
._cb-btn:disabled{opacity:0.6;cursor:not-allowed;background:#555;color:#aaa}
._cb-spinner{
  width:18px;height:18px;border-radius:50%;
  border:2.5px solid rgba(0,0,0,0.25);
  border-top-color:#0a0a0a;
  animation:_cbspin .7s linear infinite;
  flex-shrink:0;
}
@keyframes _cbspin{to{transform:rotate(360deg)}}
._cb-success{
  text-align:center;padding:16px 0;
}
._cb-success-icon{font-size:44px;margin-bottom:12px}
._cb-success-title{font-size:19px;font-weight:700;color:#f5f5f5;margin-bottom:6px}
._cb-success-sub{font-size:13px;color:#888;line-height:1.5}
._cb-err-banner{
  background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.25);
  border-radius:10px;padding:10px 14px;
  font-size:12px;color:#f87171;
  margin-top:10px;display:none;text-align:center;
}
._cb-err-banner.show{display:block}
._cb-legal{
  font-size:10px;color:#444;
  text-align:center;margin-top:14px;line-height:1.5;
}
._cb-legal a{color:#2aa8a8;text-decoration:none}
`;

function mount(target){
  // Inject CSS once
  if(!document.getElementById('_dtx_cb_style')){
    var s=document.createElement('style');
    s.id='_dtx_cb_style';s.textContent=CSS;
    document.head.appendChild(s);
  }

  var submitted=[];
  var cooldown=0;
  var timer=null;

  function render(state){
    target.innerHTML='';
    var wrap=document.createElement('div');
    wrap.id='dtx-callback';

    if(state==='success'){
      wrap.innerHTML=`
        <div class="_cb-success">
          <div class="_cb-success-icon">✅</div>
          <div class="_cb-success-title">U wordt zo dadelijk gebeld!</div>
          <div class="_cb-success-sub">Houd uw telefoon bij de hand.<br>Onze adviseur belt u binnen 30 seconden.</div>
        </div>`;
    } else {
      wrap.innerHTML=`
        <div class="_cb-badge"><span class="_cb-dot"></span>Gratis & direct</div>
        <div class="_cb-title">Word nu teruggebeld</div>
        <div class="_cb-sub">Laat uw nummer achter, onze adviseur belt u<br>binnen 30 seconden terug.</div>
        <div class="_cb-field">
          <svg class="_cb-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C9.61 21 3 14.39 3 6a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.25 1.01l-2.2 2.2z" fill="currentColor"/>
          </svg>
          <input id="_cb_phone" class="_cb-input" type="tel" placeholder="Bv. 0471 23 45 67" maxlength="20" autocomplete="tel"/>
          <div id="_cb_errmsg" class="_cb-errmsg">Ongeldig Belgisch nummer (bv: 0471 23 45 67)</div>
          <div id="_cb_dupmsg" class="_cb-errmsg">Dit nummer is al ingediend.</div>
        </div>
        <button id="_cb_btn" class="_cb-btn" type="button">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C9.61 21 3 14.39 3 6a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.25 1.01l-2.2 2.2z" fill="currentColor"/>
          </svg>
          Bel me terug
        </button>
        <div id="_cb_errbanner" class="_cb-err-banner">
          ❌ Er is een fout opgetreden. Probeer het opnieuw of bel <a href="tel:+32485280280">+32 485 28 02 80</a>.
        </div>
        <div class="_cb-legal">Door dit formulier te verzenden gaat u akkoord dat Detexi contact met u opneemt. Geen spam, nooit gedeeld.</div>`;
    }

    target.appendChild(wrap);

    if(state==='success') return;

    var inp=document.getElementById('_cb_phone');
    var btn=document.getElementById('_cb_btn');
    var errmsg=document.getElementById('_cb_errmsg');
    var dupmsg=document.getElementById('_cb_dupmsg');
    var errbanner=document.getElementById('_cb_errbanner');

    // Restore cooldown if active
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

      if(!PHONE_RE.test(raw)){
        inp.classList.add('error');
        errmsg.classList.add('show');
        return;
      }
      var fmt=e164(raw);
      if(submitted.includes(fmt)){
        dupmsg.classList.add('show');
        return;
      }
      doSubmit(fmt,inp,btn,errbanner);
    });

    inp.addEventListener('keydown',function(e){
      if(e.key==='Enter'){btn.click();}
    });
  }

  function setDisabled(btn,secs){
    if(!btn) return;
    btn.disabled=true;
    btn.innerHTML='<span class="_cb-spinner"></span>Wachten '+secs+'s...';
    if(timer) clearInterval(timer);
    timer=setInterval(function(){
      secs--;
      cooldown=secs;
      if(secs<=0){
        clearInterval(timer);
        if(btn){
          btn.disabled=false;
          btn.innerHTML='<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C9.61 21 3 14.39 3 6a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.25 1.01l-2.2 2.2z" fill="currentColor"/></svg> Bel me terug';
        }
      } else {
        if(btn) btn.innerHTML='<span class="_cb-spinner"></span>Wachten '+secs+'s...';
      }
    },1000);
  }

  async function doSubmit(fmt,inp,btn,errbanner){
    btn.disabled=true;
    btn.innerHTML='<span class="_cb-spinner"></span>Verbinden...';
    var ctrl=new AbortController();
    var to=setTimeout(function(){ctrl.abort();},10000);
    try{
      var res=await fetch(WH,{
        method:'POST',
        headers:{'Content-Type':'application/json','X-Detexi-Token':TOKEN},
        signal:ctrl.signal,
        body:JSON.stringify({phone:fmt,source:'webflow_alarmsysteem',timestamp:new Date().toISOString()})
      });
      clearTimeout(to);
      if(!res.ok) throw new Error('HTTP '+res.status);
      submitted.push(fmt);
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

// Auto-mount on #dtx-callback if present, or wait for DOM
function init(){
  var t=document.getElementById('dtx-callback');
  if(t){mount(t);}
}

if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',init);
} else {
  init();
}
})();
