const guestKey='akademia64-v1';
const blank=()=>({done:[],solved:[],days:[],games:0});
function read(key){try{const v=JSON.parse(localStorage.getItem(key)||'null');return v&&Array.isArray(v.done)&&Array.isArray(v.solved)&&Array.isArray(v.days)&&Number.isSafeInteger(v.games)?v:blank()}catch{return blank()}}
function merge(a,b){return {done:[...new Set([...a.done,...b.done])],solved:[...new Set([...a.solved,...b.solved])],days:[...new Set([...a.days,...b.days])].sort(),games:Math.max(a.games,b.games)}}
const hasProgress=p=>p.done.length||p.solved.length||p.games;
const apiBase=new URL('./api/',location.href);
let user=null,available=false,ready=false,onProgress=()=>{},timer,pending=null,saving=false,generation=0,syncState='',formBusy=false;
let lastRecoveryCode=null;
let busyElements=[];
const $=selector=>document.querySelector(selector);
function key(){return user?`akademia64-user-${user.id}`:guestKey}
async function request(path,{method='GET',data,accountId=user?.id}={}){
  const response=await fetch(new URL(path,apiBase),{method,credentials:'same-origin',cache:'no-store',headers:{...(accountId?{'X-Academy-User':accountId}:{}),...(method==='GET'?{}:{'Content-Type':'application/json','X-Requested-With':'Akademia64'})},...(data!==undefined?{body:JSON.stringify(data)}:{}),signal:AbortSignal.timeout(10000)});
  let payload;try{payload=await response.json()}catch{throw new Error('Logowanie nie jest dostępne w tej wersji strony.')}
  if(!response.ok){const error=new Error(payload.error||'Nie udało się połączyć. Spróbuj ponownie.');error.status=response.status;throw error}return payload;
}
function remember(p){try{localStorage.setItem(key(),JSON.stringify(p));return true}catch{return false}}
function notify(text){const el=$('#account-message');if(el){el.textContent=text;el.classList.add('error')}}
function updateUI(){
  const top=$('#account-button');top.textContent=user?'Moje konto':'Zaloguj się';top.disabled=!ready;
  $('#account-name').textContent=user?user.name:'Twoja akademia';
  $('#account-caption').textContent=user?(syncState||'Postępy na Twoim koncie'):'Postępy na tym urządzeniu';
  $('#account-avatar').textContent=user?[...user.name][0].toUpperCase():'G';
  $('#account-save-dot').classList.toggle('pending',!!syncState&&syncState!=='Zapisano na koncie');
  const sync=$('#account-sync');if(sync)sync.textContent=syncState||'Postępy na koncie są aktualne.';
}
async function flush(){
  clearTimeout(timer);if(saving||!pending||!user)return;
  const own=generation;const item=pending;pending=null;saving=true;syncState='Zapisywanie…';updateUI();
  try{
    await request('progress',{method:'PUT',data:item});
    if(own===generation)syncState=pending?'Oczekuje na zapis':'Zapisano na koncie';
  }catch(error){if(own===generation){pending=merge(item,pending||blank());syncState=error.status===401?'Sesja wygasła — zaloguj się ponownie':'Brak połączenia — zapisano na urządzeniu';}}
  finally{saving=false;updateUI();if(pending&&user&&(own!==generation||syncState==='Oczekuje na zapis'))timer=setTimeout(flush,300)}
}
async function loadAccount(account){
  const result=await request('progress',{accountId:account.id});
  generation++;pending=null;clearTimeout(timer);user=account;
  const progress=merge(result.progress,read(key()));remember(progress);onProgress(progress);
  syncState='';updateUI();pending=progress;flush();
}
function close(){if(formBusy)return;$('#account-dialog').close();lastRecoveryCode=null;$('#account-content').replaceChildren()}
function message(error){if(error.name==='TimeoutError'||error.name==='TypeError')return 'Nie udało się połączyć z serwerem. Spróbuj ponownie.';return error.message}
function shell(title,description){const dlg=$('#account-dialog');$('#account-content').innerHTML=`<div class="eyebrow">TWOJE MIEJSCE W AKADEMII</div><h2>${title}</h2><p class="account-description">${description}</p><div id="account-body"></div><p id="account-message" class="account-message" role="status" aria-live="polite"></p>`;if(!dlg.open)dlg.showModal()}
function field(label,name,type,autocomplete,extra=''){return `<label class="account-field"><span>${label}</span><input name="${name}" type="${type}" autocomplete="${autocomplete}" required ${extra}></label>`}
function busy(value){formBusy=value;$('#account-dialog .dialog-close').disabled=value;if(value){busyElements=[...document.querySelectorAll('#account-content button,#account-content input')].map(el=>[el,el.disabled]);for(const [el] of busyElements)el.disabled=true}else{for(const [el,disabled] of busyElements)if(el.isConnected)el.disabled=disabled;busyElements=[]}}
async function submit(action){busy(true);try{await action()}catch(error){notify(message(error))}finally{busy(false)}}
function form(mode='login'){
  if(user&&mode==='login')return profile();
  if(!available){shell('Nauka bez przeszkód','Możesz nadal korzystać ze wszystkich lekcji i zadań jako gość.');$('#account-body').innerHTML='<div class="instruction">Zakładanie kont nie jest jeszcze uruchomione pod tym adresem. Twoje dotychczasowe postępy pozostają w tej przeglądarce.</div><button class="btn" id="continue-guest">Kontynuuj naukę</button>';$('#continue-guest').onclick=close;return}
  const register=mode==='register',reset=mode==='reset';
  shell(reset?'Odzyskaj dostęp':register?'Rozpocznij swoją podróż.':'Dobrze Cię znów widzieć.',reset?'Użyj kodu ratunkowego zapisanego podczas zakładania konta.':register?'Jedno konto, Twoje lekcje i osiągnięcia. Ucz się dalej na dowolnym urządzeniu.':'Zaloguj się, aby wrócić do swoich lekcji i postępów.');
  $('#account-body').innerHTML=`${!reset?`<div class="account-tabs" role="group" aria-label="Dostęp do konta"><button type="button" class="${!register?'active':''}" id="tab-login">Logowanie</button><button type="button" class="${register?'active':''}" id="tab-register">Załóż konto</button></div>`:''}<form id="account-form">${register?field('Jak mamy się do Ciebie zwracać?','name','text','nickname','minlength="2" maxlength="40"'):''}${field('Adres e-mail','email','email','email','maxlength="254"')}${reset?field('Kod ratunkowy','recoveryCode','text','off','spellcheck="false" maxlength="100"'):''}${field(reset?'Nowe hasło':'Hasło','password','password',register||reset?'new-password':'current-password',register||reset?'minlength="12" maxlength="256"':'maxlength="256"')}<label class="account-check"><input type="checkbox" id="show-password"> Pokaż hasło</label>${register||reset?`<p class="field-help">Minimum 12 znaków. Możesz używać spacji i długiej frazy.</p>${field('Powtórz hasło','passwordConfirm','password','new-password','minlength="12" maxlength="256"')}`:''}<button class="btn account-submit" type="submit">${reset?'Ustaw nowe hasło':register?'Utwórz konto':'Zaloguj się'} <span>→</span></button></form>${!register&&!reset?'<button class="text-link" id="forgot-password">Nie pamiętam hasła</button>':''}<p class="account-footnote">${register?'Po rejestracji otrzymasz kod ratunkowy. Zachowaj go — zastępuje odzyskiwanie hasła przez e-mail.':reset?'Kod jest jednorazowy. Po zmianie hasła otrzymasz nowy, a wcześniejsze sesje zostaną wylogowane.':'Możesz też uczyć się bez konta. Postępy gościa są przechowywane osobno.'}</p><button class="text-link" id="guest-back">${reset?'← Wróć do logowania':'Kontynuuj bez logowania'}</button>`;
  if(!reset){$('#tab-login').onclick=()=>form('login');$('#tab-register').onclick=()=>form('register')}
  $('#guest-back').onclick=()=>reset?form('login'):close();
  if($('#forgot-password'))$('#forgot-password').onclick=()=>form('reset');
  $('#show-password').onchange=e=>{document.querySelectorAll('#account-form input[name^="password"]').forEach(i=>i.type=e.target.checked?'text':'password')};
  $('#account-form').onsubmit=e=>{e.preventDefault();const values=Object.fromEntries(new FormData(e.currentTarget));if((register||reset)&&values.password!==values.passwordConfirm){notify('Hasła muszą być takie same.');return}submit(async()=>{
    const data=await request(reset?'reset-password':register?'register':'login',{method:'POST',data:values});
    if(reset){recovery(data.recoveryCode,true);return}
    try{await loadAccount(data.user)}catch(error){generation++;user=data.user;const p=read(key());onProgress(p);syncState='Nie udało się pobrać postępów — spróbuj ponownie';updateUI();if(!data.recoveryCode){profile();notify('Zalogowano, ale pobranie postępów nie powiodło się. Kliknij „Odśwież zapis”.');return}}
    if(register)recovery(data.recoveryCode,false);else profile();
  })};
}
function recovery(code,afterReset){
  lastRecoveryCode=code;shell('Zachowaj swój kod ratunkowy.','Ten kod pozwoli ustawić nowe hasło. Pokazujemy go tylko teraz. Zapisz go w bezpiecznym miejscu i nie udostępniaj innym.');
  $('#account-body').innerHTML='<div class="recovery-code" id="recovery-code"></div><button class="btn outline" id="download-code">Pobierz kod</button><label class="account-check recovery-check"><input type="checkbox" id="code-saved"> Mam zapisany kod ratunkowy</label><button class="btn account-submit" id="recovery-continue" disabled>Kontynuuj →</button>';
  $('#recovery-code').textContent=code;
  // Keep the one-time recovery material visible until the user explicitly acknowledges it.
  $('#account-dialog .dialog-close').hidden=true;
  $('#code-saved').onchange=e=>$('#recovery-continue').disabled=!e.target.checked;
  $('#download-code').onclick=()=>{const blob=new Blob([`Akademia 64 — kod ratunkowy\n\n${lastRecoveryCode}\n\nZachowaj prywatnie. Kod pozwala zmienić hasło i działa tylko raz.\n`],{type:'text/plain;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='akademia64-kod-ratunkowy.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)};
  $('#recovery-continue').onclick=()=>{lastRecoveryCode=null;$('#account-dialog .dialog-close').hidden=false;if(afterReset)form('login');else profile()};
}
function profile(){
  shell('Twoja akademia.','Twoje konto, Twoje tempo nauki.');
  $('#account-body').innerHTML='<div class="account-profile"><div class="avatar" id="profile-avatar"></div><div><strong id="profile-name"></strong><span id="profile-email"></span></div></div><div class="instruction" id="account-sync"></div><button class="btn outline" id="refresh-progress">Odśwież zapis</button><div id="guest-import"></div><div class="account-profile-actions"><button class="btn" id="account-continue">Wróć do nauki →</button><button class="text-link" id="account-logout">Wyloguj się</button></div>';
  $('#profile-name').textContent=user.name;$('#profile-email').textContent=user.email;$('#profile-avatar').textContent=[...user.name][0].toUpperCase();updateUI();
  $('#account-continue').onclick=close;
  $('#refresh-progress').onclick=()=>submit(async()=>{await flush();const result=await request('progress');const p=merge(result.progress,read(key()));remember(p);onProgress(p);pending=p;await flush();updateUI()});
  if(hasProgress(read(guestKey))){$('#guest-import').innerHTML='<div class="account-import"><h3>Masz postępy jako gość.</h3><p>Możesz połączyć je z postępami na koncie. Ukończone lekcje i zadania zostaną zachowane.</p><button class="btn outline" id="import-progress">Przenieś postępy gościa</button></div>';$('#import-progress').onclick=()=>submit(async()=>{const p=merge(read(key()),read(guestKey));const result=await request('progress',{method:'PUT',data:p});remember(result.progress);onProgress(result.progress);try{localStorage.removeItem(guestKey)}catch{}syncState='Zapisano na koncie';profile()})}
  $('#account-logout').onclick=()=>submit(async()=>{await flush();await request('logout',{method:'POST',data:{}});generation++;clearTimeout(timer);pending=null;user=null;syncState='';onProgress(read(guestKey));updateUI();formBusy=false;close()});
}
export const accounts={
  get user(){return user},
  saveProgress(progress){const saved=remember(progress);if(user){pending=progress;syncState='Oczekuje na zapis';updateUI();clearTimeout(timer);timer=setTimeout(flush,500)}return saved},
  async start(callback){
    onProgress=callback;
    const button=$('#account-button');button.onclick=()=>user?profile():form('login');
    $('#sidebar-account').onclick=()=>user?profile():form('login');
    $('#account-dialog .dialog-close').onclick=close;
    $('#account-dialog').addEventListener('cancel',e=>{if(formBusy||lastRecoveryCode)e.preventDefault();else close()});
    try{const result=await request('session');available=result.features?.accounts===true;if(result.user)await loadAccount(result.user);else onProgress(read(guestKey))}
    catch{onProgress(read(guestKey))}
    finally{ready=true;updateUI()}
    window.addEventListener('online',()=>{if(user&&pending)flush()});
  },
  showStorageInfo(){
    shell('Twoje postępy.',user?'Postępy są przypisane do Twojego konta. Przy braku połączenia zostają tymczasowo zapisane na urządzeniu.':'Uczysz się jako gość. Postępy zapisujemy w tej przeglądarce. Konto pozwala przechowywać je na serwerze i wrócić do nauki na innym urządzeniu.');
    $('#account-body').innerHTML=`<button class="btn" id="storage-action">${user?'Moje konto':'Zaloguj się lub załóż konto'} →</button>`;$('#storage-action').onclick=()=>user?profile():form('login');
  }
};
