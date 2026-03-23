(function(){
'use strict';

var TARGET='dtx-rappel';
var WH='https://max-go.app.n8n.cloud/webhook/detexi-outbound-call';
var TOKEN='dtx_web_8f3a1c9e2b6d4f7a0e8c3b5d9f2a7e4c';
var TEAL='#2aa8a8',DARK='#0a0a0a',BG='rgba(255,255,255,0.04)',BORDER='rgba(42,168,168,0.18)';

var PHONE_RE=/^(0[2-9]\d{1,2}[\s.\-]?\d{2}[\s.\-]?\d{2}[\s.\-]?\d{2}|\+32[\s.\-]?\d{1,3}[\s.\-]?\d{2}[\s.\-]?\d{2}[\s.\-]?\d{2})$/;

function e164(p){
  p=p.replace(/[\s\-.()+]/g,'');
  if(p.startsWith('00'))return'+'+p.slice(2);
  if(p.startsWith('0'))return'+32'+p.slice(1);
  if(!p.startsWith('+'))return'+32'+p;
  return p;
}

function inject(root){
  var CSS='#dtx-rappel-w *{box-sizing:border-box;margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}'
  +'#dtx-rappel-w{background:'+BG+';border:1px solid '+BORDER+';border-radius:16px;padding:28px 24px;max-width:420px;width:100%;position:relative;overflow:hidden}'
  +'#dtx-rappel-w::before{content:"";position:absolute;top:-60px;right:-60px;width:160px;height:160px;border-radius:50%;background:radial-gradient(circle,rgba(42,168,168,0.08),transparent 70%);pointer-events:none}'
  +'#dtx-rappel-w .dtxr-title{font-size:18px;font-weight:700;color:#f5f5f5;margin-bottom:6px;line-height:1.3}'
  +'#dtx-rappel-w .dtxr-sub{font-size:13px;color:#888;margin-bottom:20px;line-height:1.5}'
  +'#dtx-rappel-w .dtxr-row{display:flex;gap:10px;align-items:stretch}'
  +'#dtx-rappel-w .dtxr-inp-wrap{position:relative;flex:1}'
  +'#dtx-rappel-w .dtxr-ico{position:absolute;left:12px;top:50%;transform:translateY(-50%);pointer-events:none}'
  +'#dtx-rappel-w .dtxr-inp{width:100%;padding:12px 14px 12px 38px;border-radius:10px;border:1.5px solid '+BORDER+';background:rgba(255,255,255,0.05);color:#f5f5f5;font-size:14px;outline:none;transition:border-color .2s}'
  +'#dtx-rappel-w .dtxr-inp::placeholder{color:#555}'
  +'#dtx-rappel-w .dtxr-inp:focus{border-color:'+TEAL+'}'
  +'#dtx-rappel-w .dtxr-inp.err{border-color:#ef4444}'
  +'#dtx-rappel-w .dtxr-btn{padding:12px 18px;border-radius:10px;border:none;background:'+TEAL+';color:#0a0a0a;font-size:14px;font-weight:700;cursor:pointer;white-space:nowrap;transition:background .15s,opacity .15s;display:flex;align-items:center;gap:6px}'
  +'#dtx-rappel-w .dtxr-btn:hover:not(:disabled){background:#1d9090}'
  +'#dtx-rappel-w .dtxr-btn:disabled{opacity:0.6;cursor:not-allowed}'
  +'#dtx-rappel-w .dtxr-err{font-size:11px;color:#ef4444;margin-top:6px;display:none}'
  +'#dtx-rappel-w .dtxr-err.show{display:block}'
  +'#dtx-rappel-w .dtxr-ok{text-align:center;padding:8px 0;display:none}'
  +'#dtx-rappel-w .dtxr-ok.show{display:block}'
  +'#dtx-rappel-w .dtxr-ok-ico{font-size:28px;margin-bottom:8px}'
  +'#dtx-rappel-w .dtxr-ok-txt{font-size:15px;font-weight:700;color:#f5f5f5;margin-bottom:4px}'
  +'#dtx-rappel-w .dtxr-ok-sub{font-size:12px;color:#888}'
  +'#dtx-rappel-w .dtxr-legal{font-size:10px;color:#444;margin-top:14px;line-height:1.5}';

  var sty=document.createElement('style');
  sty.textContent=CSS;
  document.head.appendChild(sty);

  root.innerHTML=
    '<div id="dtx-rappel-w">'+
      '<div class="dtxr-ok" id="dtxr-ok">'+
        '<div class="dtxr-ok-ico">✅</div>'+
        '<div class="dtxr-ok-txt">U wordt zo dadelijk gebeld!</div>'+
        '<div class="dtxr-ok-sub">Houd uw telefoon bij de hand.</div>'+
      '</div>'+
      '<div id="dtxr-form">'+
        '<p class="dtxr-title">Word gratis teruggebeld binnen 30 seconden</p>'+
        '<p class="dtxr-sub">Voer uw nummer in — een adviseur belt u onmiddellijk.</p>'+
        '<div class="dtxr-row">'+
          '<div class="dtxr-inp-wrap">'+
            '<svg class="dtxr-ico" viewBox="0 0 24 24" fill="none" width="16" height="16"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.07 12 19.79 19.79 0 0 1 1 3.4 2 2 0 0 1 2.96 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" stroke="'+TEAL+'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'+
            '<input class="dtxr-inp" id="dtxr-inp" type="tel" placeholder="Ex: 0471 23 45 67" maxlength="20"/>'+
          '</div>'+
          '<button class="dtxr-btn" id="dtxr-btn">'+
            '<svg viewBox="0 0 24 24" fill="none" width="15" height="15"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.07 12 19.79 19.79 0 0 1 1 3.4 2 2 0 0 1 2.96 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" stroke="#0a0a0a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="#0a0a0a"/></svg>'+
            'Bel mij terug'+
          '</button>'+
        '</div>'+
        '<div class="dtxr-err" id="dtxr-err">Ongeldig Belgisch nummer (bv. 0471 23 45 67)</div>'+
        '<p class="dtxr-legal">Door dit formulier in te dienen, gaat u ermee akkoord dat DETEXI contact met u opneemt. Uw gegevens worden niet gedeeld met derden.</p>'+
      '</div>'+
    '</div>';

  var inp=document.getElementById('dtxr-inp');
  var btn=document.getElementById('dtxr-btn');
  var err=document.getElementById('dtxr-err');
  var ok=document.getElementById('dtxr-ok');
  var form=document.getElementById('dtxr-form');
  var cooldown=0,submitted=[];

  inp.addEventListener('input',function(){
    inp.classList.remove('err');
    err.classList.remove('show');
  });

  btn.addEventListener('click',function(){
    var raw=inp.value.trim();
    if(!PHONE_RE.test(raw)){
      inp.classList.add('err');
      err.classList.add('show');
      inp.focus();
      return;
    }
    var phone=e164(raw);
    if(submitted.indexOf(phone)>=0){
      err.textContent='Dit nummer werd al geregistreerd.';
      err.classList.add('show');
      return;
    }
    if(cooldown>0)return;

    btn.disabled=true;
    btn.textContent='Verbinden...';

    var ctrl=new AbortController();
    var to=setTimeout(function(){ctrl.abort();},10000);

    fetch(WH,{
      method:'POST',
      signal:ctrl.signal,
      headers:{'Content-Type':'application/json','X-Detexi-Token':TOKEN},
      body:JSON.stringify({phone:phone,source:'webflow_home',timestamp:new Date().toISOString()})
    })
    .then(function(r){
      clearTimeout(to);
      if(!r.ok)throw new Error('err');
      submitted.push(phone);
      form.style.display='none';
      ok.classList.add('show');
    })
    .catch(function(){
      clearTimeout(to);
      btn.disabled=false;
      btn.innerHTML='<svg viewBox="0 0 24 24" fill="none" width="15" height="15"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.07 12 19.79 19.79 0 0 1 1 3.4 2 2 0 0 1 2.96 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" stroke="#0a0a0a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="#0a0a0a"/></svg>Bel mij terug';
      err.textContent='Er is een fout opgetreden. Probeer opnieuw of bel +32 485 280 280.';
      err.classList.add('show');
    });
  });

  inp.addEventListener('keydown',function(e){
    if(e.key==='Enter'){btn.click();}
  });
}

function init(){
  var root=document.getElementById(TARGET);
  if(root)inject(root);
}

if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',init);
}else{
  init();
}
})();
