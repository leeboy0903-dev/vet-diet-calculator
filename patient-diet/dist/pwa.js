(() => {
 'use strict';
 const standalone=matchMedia('(display-mode: standalone)').matches||navigator.standalone;
 const button=document.getElementById('install-app'),dialog=document.getElementById('install-help');
 const installQuery=new URLSearchParams(location.search).get('install');
 let platform=installQuery==='ios'?'ios':installQuery==='android'?'android':/iPad|iPhone|iPod/.test(navigator.userAgent)||navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1?'ios':'android',installPrompt;
 const nativeInstall=document.getElementById('android-install');
 function renderInstall(){document.getElementById('install-title').textContent=platform==='ios'?'아이폰·아이패드에 설치':'안드로이드에 설치';document.getElementById('install-android').hidden=platform!=='android';document.getElementById('install-ios').hidden=platform!=='ios';nativeInstall.hidden=platform!=='android'||!installPrompt;document.querySelectorAll('[data-install-platform]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.installPlatform===platform)));}
 document.querySelectorAll('[data-install-platform]').forEach(b=>b.addEventListener('click',()=>{platform=b.dataset.installPlatform;renderInstall();}));
 window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();installPrompt=event;renderInstall();});
 nativeInstall.addEventListener('click',async()=>{if(!installPrompt)return;const prompt=installPrompt;installPrompt=null;renderInstall();try{await prompt.prompt();await prompt.userChoice;}catch{renderInstall();}});
 window.addEventListener('appinstalled',()=>{installPrompt=null;renderInstall();button.hidden=true;});
 renderInstall();button.hidden=!!standalone;button.addEventListener('click',()=>dialog.showModal());document.getElementById('install-close').addEventListener('click',()=>dialog.close());
 if(!standalone&&['android','ios'].includes(installQuery))dialog.showModal();
 const update=document.getElementById('app-update');let waiting;
 update.addEventListener('click',()=>{if(waiting&&confirm('앱을 업데이트하고 화면을 다시 열까요? 저장하지 않은 입력은 먼저 저장하세요.'))waiting.postMessage('ACTIVATE_UPDATE');});
 if(!('serviceWorker' in navigator)||!window.isSecureContext)return;
 navigator.serviceWorker.register('./sw.js').then(registration=>{
   const offer=()=>{if(registration.waiting&&navigator.serviceWorker.controller){waiting=registration.waiting;update.hidden=false;}};offer();
   registration.addEventListener('updatefound',()=>{const worker=registration.installing;if(worker)worker.addEventListener('statechange',()=>{if(worker.state==='installed')offer();});});
   navigator.serviceWorker.ready.then(()=>{document.getElementById('offline-status').textContent='앱 준비 완료 · 연결 없이 계산 가능';});
 }).catch(()=>{document.getElementById('offline-status').textContent='온라인 실행 · 오프라인 준비 미완료';});
 let refreshing=false;navigator.serviceWorker.addEventListener('controllerchange',()=>{if(waiting&&!refreshing){refreshing=true;location.reload();}});
})();
