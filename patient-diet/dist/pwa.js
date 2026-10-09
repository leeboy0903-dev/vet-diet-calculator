(() => {
 'use strict';
 const standalone=matchMedia('(display-mode: standalone)').matches||navigator.standalone;
 const button=document.getElementById('install-app'),dialog=document.getElementById('install-help');
 button.hidden=!!standalone;button.addEventListener('click',()=>dialog.showModal());document.getElementById('install-close').addEventListener('click',()=>dialog.close());
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
