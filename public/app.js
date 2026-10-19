(function(){
'use strict';
/* ---------- icons ---------- */
const P={
home:'<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
folder:'<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>',
megaphone:'<path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
bell:'<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
gamepad:'<line x1="6" x2="10" y1="11" y2="11"/><line x1="8" x2="8" y1="9" y2="13"/><line x1="15" x2="15.01" y1="12" y2="12"/><line x1="18" x2="18.01" y1="10" y2="10"/><path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z"/>',
settings:'<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
file:'<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
calendar:'<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
chevR:'<path d="m9 18 6-6-6-6"/>', chevL:'<path d="m15 18-6-6 6-6"/>',
plus:'<path d="M5 12h14"/><path d="M12 5v14"/>',
lock:'<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
logout:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>',
check:'<path d="M20 6 9 17l-5-5"/>', x:'<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
clock:'<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
pinmap:'<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
grid:'<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
cards:'<rect width="18" height="12" x="3" y="9" rx="2"/><path d="M5 5h14"/><path d="M7 2h10"/>',
pin:'<line x1="12" x2="12" y1="17" y2="22"/><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"/>',
trend:'<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',
msg:'<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
alert:'<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
pause:'<rect x="14" y="4" width="4" height="16" rx="1"/><rect x="6" y="4" width="4" height="16" rx="1"/>',
play:'<polygon points="6 3 20 12 6 21 6 3"/>',
refresh:'<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
edit:'<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>',
trash:'<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>',
video:'<path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/><rect x="2" y="6" width="14" height="12" rx="2"/>',
org:'<rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"/><path d="M12 12V8"/>',
mail:'<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
star:'<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>',
heart:'<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
moon:'<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
cloud:'<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>',
coffee:'<path d="M10 2v2"/><path d="M14 2v2"/><path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1"/><path d="M6 2v2"/>',
rocket:'<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
flag:'<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/>',
key:'<path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4"/><path d="m21 2-9.6 9.6"/><circle cx="7.5" cy="15.5" r="5.5"/>',
book:'<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/>',
};
const ic=(n,c='')=>`<svg class="ic ${c}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n]||''}</svg>`;
const LOGO=`<svg width="40" height="30" viewBox="0 0 40 30" aria-hidden="true"><rect x="13" y="1" width="14" height="7" rx="3.5" fill="currentColor"/><rect x="7" y="11.5" width="26" height="7" rx="3.5" fill="currentColor" opacity=".72"/><rect x="1" y="22" width="38" height="7" rx="3.5" fill="currentColor" opacity=".45"/></svg>`;

/* ---------- utils ---------- */
const $=s=>document.querySelector(s);
const DAY=864e5;
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uid=()=>Math.random().toString(36).slice(2,10);
const sod=d=>{const x=new Date(d);x.setHours(0,0,0,0);return x;};
const sow=d=>{const x=sod(d);x.setDate(x.getDate()-((x.getDay()+6)%7));return x;};
const addD=(d,n)=>{const x=new Date(d);x.setDate(x.getDate()+n);return x;};
const ymd=d=>{const x=new Date(d);return x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0');};
const pYmd=s=>{const [y,m,d]=s.split('-').map(Number);return new Date(y,m-1,d);};
const fD=(d,o)=>new Date(d).toLocaleDateString('tr-TR',o);
const fT=d=>new Date(d).toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit'});
const pct=n=>'%'+Math.round(n);
const trUp=s=>s.toLocaleUpperCase('tr-TR');
function rel(d){const s=(Date.now()-new Date(d))/1000;if(s<60)return 'az önce';if(s<3600)return Math.floor(s/60)+' dk önce';const days=Math.round((sod(new Date())-sod(d))/DAY);if(days===0)return Math.floor(s/3600)+' sa önce';if(days===1)return 'dün';if(days<7)return days+' gün önce';return fD(d,{day:'numeric',month:'short'});}
const daysLeft=due=>Math.round((pYmd(due)-sod(new Date()))/DAY);
const avg=a=>a.length?a.reduce((s,x)=>s+x,0)/a.length:0;
function toast(t){const el=$('#toast');el.textContent=t;el.classList.add('show');clearTimeout(toast._t);toast._t=setTimeout(()=>el.classList.remove('show'),2600);}
const COLORS=['#1d4f86','#0f7a8a','#7c3aed','#b45309','#be185d','#047857','#4338ca','#9a6700','#0e7490','#b91c1c','#5b21b6','#166534'];

/* ---------- server ---------- */
// Everything the signed-in person may see, as returned by /api/bootstrap. The server filters by role.
let db={me:null,users:[],projects:[],meetings:[],announcements:[],notifications:[],scores:[]};
let config={orgName:'Kademe',demo:false};
let booted=false;
class ApiError extends Error{constructor(status,msg,code){super(msg);this.status=status;this.code=code;}}
async function api(method,url,body){
  let res;
  try{res=await fetch('/api'+url,{method,credentials:'same-origin',headers:{'Content-Type':'application/json','X-Kademe':'1'},body:body===undefined?undefined:JSON.stringify(body)});}
  catch(e){throw new ApiError(0,'Sunucuya ulaşılamıyor. İnternet bağlantınızı kontrol edin.');}
  let data={};try{data=await res.json();}catch(e){}
  if(!res.ok)throw new ApiError(res.status,data.error||'Beklenmeyen bir hata oluştu.',data.code);
  return data;
}
async function refresh(){
  try{const d=await api('GET','/bootstrap');db=d;return true;}
  catch(e){if(e.status===401||e.status===403){const me0=e.code==='password_change_required'?db.me:null;db={me:me0,users:[],projects:[],meetings:[],announcements:[],notifications:[],scores:[]};if(me0)db.me.mustChangePassword=true;return false;}throw e;}
}
// Runs a change on the server, reloads the data and re-renders. Shows the server's message on failure.
async function act(fn,okMsg){
  try{const out=await fn();await refresh();render();if(okMsg)toast(typeof okMsg==='function'?okMsg(out):okMsg);return out;}
  catch(e){toast(e.message);if(e.status===401){await refresh();render();}return null;}
}
const viewKey='kademe-view';
const loadView=()=>{try{return JSON.parse(sessionStorage.getItem(viewKey))||{name:'home'};}catch(e){return {name:'home'};}};
const saveView=v=>{try{sessionStorage.setItem(viewKey,JSON.stringify(v));}catch(e){}};

/* ---------- domain ---------- */
const KIND={duyuru:'Duyuru',kural:'Kural',hatirlatma:'Hatırlatma'};
const ROLE={gmy:'Yönetici',director:'Direktör',manager:'Müdür',employee:'Çalışan'};
const RANK={gmy:0,director:1,manager:2,employee:3};
const isLead=u=>u.role!=='employee';
const HEALTH={iyi:['Yolunda','good'],risk:['Riskli','warn'],gecikme:['Gecikmede','bad']};
const byId=id=>db.users.find(u=>u.id===id);
const me=()=>db.me;
const active=()=>db.users.filter(u=>u.active);
const subs=u=>db.users.filter(x=>x.active&&x.managerId===u.id);
function chainUp(u){const out=[];let c=byId(u.managerId);while(c){out.push(c);c=byId(c.managerId);}return out;}
function scope(u){if(u.role==='gmy')return active().map(x=>x.id);const ids=[u.id];const walk=x=>subs(x).forEach(s=>{ids.push(s.id);walk(s);});walk(u);return ids;}
const isAbove=(a,b)=>!!b&&chainUp(b).some(x=>x.id===a.id);
function audienceIds(a,users){users=users||db.users;const act=users.filter(u=>u.active!==false);if(a.audience==='all')return act.map(u=>u.id);const lead=act.find(u=>u.id===a.audience);if(!lead)return [];const ids=[lead.id];const walk=x=>act.filter(y=>y.managerId===x.id).forEach(y=>{ids.push(y.id);walk(y);});walk(lead);const top=act.filter(u=>u.role==='gmy').map(u=>u.id);return [...new Set([...ids,...top])];}
function visProjects(){const u=me(),sc=scope(u);return db.projects.filter(p=>sc.includes(p.ownerId));}
function visMeetings(onlyMine){const u=me(),sc=scope(u);return db.meetings.filter(m=>{const ppl=[m.organizerId,...m.attendeeIds];if(onlyMine)return ppl.includes(u.id);return u.role==='gmy'||ppl.some(x=>sc.includes(x));}).sort((a,b)=>new Date(a.at)-new Date(b.at));}
function visAnns(){const u=me();return db.announcements.filter(a=>audienceIds(a).includes(u.id)||a.by===u.id).sort((a,b)=>(b.pinned-a.pinned)||(new Date(b.at)-new Date(a.at)));}
const canReport=p=>p.status==='active'&&(p.ownerId===me().id||isAbove(me(),byId(p.ownerId)));
const canManage=p=>me().role==='gmy'||isAbove(me(),byId(p.ownerId))||p.createdBy===me().id;
const lastReport=p=>p.reports[p.reports.length-1];
const staleDays=p=>{const r=lastReport(p);return Math.floor((Date.now()-new Date(r?r.at:p.createdAt))/DAY);};
const mEnd=m=>new Date(new Date(m.at).getTime()+m.dur*60e3);
function meetingCandidates(){const u=me();if(u.role==='gmy')return active().filter(x=>x.id!==u.id);const ids=new Set([...scope(u),...chainUp(u).map(x=>x.id),...db.users.filter(x=>x.active&&x.managerId===u.managerId).map(x=>x.id)]);ids.delete(u.id);return active().filter(x=>ids.has(x.id));}
function ownerCandidates(){const u=me();return active().filter(x=>scope(u).includes(x.id));}
const myNotes=()=>db.notifications.filter(n=>n.userId===me().id);
const unread=()=>myNotes().filter(n=>!n.read).length;
const initials=n=>trUp(n.split(/\s+/).filter(Boolean).map(w=>w[0]).filter((_,i,a)=>i===0||i===a.length-1).join(''));
const av=(u,s)=>u?`<span class="av" style="--c:${u.color}${s?';--s:'+s+'px':''}" title="${esc(u.name)}">${esc(initials(u.name))}</span>`:'';
const first=n=>n.split(' ')[0];
const hChip=p=>p.status==='done'?'<span class="chip">Tamamlandı</span>':`<span class="chip ${HEALTH[p.health][1]}">${HEALTH[p.health][0]}</span>`;
const barCls=p=>p.status==='done'?'':HEALTH[p.health][1];
const bar=(v,cls='',size='')=>`<div class="bar ${cls} ${size}" role="progressbar" aria-valuenow="${Math.round(v)}" aria-valuemin="0" aria-valuemax="100"><i style="width:${Math.max(0,Math.min(100,v))}%"></i></div>`;
function dueText(p){if(p.status==='done')return 'Tamamlandı';const d=daysLeft(p.due);const f=fD(pYmd(p.due),{day:'numeric',month:'short'});if(d<0)return `${f} · ${-d} gün gecikti`;if(d===0)return `${f} · bugün`;return `${f} · ${d} gün kaldı`;}

/* ---------- ui state ---------- */
const hostTheme=document.documentElement.getAttribute('data-theme');
const state={view:loadView(),sheet:null,game:null,
  projTab:'active',projPerson:'all',lobbyKind:'all',inboxTab:'all',lbPeriod:'week',lbGame:'all',
  weekOff:0,selDay:ymd(new Date()),mtgScope:'mine',confirmFn:null};
function applyTheme(){const u=me();const t=u?u.theme:'system';const r=document.documentElement;if(t==='light'||t==='dark')r.setAttribute('data-theme',t);else if(hostTheme)r.setAttribute('data-theme',hostTheme);else r.removeAttribute('data-theme');}
function go(name,params){state.view=Object.assign({name},params||{});saveView(state.view);render();window.scrollTo(0,0);}
const TAB_OF={home:'home',meetings:'home',team:'home',weekly:'home',projects:'projects',project:'projects',lobby:'lobby',inbox:'inbox',games:'games',settings:'settings'};

/* ---------- views ---------- */
const DEMO=[['Genel Müdür Yardımcısı',[['halit','Halit Özdamar']]],['Direktörler',[['ayse','Ayşe Kaya'],['murat','Murat Demir'],['elif','Elif Şahin']]],['Müdürler',[['emre','Emre Yıldız'],['zeynep','Zeynep Arslan'],['can','Can Öztürk'],['selin','Selin Aydın'],['burak','Burak Koç'],['deniz','Deniz Çelik']]],['Çalışanlar',[['ali','Ali Vural'],['ece','Ece Tan']]]];
function vLogin(err,uname){
  return `<div class="login">
    <div class="brand">${LOGO}<b>${esc(trUp(config.orgName))}</b><small>Yönetim Portalı</small></div>
    <form class="card stack" data-form="login">
      <h1 class="page-h" style="font-size:24px;margin:0">Giriş yap</h1>
      <label class="field"><span>Kullanıcı adı veya e-posta</span><input class="inp" id="lg-user" name="username" autocomplete="username" autocapitalize="none" required value="${esc(uname||'')}"></label>
      <label class="field"><span>Şifre</span><input class="inp" id="lg-pass" name="password" type="password" autocomplete="current-password" required></label>
      ${err?`<div class="err" role="alert">${esc(err)}</div>`:''}
      <button class="btn pri block" type="submit">Giriş yap</button>
      <div class="faint small">Şifrenizi unuttuysanız bağlı olduğunuz yöneticiden sıfırlamasını isteyin.</div>
    </form>
    ${config.demo?`<div class="card stack" style="gap:6px">
      <div class="row between"><b>Demo hesapları</b><span class="faint small">Şifre: <code>demo1234</code></span></div>
      <div class="faint small">Bu kurulum demo modunda. Bir hesaba dokunarak giriş yapın.</div>
      ${DEMO.map(([g,list])=>`<div class="small muted" style="margin-top:8px;font-weight:500">${g}</div>
        ${list.map(([un,name],i)=>`<button class="demo" data-act="demoLogin" data-u="${un}"><span class="av" style="--c:${COLORS[(DEMO.flatMap(x=>x[1]).findIndex(x=>x[0]===un))%COLORS.length]};--s:32px">${esc(initials(name))}</span><span class="grow"><b class="ellip" style="display:block">${esc(name)}</b></span><code>${un}</code></button>`).join('')}`).join('')}
    </div>`:''}
  </div>`;
}
function vPassword(err){
  const u=me();
  return `<div class="login">
    <div class="brand">${LOGO}<b>${esc(trUp(config.orgName))}</b><small>Yönetim Portalı</small></div>
    <form class="card stack" data-form="firstPassword">
      <h1 class="page-h" style="font-size:24px;margin:0">Yeni şifre belirleyin</h1>
      <p class="muted" style="margin:0">Merhaba ${esc(first(u.name))}. Hesabınız geçici bir şifreyle açıldı. Devam etmek için kendi şifrenizi belirleyin.</p>
      <label class="field"><span>Geçici şifre</span><input class="inp" id="fp-cur" name="cur" type="password" autocomplete="current-password" required></label>
      <label class="field"><span>Yeni şifre (en az 8 karakter)</span><input class="inp" id="fp-new" name="nw" type="password" autocomplete="new-password" minlength="8" required></label>
      <label class="field"><span>Yeni şifre (tekrar)</span><input class="inp" id="fp-new2" name="nw2" type="password" autocomplete="new-password" minlength="8" required></label>
      ${err?`<div class="err" role="alert">${esc(err)}</div>`:''}
      <button class="btn pri block" type="submit">Şifreyi kaydet ve devam et</button>
      <button class="btn block" type="button" data-act="logout">Çıkış yap</button>
    </form></div>`;
}

function vHeader(){
  const u=me(),n=unread(),now=new Date();
  return `<div class="top">
    <div class="date"><span class="muted">${esc(fD(now,{weekday:'long'}))}</span><b>${esc(fD(now,{day:'numeric',month:'long'}))}</b></div>
    <div class="brand">${LOGO}<b>${esc(trUp(config.orgName))}</b></div>
    <div class="acts"><button class="iconbtn" data-act="tab" data-v="inbox" aria-label="Gelen kutusu">${ic('bell')}${n?`<span class="dot">${n}</span>`:''}</button>
    <button class="me-btn" data-act="tab" data-v="settings" aria-label="Ayarlar">${av(u)}</button></div>
  </div>`;
}

function ring(v){const r=40,c=2*Math.PI*r;return `<div class="ring"><svg viewBox="0 0 96 96"><circle cx="48" cy="48" r="${r}" style="stroke:var(--track)"/><circle cx="48" cy="48" r="${r}" style="stroke:var(--accent);stroke-linecap:round" stroke-dasharray="${c}" stroke-dashoffset="${c*(1-v/100)}"/></svg><b class="num">${pct(v)}</b></div>`;}

function meetingRow(m){
  const u=me(),past=mEnd(m)<new Date(),ppl=[m.organizerId,...m.attendeeIds].map(byId).filter(Boolean);
  const r=m.organizerId===u.id?'org':m.rsvp[u.id];
  const st=r==='org'?'<span class="chip gray">Düzenleyen</span>':r==='yes'?'<span class="chip good">Katılıyorum</span>':r==='no'?'<span class="chip bad">Katılamıyorum</span>':m.attendeeIds.includes(u.id)?'<span class="chip warn">Yanıt bekliyor</span>':'';
  return `<button class="li" data-act="openMeeting" data-id="${m.id}">
    <div class="timebox ${past?'past':''}"><b class="num">${fT(m.at)}</b><span>${m.dur} dk</span></div>
    <div class="grow"><b class="ellip" style="display:block">${esc(m.title)}</b>
      <div class="meta"><span>${ic(m.mode==='online'?'video':'pinmap')}${esc(m.location||'—')}</span></div>
      <div class="row" style="margin-top:6px;gap:8px"><span class="avs">${ppl.slice(0,4).map(p=>av(p)).join('')}${ppl.length>4?`<span class="av more">+${ppl.length-4}</span>`:''}</span>${past?'<span class="chip gray">Geçti</span>':st}</div>
    </div>${ic('chevR','chev')}</button>`;
}

function personProg(uId){const ps=db.projects.filter(p=>p.status==='active'&&scope(byId(uId)).includes(p.ownerId));return {n:ps.length,avg:avg(ps.map(p=>p.progress)),bad:ps.filter(p=>p.health!=='iyi').length};}

function vHome(){
  const u=me();
  const projs=visProjects().filter(p=>p.status==='active');
  const mine=projs.filter(p=>p.ownerId===u.id), team=projs.filter(p=>p.ownerId!==u.id);
  const risky=projs.filter(p=>p.health!=='iyi');
  const up=visMeetings(true).filter(m=>mEnd(m)>new Date()).slice(0,3);
  const needs=mine.filter(p=>staleDays(p)>=7);
  const watch=team.filter(p=>p.health!=='iyi'||staleDays(p)>=7).sort((a,b)=>(b.health==='gecikme')-(a.health==='gecikme')).slice(0,4);
  const lead=isLead(u);
  const tile3=lead?`<button class="tile" data-act="go" data-v="team">${ic('org')}Ekibim</button>`:`<button class="tile" data-act="quickReport">${ic('trend')}Rapor gir</button>`;
  return `${vHeader()}
  <div><h1 class="hello">Merhaba ${esc(first(u.name))}</h1><div class="muted" style="font-size:16px">${esc(u.title)}</div></div>
  <div class="tiles">
    <button class="tile" data-act="go" data-v="weekly">${ic('file')}Haftalık rapor</button>
    <button class="tile" data-act="go" data-v="meetings">${ic('calendar')}Toplantılar</button>
    ${tile3}
  </div>
  <button class="card ringcard" data-act="tab" data-v="projects" style="text-align:left;color:inherit">${ring(avg(projs.map(p=>p.progress)))}
    <div class="grow"><div class="muted">${lead?'Ekibin proje ilerlemesi':'Proje ilerlemem'}</div><div style="font-size:24px;font-weight:700" class="num">${projs.length} aktif proje</div>
    <div class="row" style="margin-top:6px;flex-wrap:wrap;gap:6px">${risky.length?`<span class="chip warn">${risky.length} riskli / gecikmede</span>`:'<span class="chip good">Hepsi yolunda</span>'}</div></div></button>
  <div class="two">
    <div class="card stat"><div class="k">Bana atanan</div><div class="v num">${mine.length} proje · ${pct(avg(mine.map(p=>p.progress)))}</div></div>
    ${lead?`<div class="card stat"><div class="k">Ekibimin</div><div class="v num">${team.length} proje · ${pct(avg(team.map(p=>p.progress)))}</div></div>`
          :`<div class="card stat"><div class="k">Bu hafta toplantı</div><div class="v num">${visMeetings(true).filter(m=>sow(m.at).getTime()===sow(new Date()).getTime()).length} toplantı</div></div>`}
  </div>
  <div class="h2">Yaklaşan toplantılarım <button class="link" data-act="go" data-v="meetings">Takvim</button></div>
  <div class="card">${up.length?up.map(meetingRow).join(''):'<div class="muted">Yaklaşan toplantınız yok.</div>'}</div>
  <div class="h2">Güncellemeniz gerekenler</div>
  ${needs.length?`<div class="card">${needs.map(p=>`<div class="li"><div class="grow"><b class="ellip" style="display:block">${esc(p.name)}</b><div class="small muted">Son rapor ${staleDays(p)} gün önce · ${pct(p.progress)}</div></div><button class="btn sm pri" data-act="report" data-id="${p.id}">Rapor gir</button></div>`).join('')}</div>`:'<div class="muted" style="margin-top:-6px">Açık maddeniz yok. Tüm projelerinizin raporu güncel.</div>'}
  ${lead&&watch.length?`<div class="h2">Takip gerektirenler</div><div class="card">${watch.map(p=>{const o=byId(p.ownerId);return `<button class="li" data-act="openProject" data-id="${p.id}">${av(o)}<div class="grow"><b class="ellip" style="display:block">${esc(p.name)}</b><div class="small muted ellip">${esc(o.name)} · ${staleDays(p)>=7?`${staleDays(p)} gündür rapor yok`:esc(lastReport(p)?lastReport(p).note:'')}</div></div>${hChip(p)}</button>`;}).join('')}</div>`:''}
  ${lead?`<div class="h2">Ekip durumu <button class="link" data-act="go" data-v="team">Tümü</button></div>
  <div class="card">${subs(u).map(s=>{const pr=personProg(s.id);return `<button class="li" data-act="openPerson" data-id="${s.id}">${av(s)}<div class="grow"><div class="row between"><b class="ellip">${esc(s.name)}</b><span class="small muted num">${pr.n} proje · ${pct(pr.avg)}</span></div><div class="small muted ellip" style="margin-bottom:6px">${esc(s.title)}</div>${bar(pr.avg,pr.bad?'warn':'good','thin')}</div>${ic('chevR','chev')}</button>`;}).join('')||'<div class="muted">Henüz bağlı kişi yok.</div>'}</div>`:''}
  <button class="dashed" data-act="${lead?'newProject':'quickReport'}">${ic('plus')}${lead?'Yeni proje ata':'İlerleme raporu gir'}</button>
  <div class="lock">${ic('lock')}<span>${u.role==='gmy'?'Tüm direktörlük ve müdürlükleri görüyorsunuz.':u.role==='employee'?'Yalnızca size atanan projeler ve toplantılarınız görünür.':'Yalnızca kendinizin ve size bağlı kişilerin işleri görünür.'}</span></div>`;
}

function vProjects(){
  const u=me(),all=visProjects();
  const people=[...new Set(all.map(p=>p.ownerId))].map(byId).filter(Boolean);
  let list=all.filter(p=>state.projTab==='active'?p.status==='active':p.status==='done');
  if(state.projPerson!=='all')list=list.filter(p=>p.ownerId===state.projPerson);
  const rank={gecikme:0,risk:1,iyi:2};
  list.sort((a,b)=>state.projTab==='active'?(rank[a.health]-rank[b.health])||(pYmd(a.due)-pYmd(b.due)):pYmd(b.due)-pYmd(a.due));
  const na=all.filter(p=>p.status==='active').length, nd=all.length-na;
  return `<h1 class="page-h">Projeler</h1>
  <div class="pills"><button class="pill ${state.projTab==='active'?'on':''}" data-act="projTab" data-v="active">Aktif · ${na}</button><button class="pill ${state.projTab==='done'?'on':''}" data-act="projTab" data-v="done">Tamamlanan · ${nd}</button></div>
  ${people.length>1?`<label class="field"><span>Kişiye göre</span><select class="inp" id="proj-person" data-change="projPerson"><option value="all">Herkes</option>${people.map(p=>`<option value="${p.id}" ${state.projPerson===p.id?'selected':''}>${esc(p.name)}</option>`).join('')}</select></label>`:''}
  ${list.length?list.map(pCard).join(''):`<div class="empty">${state.projTab==='active'?'Size atanmış aktif proje yok.':'Tamamlanan proje yok.'}</div>`}
  ${isLead(u)?`<button class="dashed" data-act="newProject">${ic('plus')}Yeni proje ata</button>`:''}`;
}
function pCard(p){const o=byId(p.ownerId);return `<button class="card pcard" data-act="openProject" data-id="${p.id}">
  <div class="row between" style="align-items:flex-start"><span class="t grow">${esc(p.name)}</span>${hChip(p)}</div>
  <div class="meta"><span>${av(o,22)} ${esc(o?o.name:'—')}</span><span>${ic('clock')}${dueText(p)}</span></div>
  <div class="row">${bar(p.progress,barCls(p))}<b class="num" style="min-width:44px;text-align:right">${pct(p.progress)}</b></div></button>`;}

function spark(p){
  const pts=[{t:new Date(p.createdAt).getTime(),v:0},...p.reports.map(r=>({t:new Date(r.at).getTime(),v:r.progress}))];
  if(pts.length<2)return '';
  const t0=pts[0].t,t1=Math.max(Date.now(),pts[pts.length-1].t),W=300,H=64,px=t=>6+(t-t0)/(t1-t0||1)*(W-12),py=v=>H-6-v/100*(H-12);
  const line=pts.map(q=>`${px(q.t).toFixed(1)},${py(q.v).toFixed(1)}`).join(' ');
  const lp=pts[pts.length-1];
  return `<svg class="spark" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-label="İlerleme geçmişi">
   <line x1="0" x2="${W}" y1="${py(50)}" y2="${py(50)}" style="stroke:var(--line)" stroke-dasharray="3 4"/>
   <polygon points="${px(t0)},${H-6} ${line} ${px(lp.t)},${H-6}" style="fill:var(--accent-soft)"/>
   <polyline points="${line}" fill="none" style="stroke:var(--accent)" stroke-width="2.2" vector-effect="non-scaling-stroke"/>
   <circle cx="${px(lp.t)}" cy="${py(lp.v)}" r="4" style="fill:var(--accent)"/></svg>`;
}

function vProject(){
  const p=db.projects.find(x=>x.id===state.view.id);
  if(!p||!visProjects().includes(p))return `<button class="back" data-act="tab" data-v="projects">${ic('chevL')}Projeler</button><div class="empty">Bu proje bulunamadı veya görme yetkiniz yok.</div>`;
  const o=byId(p.ownerId),lr=lastReport(p),cr=byId(p.createdBy);
  const reps=[...p.reports].reverse();
  return `<button class="back" data-act="tab" data-v="projects">${ic('chevL')}Projeler</button>
  <div><h1 class="page-h">${esc(p.name)}</h1><div class="row" style="margin-top:8px;flex-wrap:wrap">${hChip(p)}<span class="chip gray">${esc(o.dept)}</span></div></div>
  ${p.desc?`<p class="muted" style="margin:0">${esc(p.desc)}</p>`:''}
  <div class="card stack">
    <div class="row between"><span class="muted">İlerleme</span><b class="num" style="font-size:28px">${pct(p.progress)}</b></div>
    ${bar(p.progress,barCls(p),'big')}
    ${spark(p)}
    <div class="meta"><span>${ic('clock')}${dueText(p)}</span><span>${ic('trend')}${lr?`Son rapor ${rel(lr.at)}`:'Henüz rapor yok'}</span></div>
  </div>
  <button class="card row" data-act="openPerson" data-id="${o.id}" style="color:inherit;text-align:left">${av(o,40)}<div class="grow"><div class="small muted">Proje sahibi</div><b>${esc(o.name)}</b><div class="small muted">${esc(o.title)}</div></div>${ic('chevR','chev')}</button>
  ${canReport(p)?`<button class="btn pri block" data-act="report" data-id="${p.id}">${ic('trend')}İlerleme raporu gir</button>`:''}
  ${canManage(p)?`<div class="row" style="flex-wrap:wrap;gap:8px">
    <button class="btn sm" data-act="editProject" data-id="${p.id}">${ic('edit')}Düzenle</button>
    ${p.status==='active'?`<button class="btn sm" data-act="completeProject" data-id="${p.id}">${ic('check')}Tamamlandı olarak işaretle</button>`:`<button class="btn sm" data-act="reopenProject" data-id="${p.id}">${ic('refresh')}Yeniden aç</button>`}
    <button class="btn sm danger" data-act="deleteProject" data-id="${p.id}">${ic('trash')}Sil</button></div>`:''}
  <div class="h2">İlerleme raporları</div>
  <div class="card tl">${reps.length?reps.map((r,i)=>{const prev=reps[i+1]?reps[i+1].progress:0,dl=r.progress-prev,a=byId(r.by);return `<div class="it">${av(a)}<div style="min-width:0"><div class="row between" style="flex-wrap:wrap;gap:6px"><b>${esc(a?a.name:'—')}</b><span class="small faint">${fD(r.at,{day:'numeric',month:'short'})} · ${fT(r.at)}</span></div>
     <div class="row" style="gap:8px;margin:4px 0;flex-wrap:wrap"><b class="num">${pct(r.progress)}</b><span class="delta num ${dl>0?'up':dl<0?'down':'flat'}">${dl>0?'+':''}${dl} puan</span><span class="chip ${HEALTH[r.health][1]}">${HEALTH[r.health][0]}</span></div>
     <div class="muted" style="white-space:pre-wrap">${esc(r.note)}</div></div></div>`;}).join(''):'<div class="muted">Henüz rapor girilmedi.</div>'}</div>
  <div class="h2">Yorumlar</div>
  <div class="card stack">
    ${p.comments.length?`<div class="tl">${p.comments.map(c=>{const a=byId(c.by);return `<div class="it">${av(a)}<div style="min-width:0"><div class="row between" style="flex-wrap:wrap;gap:6px"><b>${esc(a?a.name:'—')}</b><span class="small faint">${rel(c.at)}</span></div><div class="muted" style="white-space:pre-wrap">${esc(c.text)}</div></div></div>`;}).join('')}</div>`:'<div class="muted">Henüz yorum yok.</div>'}
    <form class="row" data-form="comment" data-id="${p.id}"><input class="inp grow" id="cm-${p.id}" name="text" placeholder="Yorum yazın" required maxlength="500"><button class="btn pri" type="submit">Gönder</button></form>
  </div>
  <div class="faint small">Oluşturan: ${esc(cr?cr.name:'—')} · Başlangıç ${fD(pYmd(p.start),{day:'numeric',month:'long'})}</div>`;
}

function vMeetings(){
  const u=me(),lead=isLead(u);
  const ws=addD(sow(new Date()),state.weekOff*7);
  const list=visMeetings(state.mtgScope==='mine'||!lead);
  const days=[...Array(7)].map((_,i)=>addD(ws,i));
  const sel=state.selDay;
  const dayList=list.filter(m=>ymd(m.at)===sel);
  const weekN=list.filter(m=>sow(m.at).getTime()===ws.getTime()).length;
  const short=['Pzt','Sal','Çar','Per','Cum','Cmt','Paz'];
  return `<button class="back" data-act="tab" data-v="home">${ic('chevL')}Ana sayfa</button>
  <h1 class="page-h">Toplantılar</h1>
  ${lead?`<div class="pills"><button class="pill ${state.mtgScope==='mine'?'on':''}" data-act="mtgScope" data-v="mine">Takvimim</button><button class="pill ${state.mtgScope==='team'?'on':''}" data-act="mtgScope" data-v="team">${u.role==='gmy'?'Tüm kurum':'Ekibimin'}</button></div>`:''}
  <div class="card stack">
    <div class="row between"><b>${fD(ws,{day:'numeric',month:'long'})} – ${fD(addD(ws,6),{day:'numeric',month:'long'})}</b><span class="small muted num">${weekN} toplantı</span></div>
    <div class="week">
      <button class="iconbtn" data-act="week" data-v="-1" aria-label="Önceki hafta">${ic('chevL')}</button>
      ${days.map((d,i)=>{const k=ymd(d);const has=list.some(m=>ymd(m.at)===k);return `<button class="day ${has?'has':''} ${k===ymd(new Date())?'today':''} ${k===sel?'on':''}" data-act="selDay" data-v="${k}">${short[i]}<b class="num">${d.getDate()}</b><i></i></button>`;}).join('')}
      <button class="iconbtn" data-act="week" data-v="1" aria-label="Sonraki hafta">${ic('chevR')}</button>
    </div>
  </div>
  <div class="h2">${esc(fD(pYmd(sel),{weekday:'long',day:'numeric',month:'long'}))}</div>
  <div class="card">${dayList.length?dayList.map(meetingRow).join(''):'<div class="muted">Bu gün için toplantı yok.</div>'}</div>
  <button class="dashed" data-act="newMeeting">${ic('plus')}Toplantı planla</button>`;
}

function vTeam(){
  const u=me();
  const root=u.role==='gmy'?u:u;
  const node=x=>{const pr=personProg(x.id);const k=subs(x);return `<div><button class="card node" data-act="openPerson" data-id="${x.id}">${av(x,40)}<div class="grow"><div class="row between"><b class="ellip">${esc(x.name)}</b><span class="small muted num">${pr.n} proje</span></div><div class="small muted ellip" style="margin-bottom:6px">${esc(x.title)}</div><div class="row">${bar(pr.avg,pr.bad?'warn':'good','thin')}<span class="small num" style="min-width:36px;text-align:right">${pct(pr.avg)}</span></div></div></button>${k.length?`<div class="kids" style="margin-top:10px">${k.map(node).join('')}</div>`:''}</div>`;};
  return `<button class="back" data-act="tab" data-v="home">${ic('chevL')}Ana sayfa</button>
  <h1 class="page-h">Ekibim</h1><p class="lead">Size bağlı kişiler ve onların ekipleri. Bir kişiye dokunarak projelerini ve toplantılarını görün.</p>
  <div class="tree">${node(root)}</div>
  ${isLead(u)?`<button class="dashed" data-act="newPerson">${ic('plus')}Kişi ekle</button>`:''}`;
}

function vWeekly(){
  const u=me(),cut=Date.now()-7*DAY;
  const ps=visProjects();const actv=ps.filter(p=>p.status==='active');
  const at=(p,t)=>{let v=0;p.reports.forEach(r=>{if(new Date(r.at).getTime()<=t)v=r.progress;});return v;};
  const people=scope(u).map(byId).filter(x=>x&&ps.some(p=>p.ownerId===x.id));
  const reps=[];ps.forEach(p=>p.reports.forEach(r=>{if(new Date(r.at).getTime()>=cut)reps.push({p,r});}));reps.sort((a,b)=>new Date(b.r.at)-new Date(a.r.at));
  const mt=visMeetings(!isLead(u)).filter(m=>new Date(m.at).getTime()>=cut&&new Date(m.at)<=new Date());
  const totalDelta=avg(actv.map(p=>p.progress-at(p,cut)));
  return `<button class="back" data-act="tab" data-v="home">${ic('chevL')}Ana sayfa</button>
  <h1 class="page-h">Haftalık rapor</h1><p class="lead">${fD(cut,{day:'numeric',month:'long'})} – ${fD(new Date(),{day:'numeric',month:'long'})} arası, ${u.role==='gmy'?'tüm kurum':u.role==='employee'?'projeleriniz':'ekibiniz'}.</p>
  <div class="two">
    <div class="card stat"><div class="k">Ortalama ilerleme</div><div class="v num">${pct(avg(actv.map(p=>p.progress)))} <span class="delta up small">${totalDelta>=0?'+':''}${Math.round(totalDelta)} puan</span></div></div>
    <div class="card stat"><div class="k">Girilen rapor</div><div class="v num">${reps.length} rapor</div></div>
    <div class="card stat"><div class="k">Yapılan toplantı</div><div class="v num">${mt.length} toplantı</div></div>
    <div class="card stat"><div class="k">Riskli / gecikmede</div><div class="v num">${actv.filter(p=>p.health!=='iyi').length} proje</div></div>
  </div>
  <div class="h2">Kişi bazında</div>
  <div class="card">${people.map(x=>{const mine=actv.filter(p=>p.ownerId===x.id);const d=avg(mine.map(p=>p.progress-at(p,cut)));const n=reps.filter(q=>q.p.ownerId===x.id).length;const stale=mine.some(p=>staleDays(p)>=7);return `<button class="li" data-act="openPerson" data-id="${x.id}">${av(x)}<div class="grow"><div class="row between"><b class="ellip">${esc(x.name)}</b><span class="delta num ${d>0?'up':d<0?'down':'flat'}">${d>0?'+':''}${Math.round(d)} puan</span></div>
    <div class="small muted" style="margin-bottom:6px">${mine.length} aktif proje · ${n} rapor${stale?' · <span style="color:var(--warn)">rapor eksik</span>':''}</div>${bar(avg(mine.map(p=>p.progress)),stale?'warn':'good','thin')}</div></button>`;}).join('')||'<div class="muted">Bu dönemde veri yok.</div>'}</div>
  <div class="h2">Bu hafta girilen raporlar</div>
  <div class="card tl">${reps.length?reps.map(({p,r})=>{const a=byId(r.by);return `<div class="it">${av(a)}<div style="min-width:0"><button class="link" data-act="openProject" data-id="${p.id}" style="text-align:left">${esc(p.name)}</button><div class="row" style="gap:8px;margin:2px 0;flex-wrap:wrap"><b class="num">${pct(r.progress)}</b><span class="chip ${HEALTH[r.health][1]}">${HEALTH[r.health][0]}</span><span class="small faint">${esc(a.name)} · ${rel(r.at)}</span></div><div class="muted small">${esc(r.note)}</div></div></div>`;}).join(''):'<div class="muted">Son 7 günde rapor girilmedi.</div>'}</div>`;
}

function vLobby(){
  const u=me(),list=visAnns().filter(a=>state.lobbyKind==='all'||a.kind===state.lobbyKind);
  return `<h1 class="page-h">Ortak Uyum Lobisi</h1>
  <p class="lead">Tüm yöneticilerin görmesi ve uyması gereken duyuru, kural ve hatırlatmalar.</p>
  <div class="pills">${[['all','Tümü'],['duyuru','Duyurular'],['kural','Kurallar'],['hatirlatma','Hatırlatmalar']].map(([k,l])=>`<button class="pill sm ${state.lobbyKind===k?'on':''}" data-act="lobbyKind" data-v="${k}">${l}</button>`).join('')}</div>
  ${list.length?list.map(a=>{const by=byId(a.by),aud=audienceIds(a).filter(x=>x!==a.by),read=a.acks.filter(x=>aud.includes(x)).length,acked=a.acks.includes(u.id),mineOrBoss=a.by===u.id||u.role==='gmy';
    const kc={duyuru:'',kural:'bad',hatirlatma:'warn'}[a.kind];
    return `<article class="card ann ${a.pinned?'pinned':''}"><div class="k"><span class="chip ${kc}">${KIND[a.kind]}</span>${a.pinned?`<span class="chip gray">${ic('pin','sm')}Sabit</span>`:''}<span class="small faint">${a.audience==='all'?'Tüm kurum':esc((byId(a.audience)||{}).name||'')+' ekibi'}</span></div>
    <h3>${esc(a.title)}</h3><p>${esc(a.body)}</p>
    <div class="row between" style="margin-top:12px;flex-wrap:wrap;gap:8px"><div class="row small muted">${av(by,24)}${esc(by.name)} · ${rel(a.at)}</div>
    <div class="row" style="gap:8px">${mineOrBoss?`<button class="btn sm" data-act="ackList" data-id="${a.id}">${read}/${aud.length} okudu</button>`:''}
    ${a.by===u.id?(u.role==='gmy'||a.by===u.id?`<button class="iconbtn" data-act="deleteAnn" data-id="${a.id}" aria-label="Sil">${ic('trash')}</button>`:''):acked?`<span class="chip good">${ic('check','sm')}Okudum</span>`:`<button class="btn sm pri" data-act="ack" data-id="${a.id}">Okudum, uyacağım</button>`}</div></div></article>`;}).join(''):'<div class="empty">Henüz duyuru yok.</div>'}
  ${isLead(u)?`<button class="dashed" data-act="newAnn">${ic('plus')}Lobi'de yayınla</button>`:''}`;
}

const NKIND={meeting:['calendar','Toplantı'],report:['trend','Rapor'],lobby:['megaphone','Lobi'],comment:['msg','Yorum'],project:['folder','Proje']};
function vInbox(){
  const all=myNotes(),n=all.filter(x=>!x.read).length;
  const list=state.inboxTab==='unread'?all.filter(x=>!x.read):all;
  return `<h1 class="page-h">Gelen Kutusu</h1>
  <div class="row between" style="flex-wrap:wrap"><div class="pills"><button class="pill ${state.inboxTab==='all'?'on':''}" data-act="inboxTab" data-v="all">Tümü</button><button class="pill ${state.inboxTab==='unread'?'on':''}" data-act="inboxTab" data-v="unread">Okunmamış (${n})</button></div>
  ${n?'<button class="link" data-act="readAll">Tümünü okundu yap</button>':''}</div>
  ${list.length?`<div class="stack">${list.map(x=>`<button class="nt ${x.read?'':'unread'}" data-act="openNote" data-id="${x.id}"><span class="ico">${ic(NKIND[x.kind][0])}</span><span class="grow"><span style="display:block">${esc(x.text)}</span><span class="small faint">${NKIND[x.kind][1]} · ${rel(x.at)}</span></span>${x.read?'':'<span class="ud" aria-label="Okunmamış"></span>'}</button>`).join('')}</div>`:`<div class="empty">${state.inboxTab==='unread'?'Okunmamış bildiriminiz yok.':'Henüz bildirim yok.'}</div>`}`;
}

const GAMES={xox:['XOX','Bilgisayara karşı','grid','#1287a8'],hangman:['Adam Asmaca','Sağlık, yönetim, teknoloji, genel',null,'#1e3a6e'],memory:['Hafıza Kartları','Eşleri bul, kafanı boşalt','cards','#7c3aed']};
function leaderboard(){
  const now=new Date(),since=state.lbPeriod==='today'?sod(now):state.lbPeriod==='week'?sow(now):new Date(0);
  const rows=db.scores.filter(s=>new Date(s.at)>=since&&(state.lbGame==='all'||s.game===state.lbGame));
  const m=rows.length?avg(rows.map(r=>r.score)):50,C=5;const g={};
  rows.forEach(r=>{(g[r.userId]=g[r.userId]||{n:0,sum:0}).n++;g[r.userId].sum+=r.score;});
  return Object.entries(g).map(([id,v])=>({u:byId(id),n:v.n,avg:v.sum/v.n,pts:(v.sum+C*m)/(v.n+C)})).filter(x=>x.u&&x.u.active).sort((a,b)=>b.pts-a.pts);
}
function vGames(){
  const lb=leaderboard(),u=me();
  return `<div><h1 class="page-h">Mola</h1><p class="lead" style="margin-top:6px">Kısa bir ara için üç küçük oyun. Üç seviye, duraklatma ve skor tablosu.</p></div>
  ${Object.entries(GAMES).map(([k,[t,s,i,c]])=>`<button class="card game" data-act="openGame" data-v="${k}"><span class="gicon" style="background:${c}">${i?ic(i):'Aa'}</span><span class="grow"><b>${t}</b><span class="muted">${s}</span></span>${ic('chevR','chev')}</button>`).join('')}
  <div class="card stack">
    <b style="font-size:19px">Skor tablosu</b>
    <div class="pills">${[['today','Bugün'],['week','Bu hafta'],['all','Tüm zamanlar']].map(([k,l])=>`<button class="pill ${state.lbPeriod===k?'on':''}" data-act="lbPeriod" data-v="${k}">${l}</button>`).join('')}</div>
    <div class="pills">${[['all','Tüm oyunlar'],['xox','XOX'],['hangman','Adam Asmaca'],['memory','Hafıza Kartları']].map(([k,l])=>`<button class="pill sm ${state.lbGame===k?'on':''}" data-act="lbGame" data-v="${k}">${l}</button>`).join('')}</div>
    ${lb.length?`<div style="overflow-x:auto"><table class="lb"><thead><tr><th>#</th><th>Oyuncu</th><th>Oyun</th><th>Ort.</th><th>Puan</th></tr></thead><tbody>
    ${lb.map((r,i)=>`<tr class="${r.u.id===u.id?'me':''}"><td>${i+1}</td><td class="name">${esc(r.u.name)}</td><td>${r.n}</td><td>${Math.round(r.avg)}</td><td class="pts">${Math.round(r.pts)}</td></tr>`).join('')}</tbody></table></div>`:'<div class="muted">Bu dönemde oynanmış oyun yok. İlk skoru siz yazın.</div>'}
    <div class="small muted">Puan, oyun başına ortalamadır; az oyun oynayanların puanı genel ortalamaya doğru dengelenir. Böylece hem az hem çok oynayan adil karşılaştırılır.</div>
  </div>`;
}

function vSettings(){
  const u=me(),boss=byId(u.managerId);
  const prefs=[['meeting','Toplantı davetleri ve yanıtlar'],['report','İlerleme raporları'],['lobby','Lobi duyuruları'],['comment','Proje yorumları'],['project','Proje atamaları']];
  return `<h1 class="page-h">Ayarlar</h1>
  <div class="card row">${av(u,56)}<div class="grow"><b style="font-size:18px">${esc(u.name)}</b><div class="muted">${esc(u.title)}</div><div class="small faint">${esc(u.dept)}${boss?' · Bağlı: '+esc(boss.name):''}</div></div></div>
  ${isLead(u)?`<button class="card row" data-act="go" data-v="team" style="color:inherit;text-align:left">${ic('org')}<div class="grow"><b>Ekip yönetimi</b><div class="small muted">Ekibinize kişi ekleyin, bağlılıkları düzenleyin</div></div>${ic('chevR','chev')}</button>`:''}
  <form class="card stack" data-form="profile"><b>Profil bilgileri</b>
    <label class="field"><span>Ad soyad</span><input class="inp" id="pf-name" name="name" value="${esc(u.name)}" required></label>
    ${u.role==='gmy'?`<label class="field"><span>Ünvan</span><input class="inp" id="pf-title" name="title" value="${esc(u.title)}" required></label>`:''}
    <div class="grid2"><label class="field"><span>E-posta</span><input class="inp" id="pf-mail" name="email" type="email" value="${esc(u.email)}"></label>
    <label class="field"><span>Telefon</span><input class="inp" id="pf-phone" name="phone" value="${esc(u.phone)}" placeholder="0 5xx xxx xx xx"></label></div>
    <button class="btn pri" type="submit">Kaydet</button></form>
  <div class="card stack"><b>Görünüm</b><div class="pills">${[['system','Sistem'],['light','Açık'],['dark','Koyu']].map(([k,l])=>`<button class="pill sm ${u.theme===k?'on':''}" data-act="theme" data-v="${k}">${ic(k==='light'?'sun':k==='dark'?'moon':'settings','sm')}${l}</button>`).join('')}</div></div>
  <div class="card"><b>Bildirimler</b><div style="margin-top:6px">${prefs.map(([k,l])=>`<label class="toggle"><span>${l}</span><input type="checkbox" id="pref-${k}" data-pref="${k}" ${u.prefs[k]!==false?'checked':''}></label>`).join('')}</div></div>
  <form class="card stack" data-form="password"><b>Şifre değiştir</b>
    <label class="field"><span>Mevcut şifre</span><input class="inp" id="pw-cur" name="cur" type="password" autocomplete="current-password" required></label>
    <div class="grid2"><label class="field"><span>Yeni şifre</span><input class="inp" id="pw-new" name="nw" type="password" minlength="8" autocomplete="new-password" required></label>
    <label class="field"><span>Yeni şifre (tekrar)</span><input class="inp" id="pw-new2" name="nw2" type="password" minlength="8" autocomplete="new-password" required></label></div>
    <div class="err" id="pw-err"></div><button class="btn" type="submit">Şifreyi güncelle</button></form>
  <button class="btn block danger" data-act="logout">${ic('logout')}Çıkış yap</button>
  <p class="faint small" style="text-align:center;margin:0">${esc(config.orgName)} Yönetim Portalı · Kullanıcı adı: ${esc(u.username)}</p>`;
}

function vNav(){
  const t=TAB_OF[state.view.name]||'home',n=unread();
  const tabs=[['home','home','Ana sayfa'],['projects','folder','Projeler'],['lobby','megaphone','Lobi'],['inbox','bell','Gelen'],['games','gamepad','Mola'],['settings','settings','Ayarlar']];
  return `<nav class="nav" aria-label="Ana menü"><div class="nav-in">${tabs.map(([k,i,l])=>`<button class="${t===k?'on':''}" data-act="tab" data-v="${k}" ${t===k?'aria-current="page"':''}>${ic(i)}<span>${l}</span>${k==='inbox'&&n?`<span class="badge">${n}</span>`:''}</button>`).join('')}</div></nav>`;
}

/* ---------- sheets ---------- */
const closeBtn=`<button class="iconbtn" data-act="closeSheet" aria-label="Kapat">${ic('x')}</button>`;
const SHEETS={
  meeting(){const m=db.meetings.find(x=>x.id===state.sheet.id);if(!m)return `<div class="sh-h"><h2>Toplantı bulunamadı</h2>${closeBtn}</div>`;const u=me(),org=byId(m.organizerId),inv=m.attendeeIds.includes(u.id),past=mEnd(m)<new Date();
    return `<div class="sh-h"><h2>${esc(m.title)}</h2>${closeBtn}</div>
    <div class="meta" style="font-size:15px"><span>${ic('calendar')}${esc(fD(m.at,{weekday:'long',day:'numeric',month:'long'}))}</span><span>${ic('clock')}${fT(m.at)} – ${fT(mEnd(m))}</span><span>${ic(m.mode==='online'?'video':'pinmap')}${esc(m.location||'—')}</span></div>
    ${m.agenda?`<div class="card" style="background:var(--surface-2)"><div class="small muted" style="font-weight:500;margin-bottom:4px">Gündem</div><div style="white-space:pre-wrap">${esc(m.agenda)}</div></div>`:''}
    <div><div class="small muted" style="font-weight:500;margin-bottom:4px">Katılımcılar</div>
    <div class="li">${av(org)}<div class="grow"><b>${esc(org.name)}</b><div class="small muted">${esc(org.title)}</div></div><span class="chip gray">Düzenleyen</span></div>
    ${m.attendeeIds.map(byId).filter(Boolean).map(a=>{const r=m.rsvp[a.id];return `<div class="li">${av(a)}<div class="grow"><b>${esc(a.name)}</b><div class="small muted">${esc(a.title)}</div></div>${r==='yes'?'<span class="chip good">Katılıyor</span>':r==='no'?'<span class="chip bad">Katılamıyor</span>':'<span class="chip warn">Yanıt yok</span>'}</div>`;}).join('')}</div>
    ${inv&&!past?`<div class="grid2"><button class="btn ${m.rsvp[u.id]==='yes'?'pri':''}" data-act="rsvp" data-id="${m.id}" data-v="yes">${ic('check')}Katılıyorum</button><button class="btn ${m.rsvp[u.id]==='no'?'pri':''}" data-act="rsvp" data-id="${m.id}" data-v="no">${ic('x')}Katılamıyorum</button></div>`:''}
    ${(m.organizerId===u.id||u.role==='gmy')&&!past?`<button class="btn danger block" data-act="cancelMeeting" data-id="${m.id}">${ic('trash')}Toplantıyı iptal et</button>`:''}`;},
  meetingForm(){const c=meetingCandidates(),pre=state.sheet.pre||[];const d=state.selDay&&pYmd(state.selDay)>=sod(new Date())?state.selDay:ymd(new Date());
    return `<div class="sh-h"><h2>Toplantı planla</h2>${closeBtn}</div>
    <form class="stack" data-form="meeting">
      <label class="field"><span>Başlık</span><input class="inp" id="mf-title" name="title" required maxlength="90" placeholder="Örn. Proje durum toplantısı"></label>
      <div class="grid2"><label class="field"><span>Tarih</span><input class="inp" id="mf-date" name="date" type="date" value="${d}" required></label><label class="field"><span>Saat</span><input class="inp" id="mf-time" name="time" type="time" value="10:00" required></label></div>
      <div class="grid2"><label class="field"><span>Süre</span><select class="inp" id="mf-dur" name="dur">${[15,30,45,60,90,120].map(x=>`<option value="${x}" ${x===60?'selected':''}>${x} dk</option>`).join('')}</select></label>
      <label class="field"><span>Biçim</span><select class="inp" id="mf-mode" name="mode"><option value="yuz">Yüz yüze</option><option value="online">Çevrim içi</option></select></label></div>
      <label class="field"><span>Yer veya bağlantı</span><input class="inp" id="mf-loc" name="location" placeholder="Toplantı odası 3 veya Teams"></label>
      <div class="field"><span>Katılımcılar</span><div class="checks">${c.map(x=>`<label class="check"><input type="checkbox" name="att" value="${x.id}" ${pre.includes(x.id)?'checked':''}>${av(x,26)}<span class="grow"><b>${esc(x.name)}</b> <span class="small muted">${esc(x.title)}</span></span></label>`).join('')}</div></div>
      <label class="field"><span>Gündem</span><textarea class="inp" id="mf-agenda" name="agenda" placeholder="Görüşülecek maddeler"></textarea></label>
      <div class="err" id="mf-err"></div>
      <button class="btn pri block" type="submit">Davet gönder</button></form>`;},
  projectForm(){const p=state.sheet.id?db.projects.find(x=>x.id===state.sheet.id):null;const c=ownerCandidates();
    return `<div class="sh-h"><h2>${p?'Projeyi düzenle':'Yeni proje ata'}</h2>${closeBtn}</div>
    <form class="stack" data-form="project" data-id="${p?p.id:''}">
      <label class="field"><span>Proje adı</span><input class="inp" id="pj-name" name="name" required maxlength="90" value="${esc(p?p.name:'')}"></label>
      <label class="field"><span>Açıklama</span><textarea class="inp" id="pj-desc" name="desc" maxlength="400">${esc(p?p.desc:'')}</textarea></label>
      <label class="field"><span>Proje sahibi</span><select class="inp" id="pj-owner" name="owner">${c.map(x=>`<option value="${x.id}" ${p&&p.ownerId===x.id?'selected':''}>${esc(x.name)} · ${esc(x.title)}</option>`).join('')}</select></label>
      <div class="grid2"><label class="field"><span>Başlangıç</span><input class="inp" id="pj-start" name="start" type="date" value="${p?p.start:ymd(new Date())}" required></label><label class="field"><span>Son tarih</span><input class="inp" id="pj-due" name="due" type="date" value="${p?p.due:ymd(addD(new Date(),60))}" required></label></div>
      <div class="err" id="pj-err"></div>
      <button class="btn pri block" type="submit">${p?'Kaydet':'Projeyi ata'}</button></form>`;},
  reportForm(){const p=db.projects.find(x=>x.id===state.sheet.id);
    return `<div class="sh-h"><h2>İlerleme raporu</h2>${closeBtn}</div><div class="muted" style="margin-top:-8px">${esc(p.name)}</div>
    <form class="stack" data-form="report" data-id="${p.id}">
      <div class="field"><span>Tamamlanma oranı</span><div class="row"><input type="range" id="rp-prog" name="progress" min="0" max="100" step="5" value="${p.progress}" data-live="rp-val"><b id="rp-val" class="num" style="min-width:52px;text-align:right;font-size:20px">${pct(p.progress)}</b></div><div class="small faint">Önceki rapor: ${pct(p.progress)}</div></div>
      <div class="field"><span>Durum</span><div class="radios">${Object.entries(HEALTH).map(([k,[l]])=>`<label><input type="radio" name="health" value="${k}" ${p.health===k?'checked':''}><span>${l}</span></label>`).join('')}</div></div>
      <label class="field"><span>Bu dönemde neler yapıldı, engeller neler?</span><textarea class="inp" id="rp-note" name="note" required maxlength="600" placeholder="Örn. Test ortamı kuruldu; veri erişimi için onay bekleniyor."></textarea></label>
      <label class="check" style="padding:0"><input type="checkbox" name="done" id="rp-done">Proje tamamlandı</label>
      <button class="btn pri block" type="submit">Raporu gönder</button></form>`;},
  annForm(){const u=me(),dirs=active().filter(x=>x.role==='director');
    return `<div class="sh-h"><h2>Lobi'de yayınla</h2>${closeBtn}</div>
    <form class="stack" data-form="ann">
      <div class="field"><span>Tür</span><div class="radios">${Object.entries(KIND).map(([k,l],i)=>`<label><input type="radio" name="kind" value="${k}" ${i===0?'checked':''}><span>${l}</span></label>`).join('')}</div></div>
      <label class="field"><span>Başlık</span><input class="inp" id="an-title" name="title" required maxlength="100"></label>
      <label class="field"><span>Metin</span><textarea class="inp" id="an-body" name="body" required maxlength="1000"></textarea></label>
      <label class="field"><span>Kimler görsün?</span><select class="inp" id="an-aud" name="audience">${u.role==='gmy'?`<option value="all">Tüm kurum</option>${dirs.map(d=>`<option value="${d.id}">${esc(d.name)} ekibi</option>`).join('')}`:`<option value="${u.id}">Ekibim</option>`}</select></label>
      <label class="check" style="padding:0"><input type="checkbox" name="pinned" id="an-pin">Lobi'nin en üstüne sabitle</label>
      <button class="btn pri block" type="submit">Yayınla</button></form>`;},
  ackList(){const a=db.announcements.find(x=>x.id===state.sheet.id);const aud=audienceIds(a).filter(x=>x!==a.by).map(byId);const yes=aud.filter(x=>a.acks.includes(x.id)),no=aud.filter(x=>!a.acks.includes(x.id));
    const row=x=>`<div class="li">${av(x)}<div class="grow"><b>${esc(x.name)}</b><div class="small muted">${esc(x.title)}</div></div></div>`;
    return `<div class="sh-h"><h2>Okuma durumu</h2>${closeBtn}</div><div class="muted" style="margin-top:-8px">${esc(a.title)}</div>
    <div><b>Okumayanlar · ${no.length}</b>${no.map(row).join('')||'<div class="muted small">Herkes okudu.</div>'}</div>
    ${no.length?`<button class="btn" data-act="remind" data-id="${a.id}">${ic('bell')}Okumayanlara hatırlat</button>`:''}
    <div><b>Okuyanlar · ${yes.length}</b>${yes.map(row).join('')||'<div class="muted small">Henüz kimse okumadı.</div>'}</div>`;},
  person(){const x=byId(state.sheet.id),u=me();if(!x)return '';const boss=byId(x.managerId);const ps=db.projects.filter(p=>p.ownerId===x.id&&scope(u).includes(p.ownerId));
    const ms=db.meetings.filter(m=>mEnd(m)>new Date()&&[m.organizerId,...m.attendeeIds].includes(x.id)&&(x.id===u.id||[m.organizerId,...m.attendeeIds].includes(u.id)||u.role==='gmy')).sort((a,b)=>new Date(a.at)-new Date(b.at)).slice(0,4);
    const canEdit=x.id!==u.id&&(u.role==='gmy'||isAbove(u,x));
    return `<div class="sh-h"><div class="row">${av(x,52)}<div><h2>${esc(x.name)}</h2><div class="muted">${esc(x.title)}</div></div></div>${closeBtn}</div>
    <div class="meta" style="font-size:14px"><span>${ic('org')}${ROLE[x.role]} · ${esc(x.dept)}</span>${boss?`<span>${ic('users')}Bağlı: ${esc(boss.name)}</span>`:''}<span>${ic('mail')}${esc(x.email)}</span>${x.phone?`<span>${esc(x.phone)}</span>`:''}</div>
    <div><b>Projeler · ${ps.length}</b>${ps.length?ps.map(p=>`<button class="li" data-act="openProject" data-id="${p.id}"><div class="grow"><div class="row between"><b class="ellip">${esc(p.name)}</b>${hChip(p)}</div><div class="row" style="margin-top:6px">${bar(p.progress,barCls(p),'thin')}<span class="small num" style="min-width:36px;text-align:right">${pct(p.progress)}</span></div></div></button>`).join(''):'<div class="muted small">Atanmış proje yok.</div>'}</div>
    <div><b>Yaklaşan toplantılar</b>${ms.length?ms.map(meetingRow).join(''):'<div class="muted small">Ortak yaklaşan toplantı yok.</div>'}</div>
    <div class="grid2">${x.id!==u.id?`<button class="btn pri" data-act="meetWith" data-id="${x.id}">${ic('calendar')}Toplantı planla</button>`:''}${isLead(u)&&scope(u).includes(x.id)?`<button class="btn" data-act="newProjectFor" data-id="${x.id}">${ic('plus')}Proje ata</button>`:''}</div>
    ${canEdit?`<div class="grid2"><button class="btn" data-act="editPerson" data-id="${x.id}">${ic('edit')}Düzenle</button><button class="btn" data-act="resetPw" data-id="${x.id}">${ic('key')}Şifre sıfırla</button></div><button class="btn danger block" data-act="removePerson" data-id="${x.id}">${ic('trash')}Portaldan kaldır</button>`:''}`;},
  personForm(){const x=state.sheet.id?byId(state.sheet.id):null,u=me();
    const roles=['director','manager','employee'].filter(r=>RANK[r]>RANK[u.role]);
    const role=x?x.role:roles[0];
    return `<div class="sh-h"><h2>${x?'Kişiyi düzenle':'Kişi ekle'}</h2>${closeBtn}</div>
    <form class="stack" data-form="person" data-id="${x?x.id:''}">
      <label class="field"><span>Ad soyad</span><input class="inp" id="ps-name" name="name" required value="${esc(x?x.name:'')}"></label>
      <label class="field"><span>Ünvan</span><input class="inp" id="ps-title" name="title" required value="${esc(x?x.title:'')}" placeholder="Örn. Veri Analisti"></label>
      ${x&&x.role==='gmy'?'':`<div class="field"><span>Rol</span><div class="radios">${roles.map(r=>`<label><input type="radio" name="role" value="${r}" ${role===r?'checked':''} data-role-radio><span>${ROLE[r]}</span></label>`).join('')}</div></div>
      <label class="field" id="ps-boss-wrap"><span>Bağlı olduğu kişi</span><select class="inp" id="ps-boss" name="boss">${bossOptions(role,x)}</select></label>`}
      <label class="field"><span>Birim</span><input class="inp" id="ps-dept" name="dept" value="${esc(x?x.dept:(u.role==='director'?u.dept:''))}" placeholder="Örn. İnsan Kaynakları"></label>
      <label class="field"><span>E-posta</span><input class="inp" id="ps-mail" name="email" type="email" value="${esc(x?x.email||'':'')}" placeholder="ad.soyad@sirket.com"></label>
      ${x?'':`<label class="field"><span>Kullanıcı adı</span><input class="inp" id="ps-user" name="username" required autocapitalize="none" pattern="[a-z0-9._\\-]+" title="Küçük harf, rakam, nokta, alt çizgi, tire" placeholder="ad.soyad"></label><div class="faint small">Geçici şifre otomatik oluşturulur ve kaydettikten sonra gösterilir. Kişi ilk girişte kendi şifresini belirler.</div>`}
      <div class="err" id="ps-err"></div>
      <button class="btn pri block" type="submit">${x?'Kaydet':'Ekle'}</button></form>`;},
  tempPw(){const t=state.sheet;return `<div class="sh-h"><h2>${esc(t.title)}</h2>${closeBtn}</div>
    <p class="muted" style="margin:0">${esc(t.name)} bu bilgilerle giriş yapabilir. Geçici şifre yalnızca bir kez gösterilir; ilk girişte değiştirilmesi istenir.</p>
    <div class="card stack" style="background:var(--surface-2)"><div class="row between"><span class="muted">Kullanıcı adı</span><b id="tp-user">${esc(t.username)}</b></div><div class="row between"><span class="muted">Geçici şifre</span><b class="num" id="tp-pass" style="font-family:ui-monospace,Menlo,Consolas,monospace;font-size:18px;user-select:all">${esc(t.password)}</b></div><div class="row between"><span class="muted">Adres</span><b class="ellip">${esc(location.origin)}</b></div></div>
    <button class="btn pri block" data-act="copyTemp">${ic('file')}Bilgileri kopyala</button>`;},
  confirm(){return `<div class="sh-h"><h2>${esc(state.sheet.title)}</h2>${closeBtn}</div><p class="muted" style="margin:0">${esc(state.sheet.text)}</p>
    <div class="grid2"><button class="btn" data-act="closeSheet">Vazgeç</button><button class="btn pri" data-act="confirmYes">${esc(state.sheet.yes||'Onayla')}</button></div>`;},
  game(){return gameView();}
};
// People the current user may place a person of `role` under (mirrors Org.validBosses on the server).
function bossOptions(role,x){const u=me(),sc=scope(u);const cur=x?x.managerId:u.id;
  return active().filter(b=>sc.includes(b.id)&&RANK[b.role]<RANK[role]&&(!x||(b.id!==x.id&&!isAbove(x,b)))).map(b=>`<option value="${b.id}" ${b.id===cur?'selected':''}>${esc(b.name)}${b.id===u.id?' (siz)':''} · ${ROLE[b.role]}</option>`).join('');}
function openSheet(type,extra){state.sheet=Object.assign({type,key:type+uid()},extra||{});renderSheet();setTimeout(()=>{const f=$('#sheet-root .sheet input.inp, #sheet-root .sheet textarea');if(f&&type!=='game'&&!f.value)f.focus({preventScroll:true});},60);}
function closeSheet(){stopTimer();state.sheet=null;state.game=null;render();}
function askConfirm(title,text,yes,fn){state.confirmFn=fn;openSheet('confirm',{title,text,yes});}
function renderSheet(){
  const root=$('#sheet-root');
  if(!state.sheet){root.innerHTML='';root.dataset.key='';document.body.classList.remove('locked');return;}
  const html=SHEETS[state.sheet.type]();const ex=root.querySelector('.sheet');
  if(ex&&root.dataset.key===state.sheet.key){const st=ex.scrollTop;ex.innerHTML=html;ex.scrollTop=st;}
  else{root.dataset.key=state.sheet.key;root.innerHTML=`<div class="sheet-back"><div class="sheet enter" role="dialog" aria-modal="true">${html}</div></div>`;}
  document.body.classList.add('locked');
}

/* ---------- games ---------- */
const LV={kolay:'Kolay',orta:'Orta',zor:'Zor'};
const WORDS={saglik:['STETOSKOP','AŞILAMA','BAĞIŞIKLIK','TANSİYON','HEMŞİRE','RÖNTGEN','POLİKLİNİK','ECZANE','FİZYOTERAPİ','REÇETE'],
  yonetim:['STRATEJİ','BÜTÇE','TOPLANTI','PERFORMANS','DELEGASYON','HEDEF KARTI','VERİMLİLİK','LİDERLİK','RAPORLAMA','PAYDAŞ'],
  teknoloji:['ALGORİTMA','VERİTABANI','SUNUCU','YAZILIM','ŞİFRELEME','BULUT BİLİŞİM','YAPAY ZEKA','ROBOTİK','ARAYÜZ','SİBER GÜVENLİK'],
  genel:['KÜTÜPHANE','GÖKKUŞAĞI','PUSULA','ÇAYDANLIK','ŞEMSİYE','BİSİKLET','ANADOLU','DENİZ FENERİ','SAAT KULESİ','TAKVİM']};
const CAT={saglik:'Sağlık',yonetim:'Yönetim',teknoloji:'Teknoloji',genel:'Genel'};
const ALPHA='ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ'.split('');
const MEM_ICONS=[['calendar','#1d4f86'],['bell','#b45309'],['folder','#0f7a8a'],['megaphone','#be185d'],['users','#7c3aed'],['clock','#047857'],['rocket','#c2410c'],['heart','#db2777'],['star','#ca8a04'],['coffee','#92400e'],['flag','#4338ca'],['key','#0e7490']];
function newGame(kind,keep){
  const prev=state.game||{};const level=keep&&prev.level||'orta';
  stopTimer();
  if(kind==='xox')state.game={kind,level,board:Array(9).fill(''),busy:false,over:null,line:null,pts:null};
  if(kind==='hangman'){const cat=keep&&prev.cat||'yonetim';const pool=WORDS[cat];let w;do{w=pool[Math.floor(Math.random()*pool.length)];}while(pool.length>1&&w===prev.word);
    state.game={kind,level,cat,word:w,guessed:[],wrong:0,max:{kolay:8,orta:6,zor:4}[level],over:null,pts:null};}
  if(kind==='memory'){const pairs={kolay:6,orta:8,zor:10}[level];const ics=MEM_ICONS.slice().sort(()=>Math.random()-.5).slice(0,pairs);const deck=[...ics,...ics].map((x,i)=>({k:x[0],c:x[1],id:i})).sort(()=>Math.random()-.5);
    state.game={kind,level,pairs,deck,up:[],done:[],moves:0,sec:0,started:false,paused:false,lock:false,over:null,pts:null};}
}
function stopTimer(){if(state.game&&state.game.timer){clearInterval(state.game.timer);state.game.timer=null;}}
function addScore(game,pts){const sc=Math.round(pts);db.scores.push({id:uid(),userId:me().id,game,score:sc,at:new Date().toISOString()});api('POST','/scores',{game,score:sc}).catch(e=>toast(e.message));}
function lvPills(){return `<div class="pills">${Object.entries(LV).map(([k,l])=>`<button class="pill sm ${state.game.level===k?'on':''}" data-act="gLevel" data-v="${k}">${l}</button>`).join('')}</div>`;}
function gameHead(t){return `<div class="sh-h"><h2>${t}</h2>${closeBtn}</div>`;}
const LINES=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
function xWin(b){for(const l of LINES){const [a,c,d]=l;if(b[a]&&b[a]===b[c]&&b[a]===b[d])return {w:b[a],l};}return b.every(x=>x)?{w:'draw'}:null;}
function minimax(b,isO){const r=xWin(b);if(r)return r.w==='O'?10:r.w==='X'?-10:0;let best=isO?-99:99;for(let i=0;i<9;i++)if(!b[i]){b[i]=isO?'O':'X';const s=minimax(b,!isO);b[i]='';best=isO?Math.max(best,s):Math.min(best,s);}return best;}
function aiMove(b,level){const free=b.map((v,i)=>v?null:i).filter(i=>i!==null);const rand=()=>free[Math.floor(Math.random()*free.length)];
  if(level==='kolay'&&Math.random()<.8)return rand();
  const find=s=>{for(const i of free){b[i]=s;const w=xWin(b);b[i]='';if(w&&w.w===s)return i;}return null;};
  if(level!=='zor'){const w=find('O');if(w!==null)return w;const bl=find('X');if(bl!==null)return bl;if(level==='orta'&&Math.random()<.6&&!b[4])return 4;return rand();}
  let best=-99,mv=free[0];for(const i of free){b[i]='O';const s=minimax(b,false);b[i]='';if(s>best){best=s;mv=i;}}return mv;}
function xoxEnd(){const g=state.game,r=xWin(g.board);if(!r)return false;g.over=r.w;g.line=r.l||null;
  g.pts=r.w==='X'?{kolay:40,orta:70,zor:100}[g.level]:r.w==='draw'?{kolay:15,orta:30,zor:60}[g.level]:0;addScore('xox',g.pts);return true;}
function gameView(){
  const g=state.game;
  if(g.kind==='xox'){
    const msg=g.over?(g.over==='X'?['good','Kazandınız',`+${g.pts} puan`]:g.over==='O'?['bad','Bilgisayar kazandı','0 puan']:['','Berabere',`+${g.pts} puan`]):null;
    return `${gameHead('XOX')}${lvPills()}
    <div class="muted" style="text-align:center">${g.over?'':g.busy?'Bilgisayar düşünüyor…':'Sıra sizde. Siz <b style="color:var(--accent)">X</b>, bilgisayar <b style="color:var(--bad)">O</b>.'}</div>
    <div class="xox">${g.board.map((v,i)=>`<button class="${v==='X'?'x':v==='O'?'o':''} ${g.line&&g.line.includes(i)?'win':''}" data-act="xox" data-i="${i}" aria-label="Kare ${i+1}${v?': '+v:''}" ${v||g.over||g.busy?'disabled':''}>${v}</button>`).join('')}</div>
    ${msg?`<div class="result ${msg[0]}"><b>${msg[1]}</b>${msg[2]} skor tablosuna eklendi</div>`:''}
    <button class="btn block" data-act="gNew">${ic('refresh')}Yeni oyun</button>
    <div class="small faint" style="text-align:center">Kazanma: Kolay 40 · Orta 70 · Zor 100 puan. Zor seviyede bilgisayar hiç hata yapmaz.</div>`;
  }
  if(g.kind==='hangman'){
    const parts=Math.ceil(g.wrong*6/g.max);const won=g.over==='win',lost=g.over==='lose';
    const fig=[`<circle cx="80" cy="35" r="10"/>`,`<line x1="80" y1="45" x2="80" y2="78"/>`,`<line x1="80" y1="55" x2="66" y2="68"/>`,`<line x1="80" y1="55" x2="94" y2="68"/>`,`<line x1="80" y1="78" x2="68" y2="98"/>`,`<line x1="80" y1="78" x2="92" y2="98"/>`].slice(0,parts).join('');
    return `${gameHead('Adam Asmaca')}
    <div class="pills">${Object.entries(CAT).map(([k,l])=>`<button class="pill sm ${g.cat===k?'on':''}" data-act="hmCat" data-v="${k}">${l}</button>`).join('')}</div>${lvPills()}
    <div class="row between"><span class="muted">Kategori: <b>${CAT[g.cat]}</b></span><span class="chip ${g.max-g.wrong<=2?'bad':'gray'} num">Kalan hak: ${g.max-g.wrong}</span></div>
    <svg viewBox="0 0 120 125" style="width:150px;height:auto;margin:0 auto;display:block" aria-hidden="true"><g style="stroke:var(--ink-2)" stroke-width="4" stroke-linecap="round" fill="none"><line x1="10" y1="118" x2="70" y2="118"/><line x1="30" y1="118" x2="30" y2="8"/><line x1="30" y1="8" x2="80" y2="8"/><line x1="80" y1="8" x2="80" y2="25"/></g><g style="stroke:var(--bad)" stroke-width="4" stroke-linecap="round" fill="none">${fig}</g></svg>
    <div class="word" aria-label="Kelime">${[...g.word].map(ch=>ch===' '?'<span class="sp"></span>':`<span class="${lost&&!g.guessed.includes(ch)?'miss':''}">${g.guessed.includes(ch)||lost?ch:''}</span>`).join('')}</div>
    ${g.over?`<div class="result ${won?'good':'bad'}"><b>${won?'Bildiniz':'Kelime: '+g.word}</b>${won?`+${g.pts} puan skor tablosuna eklendi`:'0 puan. Bir sonrakinde olur.'}</div><button class="btn pri block" data-act="gNew">${ic('refresh')}Yeni kelime</button>`
      :`<div class="keys">${ALPHA.map(l=>{const used=g.guessed.includes(l);const hit=used&&g.word.includes(l);return `<button class="${used?(hit?'hit':'miss'):''}" data-act="hm" data-l="${l}" ${used?'disabled':''}>${l}</button>`;}).join('')}</div><div class="small faint" style="text-align:center">Klavyeden de harf yazabilirsiniz.</div>`}`;
  }
  if(g.kind==='memory'){
    const cols=g.level==='zor'?5:4;const mm=String(Math.floor(g.sec/60)).padStart(2,'0')+':'+String(g.sec%60).padStart(2,'0');
    return `${gameHead('Hafıza Kartları')}${lvPills()}
    <div class="row between"><span class="chip gray num">Hamle: ${g.moves}</span><span class="chip gray num" id="mem-time">Süre: ${mm}</span><span class="chip gray num">Eş: ${g.done.length/2}/${g.pairs}</span>
    ${g.over?'':`<button class="btn sm" data-act="memPause" ${!g.started?'disabled':''}>${ic(g.paused?'play':'pause')}${g.paused?'Devam':'Duraklat'}</button>`}</div>
    <div class="mem" style="grid-template-columns:repeat(${cols},1fr)">${g.deck.map((c,i)=>{const up=g.up.includes(i),dn=g.done.includes(i);return `<button class="${dn?'done':up?'up':'back'}" style="--fc:${c.c}" data-act="mem" data-i="${i}" aria-label="${up||dn?c.k:'Kapalı kart'}" ${dn||g.paused||g.over?'disabled':''}>${up||dn?ic(c.k):ic('grid')}</button>`;}).join('')}
    ${g.paused?`<div class="pausebox"><div class="stack" style="align-items:center"><b style="font-size:20px">Duraklatıldı</b><span class="muted">Süre durdu. Hazır olduğunuzda devam edin.</span><button class="btn pri" data-act="memPause">${ic('play')}Devam et</button></div></div>`:''}</div>
    ${g.over?`<div class="result good"><b>Tüm eşleri buldunuz</b>${g.moves} hamle, ${mm} · +${g.pts} puan skor tablosuna eklendi</div>`:''}
    <button class="btn block" data-act="gNew">${ic('refresh')}Yeni oyun</button>`;
  }
  return '';
}
function hmGuess(l){const g=state.game;if(!g||g.kind!=='hangman'||g.over||g.guessed.includes(l))return;g.guessed.push(l);if(!g.word.includes(l))g.wrong++;
  const letters=[...new Set(g.word.replace(/ /g,''))];
  if(letters.every(x=>g.guessed.includes(x))){g.over='win';g.pts=Math.round((40+60*(1-g.wrong/g.max))*{kolay:.6,orta:.8,zor:1}[g.level]);addScore('hangman',g.pts);}
  else if(g.wrong>=g.max){g.over='lose';g.pts=0;addScore('hangman',0);}
  renderSheet();}
function memFlip(i){const g=state.game;if(g.lock||g.paused||g.over||g.up.includes(i)||g.done.includes(i))return;
  if(!g.started){g.started=true;g.timer=setInterval(()=>{if(!g.paused&&!g.over){g.sec++;const el=$('#mem-time');if(el)el.textContent='Süre: '+String(Math.floor(g.sec/60)).padStart(2,'0')+':'+String(g.sec%60).padStart(2,'0');}},1000);}
  g.up.push(i);
  if(g.up.length===2){g.moves++;const [a,b]=g.up;
    if(g.deck[a].k===g.deck[b].k){g.done.push(a,b);g.up=[];
      if(g.done.length===g.deck.length){g.over=true;stopTimer();const raw=100-(g.moves-g.pairs)*5-Math.floor(g.sec/4);g.pts=Math.round(Math.max(10,Math.min(100,raw))*{kolay:.6,orta:.8,zor:1}[g.level]);addScore('memory',g.pts);}}
    else{g.lock=true;setTimeout(()=>{g.up=[];g.lock=false;if(state.game===g)renderSheet();},750);}}
  renderSheet();}

/* ---------- actions ---------- */
const P_=id=>db.projects.find(x=>x.id===id);
const A={
  tab:el=>go(el.dataset.v),
  go:el=>go(el.dataset.v),
  demoLogin:el=>doLogin(el.dataset.u,'demo1234'),
  logout:async()=>{try{await api('POST','/auth/logout');}catch(e){}db={me:null,users:[],projects:[],meetings:[],announcements:[],notifications:[],scores:[]};state.view={name:'home'};saveView(state.view);state.projPerson='all';state.sheet=null;render();},
  projTab:el=>{state.projTab=el.dataset.v;render();},
  openProject:el=>{if(state.sheet){stopTimer();state.sheet=null;state.game=null;}go('project',{id:el.dataset.id});},
  openMeeting:el=>openSheet('meeting',{id:el.dataset.id}),
  openPerson:el=>openSheet('person',{id:el.dataset.id}),
  newMeeting:()=>openSheet('meetingForm',{pre:[]}),
  meetWith:el=>openSheet('meetingForm',{pre:[el.dataset.id]}),
  newProject:()=>openSheet('projectForm'),
  newProjectFor:el=>{openSheet('projectForm');const s=$('#pj-owner');if(s)s.value=el.dataset.id;},
  editProject:el=>openSheet('projectForm',{id:el.dataset.id}),
  report:el=>openSheet('reportForm',{id:el.dataset.id}),
  quickReport:()=>{const mine=visProjects().filter(p=>p.status==='active'&&p.ownerId===me().id).sort((a,b)=>staleDays(b)-staleDays(a));if(!mine.length){toast('Size atanmış aktif proje yok');return;}openSheet('reportForm',{id:mine[0].id});},
  completeProject:el=>{const p=P_(el.dataset.id);askConfirm('Projeyi tamamla',`“${p.name}” tamamlandı olarak işaretlenecek ve ilerleme %100 olacak.`,'Tamamlandı',()=>act(()=>api('POST',`/projects/${p.id}/complete`),'Proje tamamlandı'));},
  reopenProject:el=>act(()=>api('POST',`/projects/${el.dataset.id}/reopen`),'Proje yeniden açıldı'),
  deleteProject:el=>{const p=P_(el.dataset.id);askConfirm('Projeyi sil',`“${p.name}” ve tüm raporları kalıcı olarak silinecek.`,'Sil',async()=>{const ok=await act(()=>api('DELETE',`/projects/${p.id}`),'Proje silindi');if(ok)go('projects');});},
  rsvp:el=>act(()=>api('POST',`/meetings/${el.dataset.id}/rsvp`,{status:el.dataset.v}),el.dataset.v==='yes'?'Katılımınız iletildi':'Katılamayacağınız iletildi'),
  cancelMeeting:el=>{const m=db.meetings.find(x=>x.id===el.dataset.id);askConfirm('Toplantıyı iptal et',`“${m.title}” iptal edilecek ve katılımcılara bildirim gidecek.`,'İptal et',()=>act(()=>api('DELETE',`/meetings/${m.id}`),'Toplantı iptal edildi'));},
  week:el=>{state.weekOff+=Number(el.dataset.v);const ws=addD(sow(new Date()),state.weekOff*7);state.selDay=state.weekOff===0?ymd(new Date()):ymd(ws);render();},
  selDay:el=>{state.selDay=el.dataset.v;render();},
  mtgScope:el=>{state.mtgScope=el.dataset.v;render();},
  lobbyKind:el=>{state.lobbyKind=el.dataset.v;render();},
  ack:el=>act(()=>api('POST',`/announcements/${el.dataset.id}/ack`),'Okundu olarak işaretlendi'),
  ackList:el=>openSheet('ackList',{id:el.dataset.id}),
  remind:el=>{state.sheet=null;act(()=>api('POST',`/announcements/${el.dataset.id}/remind`),r=>`${r.sent} kişiye hatırlatma gönderildi`);},
  newAnn:()=>openSheet('annForm'),
  deleteAnn:el=>{const a=db.announcements.find(x=>x.id===el.dataset.id);askConfirm('Yayını kaldır',`“${a.title}” Lobi'den kaldırılacak.`,'Kaldır',()=>act(()=>api('DELETE',`/announcements/${a.id}`),'Kaldırıldı'));},
  inboxTab:el=>{state.inboxTab=el.dataset.v;render();},
  readAll:()=>act(()=>api('POST','/notifications/read-all'),'Tümü okundu'),
  openNote:el=>{const n=db.notifications.find(x=>x.id===el.dataset.id);if(!n)return;if(!n.read){n.read=true;api('POST',`/notifications/${n.id}/read`).catch(()=>{});}const l=n.link||{};
    if(l.view==='project'){if(P_(l.id))go('project',{id:l.id});else{render();toast('Bu proje artık görünmüyor');}}
    else if(l.view==='meeting'){if(db.meetings.some(m=>m.id===l.id)){render();openSheet('meeting',{id:l.id});}else{render();toast('Bu toplantı artık yok');}}
    else if(l.view)go(l.view);else render();},
  lbPeriod:el=>{state.lbPeriod=el.dataset.v;render();},
  lbGame:el=>{state.lbGame=el.dataset.v;render();},
  openGame:el=>{state.game=null;newGame(el.dataset.v);openSheet('game');},
  gLevel:el=>{state.game.level=el.dataset.v;newGame(state.game.kind,true);renderSheet();},
  gNew:()=>{newGame(state.game.kind,true);renderSheet();},
  hmCat:el=>{state.game.cat=el.dataset.v;newGame('hangman',true);renderSheet();},
  hm:el=>hmGuess(el.dataset.l),
  xox:el=>{const g=state.game,i=+el.dataset.i;if(g.board[i]||g.over||g.busy)return;g.board[i]='X';if(xoxEnd()){renderSheet();return;}g.busy=true;renderSheet();
    setTimeout(()=>{if(state.game!==g)return;g.board[aiMove(g.board,g.level)]='O';g.busy=false;xoxEnd();renderSheet();},420);},
  mem:el=>memFlip(+el.dataset.i),
  memPause:()=>{const g=state.game;g.paused=!g.paused;renderSheet();},
  theme:el=>{me().theme=el.dataset.v;render();api('PATCH','/me',{theme:el.dataset.v}).catch(e=>toast(e.message));},
  newPerson:()=>openSheet('personForm'),
  editPerson:el=>openSheet('personForm',{id:el.dataset.id}),
  resetPw:el=>{const x=byId(el.dataset.id);askConfirm('Şifre sıfırla',`${x.name} için yeni bir geçici şifre oluşturulacak. Açık oturumları kapanacak ve ilk girişte şifresini değiştirmesi istenecek.`,'Sıfırla',async()=>{
    try{const r=await api('POST',`/users/${x.id}/reset-password`);openSheet('tempPw',{title:'Geçici şifre',name:x.name,username:r.username,password:r.tempPassword});}catch(e){toast(e.message);render();}});},
  copyTemp:()=>{const t=state.sheet;const txt=`Portal: ${location.origin}\nKullanıcı adı: ${t.username}\nGeçici şifre: ${t.password}`;
    const sel=()=>{const el=$('#tp-pass');if(el){const r=document.createRange();r.selectNodeContents(el);const s=getSelection();s.removeAllRanges();s.addRange(r);}toast('Kopyalanamadı; şifre seçildi, elle kopyalayın');};
    try{navigator.clipboard.writeText(txt).then(()=>toast('Kopyalandı'),sel);}catch(e){sel();}},
  removePerson:el=>{const x=byId(el.dataset.id);if(subs(x).length){toast('Önce bu kişiye bağlı müdürleri başka bir direktöre taşıyın');return;}
    const heir=byId(x.managerId)||me();
    askConfirm('Kişiyi kaldır',`${x.name} portala giriş yapamayacak. Projeleri ${heir.name} kişisine devredilecek; geçmiş raporları ve yorumları korunur.`,'Kaldır',()=>act(()=>api('POST',`/users/${x.id}/deactivate`),`${x.name} kaldırıldı`));},
  closeSheet:()=>closeSheet(),
  confirmYes:()=>{const f=state.confirmFn;state.confirmFn=null;state.sheet=null;renderSheet();if(f)f();else render();},
};

/* ---------- forms ---------- */
async function doLogin(username,password){
  try{const r=await api('POST','/auth/login',{username,password});db.me=r.user;
    if(r.user.mustChangePassword){render();return;}
    await refresh();state.view={name:'home'};saveView(state.view);render();toast(`Hoş geldiniz, ${first(r.user.name)}`);startPolling();}
  catch(e){$('#app').innerHTML=vLogin(e.message,username);}
}
const val=(d,k)=>String(d.get(k)||'').trim();
const F={
  login:(f,d)=>doLogin(val(d,'username'),String(d.get('password')||'')),
  async firstPassword(f,d){
    if(d.get('nw')!==d.get('nw2')){$('#app').innerHTML=vPassword('Yeni şifreler eşleşmiyor.');return;}
    try{await api('POST','/me/password',{current:String(d.get('cur')),next:String(d.get('nw'))});db.me.mustChangePassword=false;await refresh();render();toast('Şifreniz kaydedildi');startPolling();}
    catch(e){$('#app').innerHTML=vPassword(e.message);}
  },
  async meeting(f,d){const att=d.getAll('att');if(!att.length){$('#mf-err').textContent='En az bir katılımcı seçin.';return;}
    const [h,mi]=val(d,'time').split(':').map(Number);const dt=pYmd(val(d,'date'));dt.setHours(h,mi,0,0);
    const body={title:val(d,'title'),at:dt.toISOString(),dur:+d.get('dur'),mode:d.get('mode'),location:val(d,'location'),agenda:val(d,'agenda'),attendeeIds:att};
    try{const r=await api('POST','/meetings',body);state.sheet=null;await refresh();
      state.selDay=ymd(dt);state.weekOff=Math.round((sow(dt)-sow(new Date()))/(7*DAY));
      if(state.view.name!=='meetings')go('meetings');else render();
      const clash=(r.conflicts||[]).map(id=>(byId(id)||{}).name).filter(Boolean);
      toast(clash.length?`Davet gönderildi. Not: ${clash.join(', ')} aynı saatte başka bir toplantıda`:'Davet gönderildi');}
    catch(e){$('#mf-err').textContent=e.message;}},
  async project(f,d){const id=f.dataset.id;const body={name:val(d,'name'),desc:val(d,'desc'),ownerId:d.get('owner'),start:val(d,'start'),due:val(d,'due')};
    if(body.due<body.start){$('#pj-err').textContent='Son tarih başlangıçtan önce olamaz.';return;}
    try{if(id){await api('PATCH',`/projects/${id}`,body);state.sheet=null;await refresh();render();toast('Proje güncellendi');}
      else{const r=await api('POST','/projects',body);state.sheet=null;await refresh();go('project',{id:r.id});toast('Proje atandı');}}
    catch(e){$('#pj-err').textContent=e.message;}},
  async report(f,d){const id=f.dataset.id;const body={progress:+d.get('progress'),health:String(d.get('health')||'iyi'),note:val(d,'note'),done:!!d.get('done')};
    try{await api('POST',`/projects/${id}/reports`,body);state.sheet=null;await refresh();if(state.view.name==='project')render();else go('project',{id});toast(body.done?'Rapor gönderildi, proje tamamlandı':'Rapor gönderildi');}
    catch(e){toast(e.message);}},
  comment:(f,d)=>act(()=>api('POST',`/projects/${f.dataset.id}/comments`,{text:val(d,'text')}),'Yorum eklendi'),
  async ann(f,d){const body={kind:d.get('kind'),title:val(d,'title'),body:val(d,'body'),audience:d.get('audience'),pinned:!!d.get('pinned')};
    try{await api('POST','/announcements',body);state.sheet=null;state.lobbyKind='all';await refresh();render();toast('Lobi\'de yayınlandı');}catch(e){toast(e.message);}},
  async person(f,d){const id=f.dataset.id;const body={name:val(d,'name'),title:val(d,'title'),dept:val(d,'dept'),email:val(d,'email'),role:d.get('role'),managerId:d.get('role')?d.get('boss'):undefined};
    const err=$('#ps-err');
    try{if(id){await api('PATCH',`/users/${id}`,body);state.sheet=null;await refresh();render();toast('Kaydedildi');}
      else{body.username=val(d,'username').toLowerCase();const r=await api('POST','/users',body);await refresh();if(state.view.name!=='team')go('team');else render();
        openSheet('tempPw',{title:'Kişi eklendi',name:body.name,username:r.username,password:r.tempPassword});}}
    catch(e){err.textContent=e.message;}},
  profile:(f,d)=>act(()=>api('PATCH','/me',{name:val(d,'name'),email:val(d,'email'),phone:val(d,'phone'),title:d.get('title')!==null?val(d,'title'):undefined}),'Profil kaydedildi'),
  async password(f,d){const e=$('#pw-err');if(d.get('nw')!==d.get('nw2')){e.textContent='Yeni şifreler eşleşmiyor.';return;}
    try{await api('POST','/me/password',{current:String(d.get('cur')),next:String(d.get('nw'))});f.reset();e.textContent='';toast('Şifre güncellendi. Diğer cihazlardaki oturumlar kapatıldı.');}
    catch(err){e.textContent=err.message;}},
};

/* ---------- render & events ---------- */
function render(){
  applyTheme();
  const app=$('#app');
  if(!booted){app.innerHTML='<div class="login"><div class="brand">'+LOGO+'</div></div>';return;}
  if(!me()){app.innerHTML=vLogin();renderSheet();return;}
  if(me().mustChangePassword){app.innerHTML=vPassword();return;}
  const V={home:vHome,projects:vProjects,project:vProject,lobby:vLobby,inbox:vInbox,games:vGames,settings:vSettings,meetings:vMeetings,team:vTeam,weekly:vWeekly};
  const fn=V[state.view.name]||vHome;
  app.innerHTML=`<main class="wrap">${fn()}</main>${vNav()}`;
  renderSheet();
}
// Picks up new notifications and colleagues' changes while the portal stays open.
let pollTimer=null;
function startPolling(){if(pollTimer)return;pollTimer=setInterval(async()=>{
  if(document.hidden||!me()||me().mustChangePassword)return;
  const typing=document.activeElement&&/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName);
  if(state.sheet||typing)return;
  const before=unread();
  try{await refresh();}catch(e){return;}
  render();if(unread()>before)toast('Yeni bildiriminiz var');
},60000);}
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&me()&&!state.sheet)refresh().then(render).catch(()=>{});});
document.addEventListener('click',e=>{
  if(e.target.classList&&e.target.classList.contains('sheet-back')){closeSheet();return;}
  const el=e.target.closest('[data-act]');if(!el||el.disabled)return;
  const fn=A[el.dataset.act];if(fn){e.preventDefault();fn(el,e);}
});
document.addEventListener('submit',async e=>{const f=e.target;if(!f.dataset||!f.dataset.form)return;e.preventDefault();
  const btn=f.querySelector('[type=submit]');if(btn){if(btn.disabled)return;btn.disabled=true;}
  try{await F[f.dataset.form](f,new FormData(f));}finally{if(btn&&btn.isConnected)btn.disabled=false;}});
document.addEventListener('input',e=>{const t=e.target;
  if(t.dataset.live){const o=document.getElementById(t.dataset.live);if(o)o.textContent='%'+t.value;}
});
document.addEventListener('change',e=>{const t=e.target;
  if(t.dataset.change==='projPerson'){state.projPerson=t.value;render();}
  if(t.dataset.pref){const k=t.dataset.pref,on=t.checked;me().prefs[k]=on;api('PATCH','/me',{prefs:{[k]:on}}).then(()=>toast(on?'Bildirim açıldı':'Bildirim kapatıldı'),err=>{toast(err.message);t.checked=!on;me().prefs[k]=!on;});}
  if(t.hasAttribute('data-role-radio')){const sel=$('#ps-boss');if(sel){const prev=sel.value;const x=state.sheet&&state.sheet.id?byId(state.sheet.id):null;sel.innerHTML=bossOptions(t.value,x);if([...sel.options].some(o=>o.value===prev))sel.value=prev;}}
});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&state.sheet){closeSheet();return;}
  if(state.sheet&&state.sheet.type==='game'&&state.game&&state.game.kind==='hangman'&&!e.metaKey&&!e.ctrlKey&&e.key.length===1){const l=e.key==='i'?'İ':e.key==='ı'?'I':trUp(e.key);if(ALPHA.includes(l)){e.preventDefault();hmGuess(l);}}
});
(async()=>{
  render();
  try{config=await api('GET','/config');}catch(e){}
  try{const r=await api('GET','/me');db.me=r.user;if(!r.user.mustChangePassword){await refresh();startPolling();}}catch(e){db.me=null;}
  booted=true;render();
})();
})();
