import test from 'node:test';
import assert from 'node:assert/strict';
import {createFirebaseService,firebaseMessage} from '../dist/firebase-service.js';
import {emptyProgress,mergeProgress,normalizeProgress,sameProgress} from '../dist/progress.js';
import {readFile} from 'node:fs/promises';

function fixture(){
 const auth={currentUser:null};const records=new Map();const calls=[];let listener;
 const account=(uid,verified=true)=>({uid,email:`${uid}@example.test`,displayName:uid,emailVerified:verified});
 const a={
  async createUserWithEmailAndPassword(auth,email,password){calls.push(['register',email]);auth.currentUser={...account('new',false),email,displayName:null};return {user:auth.currentUser}},
  async updateProfile(user,{displayName}){user.displayName=displayName},
  async signInWithEmailAndPassword(auth,email,password){auth.currentUser={...account(email.split('@')[0]),email};return {user:auth.currentUser}},
  async signOut(auth){auth.currentUser=null;listener?.(null)},
  EmailAuthProvider:{credential:(email,password)=>({email,password})},
  async reauthenticateWithCredential(user,credential){calls.push(['reauth',user.uid]);if(credential.password!=='correct password')throw Object.assign(new Error(),{code:'auth/invalid-credential'})},
  async deleteUser(user){calls.push(['delete-user',user.uid]);auth.currentUser=null;listener?.(null)},
  async sendPasswordResetEmail(auth,email){calls.push(['reset',email])},
  async sendEmailVerification(user){calls.push(['verify',user.uid])},
  async reload(){},async getIdToken(){calls.push(['refresh-token'])},
  onAuthStateChanged(auth,callback){listener=callback;return ()=>{listener=null}}
 };
 const d={
  doc(db,...path){return path.join('/')},
  async getDocFromServer(ref){calls.push(['read',ref]);const data=records.get(ref);return {exists:()=>data!==undefined,data:()=>data}},
  async deleteDoc(ref){calls.push(['delete-doc',ref]);records.delete(ref)},
  async setDoc(ref,value){calls.push(['restore-doc',ref]);records.set(ref,value)},
  async runTransaction(db,callback){return callback({async get(ref){return {exists:()=>records.has(ref),data:()=>records.get(ref)}},set(ref,value){calls.push(['write',ref]);records.set(ref,value)}})},
  serverTimestamp:()=>({serverTimestamp:true})
 };
 return {auth,a,d,account,records,calls,service:createFirebaseService({auth,db:{},authSDK:a,dbSDK:d})};
}
const p={done:['0-0'],solved:['mate1'],days:['2026-11-02'],games:1};
test('registration uses Firebase without storing passwords or automatically sending mail',async()=>{
 const {service,auth,calls}=fixture();
 const result=await service.register({email:' learner@example.test ',password:'Test password phrase',name:' Szachista '});
 assert.equal(result.user.id,'new');assert.equal(result.user.name,'Szachista');assert.equal(result.user.verified,false);assert.equal(auth.currentUser.displayName,'Szachista');
 assert.equal(calls.filter(c=>c[0]==='verify').length,0);
 await service.sendVerification();assert.deepEqual(calls.at(-1),['verify','new']);
 await assert.rejects(service.register({email:'a@example.test',password:'short',name:'Test'}),{code:'account/weak-password'});
});
test('only the current, verified account reads or writes its progress',async()=>{
 const {service,auth,account,calls}=fixture();auth.currentUser=account('alice');
 await service.saveProgress('alice',p);assert.deepEqual(await service.getProgress('alice'),p);
 await assert.rejects(service.getProgress('bob'),{code:'account/changed'});
 auth.currentUser=account('bob');assert.deepEqual(await service.getProgress('bob'),emptyProgress());
 await assert.rejects(service.saveProgress('alice',p),{code:'account/changed'});
 auth.currentUser=account('alice',false);await assert.rejects(service.saveProgress('alice',p),{code:'account/unverified'});
 assert.equal(calls.filter(c=>c[0]==='write').length,1);
});
test('transaction merges guest, cached and remote progress without erasing completed lessons',async()=>{
 const {service,auth,account}=fixture();auth.currentUser=account('alice');
 await service.saveProgress('alice',p);
 const result=await service.saveProgress('alice',{...p,done:['0-1'],solved:[],games:0});
 assert.deepEqual(new Set(result.done),new Set(['0-0','0-1']));assert.deepEqual(result.solved,['mate1']);assert.equal(result.games,1);
});
test('a session change during a transaction cannot write another account’s data',async()=>{
 const f=fixture();f.auth.currentUser=f.account('alice');
 f.d.runTransaction=async(db,callback)=>callback({async get(){f.auth.currentUser=f.account('bob');return {exists:()=>false}},set(){assert.fail('Must not write after an account switch')}});
 await assert.rejects(f.service.saveProgress('alice',p),{code:'account/changed'});
});
test('password recovery uses Firebase email, does not disclose unknown addresses and logout clears session',async()=>{
 const f=fixture();await f.service.resetPassword(' learner@example.test ');assert.deepEqual(f.calls.at(-1),['reset','learner@example.test']);
 f.a.sendPasswordResetEmail=async()=>{throw Object.assign(new Error(),{code:'auth/user-not-found'})};await f.service.resetPassword('missing@example.test');
 f.auth.currentUser=f.account('alice');await f.service.logout();assert.equal(f.service.currentUser(),null);
});
test('progress filters invalid ids, keeps unique achievements and is stable across merges',()=>{
 const result=normalizeProgress({done:['0-0','0-0','injected'],solved:['mate1','x'],games:-1,days:['2026-11-02','x']});
 assert.deepEqual(result,{...p,games:0});assert.deepEqual(mergeProgress(result,result),result);assert.ok(sameProgress(result,result));
});
test('the published root entry references dist assets and targets only the academy Firebase project',async()=>{
 const root=await readFile(new URL('../index.html',import.meta.url),'utf8');const dist=await readFile(new URL('../dist/index.html',import.meta.url),'utf8');
 assert.equal(root,dist.replaceAll('src="theme.js"','src="dist/theme.js"').replaceAll('href="styles.css"','href="dist/styles.css"').replaceAll('src="app.js"','src="dist/app.js"'));
 const config=JSON.parse(await readFile(new URL('../.firebaserc',import.meta.url),'utf8'));assert.equal(config.projects.default,'akademia64-89e49');
});
test('permission and connection errors have useful messages without raw service details',()=>{
 assert.match(firebaseMessage({code:'permission-denied'}),/dostępu/);assert.match(firebaseMessage({code:'auth/operation-not-allowed'}),/nie zostało/);assert.match(firebaseMessage({code:'unknown',message:'sensitive internal details'}),/Nie udało/);
});


test('deletion reauthenticates first and removes only the current user and their progress',async()=>{
 const f=fixture();f.auth.currentUser=f.account('alice');
 await f.service.saveProgress('alice',p);f.records.set('users/bob/progress/main',p);
 await f.service.deleteAccount('correct password');
 assert.equal(f.service.currentUser(),null);assert.equal(f.records.has('users/alice/progress/main'),false);assert.equal(f.records.has('users/bob/progress/main'),true);
 const sequence=f.calls.map(c=>c[0]);assert.ok(sequence.indexOf('reauth')<sequence.indexOf('delete-doc'));assert.ok(sequence.indexOf('delete-doc')<sequence.indexOf('delete-user'));
});
test('an incorrect confirmation password cannot remove data or an account',async()=>{
 const f=fixture();f.auth.currentUser=f.account('alice');await f.service.saveProgress('alice',p);
 await assert.rejects(f.service.deleteAccount('wrong password'),{code:'auth/invalid-credential'});
 assert.ok(f.records.has('users/alice/progress/main'));assert.equal(f.auth.currentUser.uid,'alice');assert.ok(!f.calls.some(c=>c[0]==='delete-doc'||c[0]==='delete-user'));
});
test('a failed final Firebase deletion restores the saved progress',async()=>{
 const f=fixture();f.auth.currentUser=f.account('alice');await f.service.saveProgress('alice',p);
 f.a.deleteUser=async()=>{throw Object.assign(new Error(),{code:'auth/network-request-failed'})};
 await assert.rejects(f.service.deleteAccount('correct password'),{code:'auth/network-request-failed'});
 assert.deepEqual(await f.service.getProgress('alice'),p);assert.equal(f.auth.currentUser.uid,'alice');
});
