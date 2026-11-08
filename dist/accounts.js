import { loadFirebase,firebaseMessage } from './firebase-service.js?v=20261108-corrections';
import { emptyProgress,normalizeProgress,mergeProgress,sameProgress } from './progress.js?v=20261108-corrections';
const guestKey='akademia64-v1';
const $=selector=>document.querySelector(selector);
function read(key){try{return normalizeProgress(JSON.parse(localStorage.getItem(key)||'null'))}catch{return emptyProgress()}}
const hasProgress=p=>p.done.length||p.solved.length||p.games||p.tactics.length||p.corrections.length;
let deleting=false;
let service=null,user=null,ready=false,onProgress=()=>{},timer,pending=null,saving=false,generation=0,syncState='',formBusy=false,busyElements=[],deferredAuth;
function key(){return user?`akademia64-user-${user.id}`:guestKey}
function remember(p){try{localStorage.setItem(key(),JSON.stringify(normalizeProgress(p)));return true}catch{return false}}
function notify(text){const el=$('#account-message');if(el){el.textContent=text;el.classList.add('error')}}
function updateUI(){
  $('#account-button').textContent=user?'Moje konto':'Zaloguj się';$('#account-button').disabled=!ready;
  $('#account-name').textContent=user?user.name:'Twoja akademia';
  $('#account-caption').textContent=user?(syncState||'Postępy na Twoim koncie'):'Postępy na tym urządzeniu';
  $('#account-avatar').textContent=user?[...user.name][0].toUpperCase():'G';
  $('#account-save-dot').classList.toggle('pending',!!syncState&&syncState!=='Zapisano na koncie');
  const sync=$('#account-sync');if(sync)sync.textContent=syncState||(user?.verified?'Postępy na koncie są aktualne.':'Potwierdź adres e-mail, aby włączyć zapis na koncie.');
}
function schedule(){clearTimeout(timer);if(user?.verified&&pending)timer=setTimeout(flush,900)}
async function flush(){
  clearTimeout(timer);if(saving||!pending||!user?.verified||!service||deleting)return;
  const own=generation,id=user.id,item=pending;pending=null;saving=true;syncState='Zapisywanie…';updateUI();
  try{await service.saveProgress(id,item);if(own===generation)syncState=pending?'Oczekuje na zapis':'Zapisano na koncie'}
  catch(error){if(own===generation){pending=mergeProgress(item,pending||emptyProgress());syncState=firebaseMessage(error)}}
  finally{saving=false;updateUI();if(pending&&user?.verified&&(own!==generation||syncState==='Oczekuje na zapis'))schedule()}
}
async function loadAccount(account){
  const own=++generation;clearTimeout(timer);pending=null;user=account;
  if(!account){syncState='';onProgress(read(guestKey));updateUI();return}
  const cached=read(key());onProgress(cached);
  if(!account.verified){syncState='Potwierdź adres e-mail — zapis na urządzeniu';updateUI();return}
  syncState='Pobieranie postępów…';updateUI();
  try{
    const remote=await service.getProgress(account.id);if(own!==generation)return;
    const merged=mergeProgress(remote,read(key()));remember(merged);onProgress(merged);
    if(!sameProgress(remote,merged)){pending=merged;syncState='Oczekuje na zapis';schedule()}else syncState='Zapisano na koncie';
  }catch(error){if(own===generation){syncState=firebaseMessage(error);pending=read(key())}}
  updateUI();
}
async function observed(account){
  if(formBusy){deferredAuth=account;return}
  if(user?.id===account?.id&&user?.verified===account?.verified)return;
  await loadAccount(account);if($('#account-dialog').open){if(account)profile();else form('login')}
}
function close(){if(formBusy)return;$('#account-dialog').close();$('#account-content').replaceChildren()}
function shell(title,description){$('#account-content').innerHTML=`<div class="eyebrow">TWOJE MIEJSCE W AKADEMII</div><h2>${title}</h2><p class="account-description">${description}</p><div id="account-body"></div><p id="account-message" class="account-message" role="status" aria-live="polite"></p>`;if(!$('#account-dialog').open)$('#account-dialog').showModal()}
function field(label,name,type,autocomplete,extra=''){return `<label class="account-field"><span>${label}</span><input name="${name}" type="${type}" autocomplete="${autocomplete}" required ${extra}></label>`}
function busy(value){formBusy=value;$('#account-dialog .dialog-close').disabled=value;if(value){busyElements=[...document.querySelectorAll('#account-content button,#account-content input')].map(el=>[el,el.disabled]);for(const [el] of busyElements)el.disabled=true}else{for(const [el,disabled] of busyElements)if(el.isConnected)el.disabled=disabled;busyElements=[]}}
async function submit(action){busy(true);try{await action()}catch(error){notify(firebaseMessage(error))}finally{busy(false);if(deferredAuth!==undefined){const next=deferredAuth;deferredAuth=undefined;observed(next)}}}
function form(mode='login'){
  if(user&&mode==='login')return profile();
  if(!service){shell('Nauka bez przeszkód','Możesz korzystać ze wszystkich lekcji i zadań jako gość.');$('#account-body').innerHTML='<div class="instruction">Nie udało się połączyć z usługą logowania. Sprawdź połączenie i spróbuj ponownie.</div><button class="btn" id="retry-accounts">Spróbuj ponownie</button><button class="text-link" id="continue-guest">Kontynuuj jako gość</button>';$('#continue-guest').onclick=close;$('#retry-accounts').onclick=()=>submit(async()=>{await connect();form('login')});return}
  const register=mode==='register',reset=mode==='reset';
  shell(reset?'Odzyskaj dostęp':register?'Rozpocznij swoją podróż.':'Dobrze Cię znów widzieć.',reset?'Podaj adres swojego konta. Wyślemy link do ustawienia nowego hasła.':register?'Jedno konto, Twoje lekcje i osiągnięcia. Ucz się dalej na dowolnym urządzeniu.':'Zaloguj się, aby wrócić do swoich lekcji i postępów.');
  $('#account-body').innerHTML=`${!reset?`<div class="account-tabs" role="group" aria-label="Dostęp do konta"><button type="button" class="${!register?'active':''}" id="tab-login">Logowanie</button><button type="button" class="${register?'active':''}" id="tab-register">Załóż konto</button></div>`:''}<form id="account-form">${register?field('Jak mamy się do Ciebie zwracać?','name','text','nickname','minlength="2" maxlength="40"'):''}${field('Adres e-mail','email','email','email','maxlength="254"')}${!reset?`${field('Hasło','password','password',register?'new-password':'current-password',register?'minlength="12" maxlength="256"':'maxlength="256"')}<label class="account-check"><input type="checkbox" id="show-password"> Pokaż hasło</label>`:''}${register?`<p class="field-help">Minimum 12 znaków. Możesz używać spacji i długiej frazy.</p>${field('Powtórz hasło','passwordConfirm','password','new-password','minlength="12" maxlength="256"')}`:''}<button class="btn account-submit" type="submit">${reset?'Wyślij link do zmiany hasła':register?'Utwórz konto':'Zaloguj się'} <span>→</span></button></form>${!register&&!reset?'<button class="text-link" id="forgot-password">Nie pamiętam hasła</button>':''}<p class="account-footnote">${register?'Po rejestracji potwierdź swój adres e-mail, aby włączyć zapis postępów na koncie.':'Możesz też uczyć się bez konta. Postępy gościa są przechowywane osobno.'}</p><button class="text-link" id="guest-back">${reset?'← Wróć do logowania':'Kontynuuj bez logowania'}</button>`;
  if(!reset){$('#tab-login').onclick=()=>form('login');$('#tab-register').onclick=()=>form('register')}
  $('#guest-back').onclick=()=>reset?form('login'):close();if($('#forgot-password'))$('#forgot-password').onclick=()=>form('reset');
  if($('#show-password'))$('#show-password').onchange=e=>{document.querySelectorAll('#account-form input[name^="password"]').forEach(i=>i.type=e.target.checked?'text':'password')};
  $('#account-form').onsubmit=e=>{
    e.preventDefault();const values=Object.fromEntries(new FormData(e.currentTarget));
    if(register&&values.password!==values.passwordConfirm){notify('Hasła muszą być takie same.');return}
    submit(async()=>{
      if(reset){await service.resetPassword(values.email);shell('Sprawdź swoją pocztę.','Jeśli konto istnieje, otrzymasz wiadomość z linkiem do ustawienia hasła. Sprawdź również folder ze spamem.');$('#account-body').innerHTML='<button class="btn" id="reset-back">Wróć do logowania →</button>';$('#reset-back').onclick=()=>form('login');return}
      const result=await service[register?'register':'login'](values);await loadAccount(result.user);profile();
      if(register&&!result.nameSaved)notify('Konto powstało, ale nie udało się zapisać nazwy. Możesz już korzystać z konta.');
    });
  };
}
function profile(){
  shell('Twoja akademia.','Twoje konto, Twoje tempo nauki.');
  $('#account-body').innerHTML='<div class="account-profile"><div class="avatar" id="profile-avatar"></div><div><strong id="profile-name"></strong><span id="profile-email"></span></div></div><div id="verification-panel"></div><div class="instruction" id="account-sync"></div><button class="btn outline" id="refresh-progress">Odśwież zapis</button><div id="guest-import"></div><div class="account-profile-actions"><button class="btn" id="account-continue">Wróć do nauki →</button><button class="text-link" id="account-logout">Wyloguj się</button></div><div class="account-danger"><button class="text-link" id="delete-account">Usuń konto</button></div>';
  $('#profile-name').textContent=user.name;$('#profile-email').textContent=user.email;$('#profile-avatar').textContent=[...user.name][0].toUpperCase();updateUI();
  if(!user.verified){
    $('#verification-panel').innerHTML='<div class="account-verification"><h3>Potwierdź swój e-mail.</h3><p>Aby zapisywać postępy na koncie, otwórz link w wiadomości weryfikacyjnej. Do tego czasu możesz uczyć się dalej — postępy zostają na tym urządzeniu.</p><button class="btn outline" id="send-verification">Wyślij link potwierdzający</button><button class="text-link" id="check-verification">Adres już potwierdzony — sprawdź</button><p id="verification-message" role="status"></p></div>';
    $('#send-verification').onclick=()=>submit(async()=>{await service.sendVerification();$('#verification-message').textContent='Wiadomość wysłana. Sprawdź pocztę i folder ze spamem.'});
    $('#check-verification').onclick=()=>submit(async()=>{await loadAccount(await service.refreshUser());profile();if(!user?.verified)notify('Adres nie jest jeszcze potwierdzony. Otwórz link z wiadomości i spróbuj ponownie.')});
  }
  $('#account-continue').onclick=close;
  $('#delete-account').onclick=deletionForm;
  $('#refresh-progress').onclick=()=>submit(async()=>{const current=await service.refreshUser();if(!current){await loadAccount(null);form('login');return}await loadAccount(current);await flush();profile()});
  if(user.verified&&hasProgress(read(guestKey))){
    $('#guest-import').innerHTML='<div class="account-import"><h3>Masz postępy jako gość.</h3><p>Możesz połączyć je z postępami na koncie. Ukończone lekcje i zadania zostaną zachowane.</p><button class="btn outline" id="import-progress">Przenieś postępy gościa</button></div>';
    $('#import-progress').onclick=()=>submit(async()=>{const own=generation,id=user.id;const progress=await service.saveProgress(id,mergeProgress(read(key()),read(guestKey)));if(own!==generation)return;remember(progress);onProgress(progress);try{localStorage.removeItem(guestKey)}catch{}syncState='Zapisano na koncie';profile()});
  }
  $('#account-logout').onclick=()=>submit(async()=>{await flush();await service.logout();await loadAccount(null);formBusy=false;close()});
}
function deletionForm(){
  const id=user.id;
  shell('Usunąć to konto?','Usunięcie konta i zapisanych na nim postępów jest trwałe. Nie dotyczy konta Google ani innych aplikacji.');
  $('#account-body').innerHTML='<div class="account-profile"><div><strong id="delete-name"></strong><span id="delete-email"></span></div></div><form id="delete-form">'+field('Potwierdź aktualnym hasłem','password','password','current-password','maxlength="256"')+'<label class="account-check"><input type="checkbox" id="delete-confirm" required> Rozumiem, że konto i postępy zostaną usunięte.</label><button type="submit" class="btn danger-btn">Usuń konto i postępy</button><button type="button" class="text-link" id="cancel-delete">Zachowaj konto</button></form>';
  $('#delete-name').textContent=user.name;$('#delete-email').textContent=user.email;
  $('#cancel-delete').onclick=profile;
  $('#delete-form').onsubmit=e=>{
    e.preventDefault();const password=new FormData(e.currentTarget).get('password');
    if(user?.id!==id){notify('Konto zmieniło się. Odśwież stronę.');return}
    submit(async()=>{
      deleting=true;clearTimeout(timer);
      try{
        // Finish an already-started sync before deleting its document.
        while(saving)await new Promise(resolve=>setTimeout(resolve,50));
        await service.deleteAccount(password);
        pending=null;generation++;try{localStorage.removeItem(`akademia64-user-${id}`)}catch{}
        await loadAccount(null);deferredAuth=undefined;
        shell('Konto zostało usunięte.','Usunięto konto oraz przypisane do niego postępy. Możesz nadal korzystać z akademii jako gość.');
        $('#account-body').innerHTML='<button class="btn" id="deleted-continue">Wróć do akademii →</button>';
        $('#deleted-continue').onclick=close;
      }finally{deleting=false}
    });
  };
}
async function connect(){service=await loadFirebase();await loadAccount(service.currentUser());service.observe(observed)}
export const accounts={
  get user(){return user},
  saveProgress(value){const progress=normalizeProgress(value);const saved=remember(progress);if(user?.verified&&!deleting){pending=progress;syncState='Oczekuje na zapis';schedule();updateUI()}return saved},
  async start(callback){
    onProgress=callback;$('#account-button').onclick=()=>user?profile():form('login');$('#sidebar-account').onclick=()=>user?profile():form('login');$('#account-dialog .dialog-close').onclick=close;
    $('#account-dialog').addEventListener('cancel',e=>{if(formBusy)e.preventDefault();else close()});
    try{await connect()}catch{service=null;onProgress(read(guestKey))}finally{ready=true;updateUI()}
    window.addEventListener('online',()=>{if(user?.verified){if(pending)flush();else loadAccount(user)}});
  },
  showStorageInfo(){shell('Twoje postępy.',user?'Postępy są przypisane do Twojego konta. Synchronizacja wymaga potwierdzenia e-maila oraz połączenia z internetem.':'Uczysz się jako gość. Postępy zapisujemy w tej przeglądarce. Konto pozwala wrócić do nauki na innym urządzeniu.');$('#account-body').innerHTML=`<button class="btn" id="storage-action">${user?'Moje konto':'Zaloguj się lub załóż konto'} →</button>`;$('#storage-action').onclick=()=>user?profile():form('login')}
};
