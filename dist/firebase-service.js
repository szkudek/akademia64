import { firebaseConfig } from './firebase-config.js';
import { emptyProgress,normalizeProgress,mergeProgress } from './progress.js?v=20261108-rating-reset';

const SDK='https://www.gstatic.com/firebasejs/13.1.0/';
export async function loadFirebase(){
  const [appSDK,authSDK,dbSDK]=await Promise.all([import(SDK+'firebase-app.js'),import(SDK+'firebase-auth.js'),import(SDK+'firebase-firestore.js')]);
  const app=appSDK.getApps().find(app=>app.name==='akademia64')||appSDK.initializeApp(firebaseConfig,'akademia64');
  if(app.options.projectId!==firebaseConfig.projectId)throw new Error('Niepoprawny projekt Firebase.');
  const auth=authSDK.getAuth(app);auth.languageCode='pl';
  await auth.authStateReady();
  return createFirebaseService({auth,db:dbSDK.getFirestore(app),authSDK,dbSDK});
}
async function deadline(promise,ms=15000){let timer;try{return await Promise.race([promise,new Promise((_,reject)=>{timer=setTimeout(()=>reject(appError('deadline-exceeded')),ms)})])}finally{clearTimeout(timer)}}
function appError(code){const error=new Error(code);error.code=code;return error}
function profile(user){return user?{id:user.uid,email:user.email||'',name:user.displayName||user.email?.split('@')[0]||'Szachista',verified:user.emailVerified}:null}
export function createFirebaseService({auth,db,authSDK:a,dbSDK:d}){
  function owner(id){
    if(!auth.currentUser||auth.currentUser.uid!==id)throw appError('account/changed');
    if(!auth.currentUser.emailVerified)throw appError('account/unverified');
    return d.doc(db,'users',id,'progress','main');
  }
  return {
    currentUser:()=>profile(auth.currentUser),
    observe:callback=>a.onAuthStateChanged(auth,u=>callback(profile(u))),
    async register({email,password,name}){
      if(typeof name!=='string'||name.trim().length<2||[...name.trim()].length>40)throw appError('account/invalid-name');
      if(typeof password!=='string'||[...password].length<12)throw appError('account/weak-password');
      const result=await a.createUserWithEmailAndPassword(auth,email.trim(),password);
      let nameSaved=true;
      try{await a.updateProfile(result.user,{displayName:name.trim()})}catch{nameSaved=false}
      // Verification is requested explicitly in the profile after registration.
      return {user:profile(result.user),nameSaved};
    },
    async login({email,password}){const result=await a.signInWithEmailAndPassword(auth,email.trim(),password);return {user:profile(result.user)}},
    logout:()=>a.signOut(auth),
    async resetPassword(email){
      try{await a.sendPasswordResetEmail(auth,email.trim())}
      catch(error){if(error.code!=='auth/user-not-found')throw error}
    },
    async sendVerification(){
      if(!auth.currentUser)throw appError('account/changed');
      await a.sendEmailVerification(auth.currentUser);
    },
    async refreshUser(){
      if(!auth.currentUser)return null;
      await a.reload(auth.currentUser);await a.getIdToken(auth.currentUser,true);return profile(auth.currentUser);
    },
    async deleteAccount(password){
      const current=auth.currentUser;
      if(!current)throw appError('account/changed');
      const id=current.uid;
      const credential=a.EmailAuthProvider.credential(current.email,password);
      await a.reauthenticateWithCredential(current,credential);
      if(auth.currentUser?.uid!==id)throw appError('account/changed');
      // Reauthentication must succeed before either the account or its data is removed.
      const ref=d.doc(db,'users',id,'progress','main');
      let snapshot=null;
      if(current.emailVerified){
        snapshot=await deadline(d.getDocFromServer(ref));
        if(auth.currentUser?.uid!==id)throw appError('account/changed');
        await deadline(d.deleteDoc(ref));
      }
      try{
        if(auth.currentUser?.uid!==id)throw appError('account/changed');
        await a.deleteUser(current);
      }catch(error){
        // Keep progress if Firebase refuses the final account deletion.
        if(snapshot?.exists()&&auth.currentUser?.uid===id){
          try{await deadline(d.setDoc(ref,{...normalizeProgress(snapshot.data()),updatedAt:d.serverTimestamp()}))}
          catch{throw appError('account/delete-partial')}
        }
        throw error;
      }
      return {id};
    },
    async getProgress(id){
      const ref=owner(id);const result=await deadline(d.getDocFromServer(ref));owner(id);
      return result.exists()?normalizeProgress(result.data()):emptyProgress();
    },
    async saveProgress(id,value){
      const incoming=normalizeProgress(value);const ref=owner(id);
      return deadline(d.runTransaction(db,async tx=>{
        owner(id);const result=await tx.get(ref);owner(id);
        const merged=mergeProgress(result.exists()?result.data():emptyProgress(),incoming);
        tx.set(ref,{...merged,updatedAt:d.serverTimestamp()});return merged;
      }));
    }
  };
}
export function firebaseMessage(error){
  const code=error?.code||'';
  const messages={
    'auth/invalid-email':'Podaj poprawny adres e-mail.',
    'auth/invalid-credential':'Niepoprawny e-mail lub hasło.',
    'auth/wrong-password':'Niepoprawny e-mail lub hasło.',
    'auth/user-not-found':'Niepoprawny e-mail lub hasło.',
    'auth/email-already-in-use':'Konto z tym adresem już istnieje. Zaloguj się lub odzyskaj hasło.',
    'auth/weak-password':'Wybierz dłuższe hasło, zgodne z wymaganiami konta.',
    'auth/password-does-not-meet-requirements':'Hasło nie spełnia wymagań ustawionych dla kont. Wybierz silniejsze hasło.',
    'auth/too-many-requests':'Zbyt wiele prób. Odczekaj chwilę i spróbuj ponownie.',
    'auth/network-request-failed':'Brak połączenia. Sprawdź internet i spróbuj ponownie.',
    'auth/operation-not-allowed':'Logowanie e-mailem nie zostało jeszcze włączone. Możesz kontynuować naukę jako gość.',
    'auth/unauthorized-domain':'Logowanie nie jest jeszcze skonfigurowane pod tym adresem.',
    'auth/user-disabled':'To konto zostało wyłączone.',
    'auth/requires-recent-login':'Zaloguj się ponownie, aby wykonać tę operację.',
    'permission-denied':'Nie udało się uzyskać dostępu do postępów. Sprawdź potwierdzenie adresu e-mail lub spróbuj później.',
    'failed-precondition':'Zapis postępów nie jest jeszcze dostępny. Spróbuj później.',
    'unavailable':'Brak połączenia z bazą. Postępy pozostają zapisane na urządzeniu.',
    'deadline-exceeded':'Połączenie trwa zbyt długo. Spróbuj ponownie.',
    'account/changed':'Konto zmieniło się w innej karcie. Odśwież stronę.',
    'account/unverified':'Potwierdź adres e-mail, aby zapisywać postępy na koncie.',
    'account/invalid-name':'Nazwa musi mieć od 2 do 40 znaków.',
    'account/weak-password':'Hasło musi mieć co najmniej 12 znaków.',
    'account/delete-partial':'Konto nie zostało usunięte, ale przywrócenie postępów nie powiodło się. Postępy pozostają na urządzeniu. Spróbuj ponownie.'
  };
  return messages[code]||'Nie udało się wykonać operacji. Sprawdź połączenie i spróbuj ponownie.';
}
