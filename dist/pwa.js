const installButton=document.querySelector('#install-app');
const standalone=matchMedia('(display-mode: standalone)');
const android=/Android/i.test(navigator.userAgent);
let deferredPrompt;

function updateInstallButton(){
 installButton.hidden=standalone.matches||(!android&&!deferredPrompt);
}
window.addEventListener('beforeinstallprompt',event=>{
 event.preventDefault();
 deferredPrompt=event;
 updateInstallButton();
});
window.addEventListener('appinstalled',()=>{
 deferredPrompt=null;
 installButton.hidden=true;
});
standalone.addEventListener('change',updateInstallButton);
installButton.onclick=async()=>{
 if(deferredPrompt){
  const prompt=deferredPrompt;
  deferredPrompt=null;
  try{
   const choice=await prompt.prompt();
   if(choice.outcome==='accepted'){installButton.hidden=true;return}
   updateInstallButton();
   return;
  }catch{updateInstallButton()}
 }
 document.querySelector('#install-help').showModal();
};
document.querySelector('#install-close').onclick=()=>document.querySelector('#install-help').close();
updateInstallButton();

if('serviceWorker' in navigator&&window.isSecureContext){
 navigator.serviceWorker.register(new URL('sw.js',document.baseURI),{updateViaCache:'none'}).catch(error=>{
  console.warn('Akademia64: tryb offline jest niedostępny.',error);
 });
}
