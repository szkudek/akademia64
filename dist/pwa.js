const installButton=document.querySelector('#install-app');
const installHelp=document.querySelector('#install-help');
const standalone=matchMedia('(display-mode: standalone)');
const android=/Android/i.test(navigator.userAgent);
let deferredPrompt;
let installationAccepted=false;

function updateInstallButton(){
 installButton.hidden=standalone.matches||installationAccepted||(!android&&!deferredPrompt);
 installButton.textContent=deferredPrompt?'Zainstaluj aplikację':'Pomoc z instalacją';
}
window.addEventListener('beforeinstallprompt',event=>{
 event.preventDefault();
 deferredPrompt=event;
 installationAccepted=false;
 updateInstallButton();
});
window.addEventListener('appinstalled',()=>{
 deferredPrompt=null;
 installationAccepted=true;
 updateInstallButton();
});
standalone.addEventListener('change',updateInstallButton);
installButton.onclick=async()=>{
 if(!deferredPrompt){
  installHelp.showModal();
  return;
 }
 const prompt=deferredPrompt;
 deferredPrompt=null;
 installButton.disabled=true;
 try{
  const choice=await prompt.prompt();
  if(choice.outcome==='accepted')installationAccepted=true;
 }catch{
  installHelp.showModal();
 }finally{
  installButton.disabled=false;
  updateInstallButton();
 }
};
document.querySelector('#install-close').onclick=()=>installHelp.close();
updateInstallButton();

if('serviceWorker' in navigator&&window.isSecureContext){
 navigator.serviceWorker.register(new URL('sw.js',document.baseURI),{updateViaCache:'none'}).catch(error=>{
  console.warn('Akademia64: tryb offline jest niedostępny.',error);
 });
}
