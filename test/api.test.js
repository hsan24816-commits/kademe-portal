'use strict';
// API and permission tests. Needs a throwaway PostgreSQL database:
//   TEST_DATABASE_URL=postgresql://user@localhost:5432/kademe_test npm test
// The database is wiped and reloaded with the demo organisation before each test file run.
const test = require('node:test');
const assert = require('node:assert/strict');

process.env.LOGIN_MAX_FAILS = '5';
const url = process.env.TEST_DATABASE_URL;
if (!url) {
  test('api tests', { skip: 'TEST_DATABASE_URL is not set' }, () => {});
  return;
}

const { createPool } = require('../src/db');
const { createApp } = require('../src/app');
const { seedDemo } = require('../scripts/seed-demo');

let pool, server, base;
const PW = 'demo1234';

test.before(async () => {
  pool = createPool(url);
  await seedDemo(pool, { reset: true, password: PW });
  server = createApp(pool).listen(0);
  await new Promise((r) => server.once('listening', r));
  base = `http://127.0.0.1:${server.address().port}/api`;
});
test.after(async () => { server.close(); await pool.end(); });

// A tiny cookie-keeping client per person.
function client() {
  let cookie = '';
  const call = async (method, path, body, headers = {}) => {
    const res = await fetch(base + path, {
      method,
      headers: { 'Content-Type': 'application/json', 'X-Kademe': '1', ...(cookie ? { Cookie: cookie } : {}), ...headers },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const set = res.headers.get('set-cookie');
    if (set) cookie = set.split(';')[0];
    let data = null;
    try { data = await res.json(); } catch {}
    return { status: res.status, data };
  };
  return {
    call,
    get: (p) => call('GET', p),
    post: (p, b) => call('POST', p, b ?? {}),
    patch: (p, b) => call('PATCH', p, b),
    del: (p) => call('DELETE', p),
    async login(username, password = PW) {
      const r = await call('POST', '/auth/login', { username, password });
      assert.equal(r.status, 200, `login ${username}: ${JSON.stringify(r.data)}`);
      return r.data.user;
    },
  };
}
async function as(username) { const c = client(); c.user = await c.login(username); c.boot = (await c.get('/bootstrap')).data; return c; }
const uid = (boot, username) => boot.users.find((u) => u.username === username)?.id;
const proj = (boot, name) => boot.projects.find((p) => p.name === name);

test('login rejects a wrong password and unknown users the same way', async () => {
  const c = client();
  const a = await c.post('/auth/login', { username: 'halit', password: 'nope' });
  const b = await c.post('/auth/login', { username: 'nobody', password: 'nope' });
  assert.equal(a.status, 401);
  assert.equal(b.status, 401);
  assert.equal(a.data.error, b.data.error);
});

test('every API call needs a session', async () => {
  const c = client();
  assert.equal((await c.get('/bootstrap')).status, 401);
  assert.equal((await c.post('/projects', {})).status, 401);
});

test('state-changing requests without the custom header are refused (CSRF guard)', async () => {
  const c = client();
  await c.login('halit');
  const r = await c.call('POST', '/notifications/read-all', {}, { 'X-Kademe': '' });
  assert.equal(r.status, 403);
});

test('visibility follows the hierarchy', async () => {
  const halit = await as('halit');
  const ayse = await as('ayse');
  const emre = await as('emre');
  assert.equal(halit.boot.projects.length, 16);
  assert.deepEqual(new Set(ayse.boot.projects.map((p) => p.ownerId)), new Set([uid(ayse.boot, 'ayse'), uid(ayse.boot, 'emre'), uid(ayse.boot, 'zeynep'), uid(ayse.boot, 'ali'), uid(ayse.boot, 'ece')]));
  assert.ok(emre.boot.projects.every((p) => p.ownerId === emre.user.id));
  assert.equal(emre.boot.projects.length, 2);
  // Directors do not see another director's meetings that involve nobody from their team
  assert.ok(!ayse.boot.meetings.some((m) => m.title === 'Rota optimizasyonu birebir'));
  assert.ok(halit.boot.meetings.some((m) => m.title === 'Rota optimizasyonu birebir'));
  // Team announcements stay inside the team (plus the deputy GM)
  assert.ok(!ayse.boot.announcements.some((a) => a.title.startsWith('Saha ziyaretlerinde')));
  assert.ok(halit.boot.announcements.some((a) => a.title.startsWith('Saha ziyaretlerinde')));
  // Contact details only for people you work with
  const can = ayse.boot.users.find((u) => u.name === 'Can Öztürk');
  assert.equal(can.email, undefined);
  assert.ok(ayse.boot.users.find((u) => u.name === 'Emre Yıldız').email);
});

test('managers cannot see or touch projects outside their scope', async () => {
  const halit = await as('halit');
  const emre = await as('emre');
  const other = proj(halit.boot, 'Depo otomasyonu');
  assert.equal((await emre.post(`/projects/${other.id}/reports`, { progress: 90, health: 'iyi', note: 'x' })).status, 404);
  assert.equal((await emre.post(`/projects/${other.id}/comments`, { text: 'x' })).status, 404);
  assert.equal((await emre.del(`/projects/${other.id}`)).status, 404);
  // managers may create projects, but only for themselves and their own workers
  assert.equal((await emre.post('/projects', { name: 'Yeni', ownerId: uid(halit.boot, 'can'), start: '2026-01-01', due: '2026-02-01' })).status, 400);
});

test('a director assigns projects only inside their own team', async () => {
  const ayse = await as('ayse');
  const halit = await as('halit');
  const ok = await ayse.post('/projects', { name: 'BT test projesi', desc: '', ownerId: uid(ayse.boot, 'emre'), start: '2026-10-01', due: '2026-12-01' });
  assert.equal(ok.status, 201);
  const bad = await ayse.post('/projects', { name: 'Yanlış ekip', desc: '', ownerId: uid(halit.boot, 'can'), start: '2026-10-01', due: '2026-12-01' });
  assert.equal(bad.status, 400);
  const backwards = await ayse.post('/projects', { name: 'Ters tarih', desc: '', ownerId: uid(ayse.boot, 'emre'), start: '2026-12-01', due: '2026-10-01' });
  assert.equal(backwards.status, 400);
});

test('progress reports update the bar and notify the chain above', async () => {
  const emre = await as('emre');
  const p = proj(emre.boot, 'Mobil uygulama yenileme');
  const r = await emre.post(`/projects/${p.id}/reports`, { progress: 70, health: 'risk', note: 'Beta gecikti' });
  assert.equal(r.status, 201);
  const ayse = await as('ayse');
  const after = proj(ayse.boot, 'Mobil uygulama yenileme');
  assert.equal(after.progress, 70);
  assert.equal(after.health, 'risk');
  assert.ok(ayse.boot.notifications.some((n) => n.kind === 'report' && n.text.includes('%70')));
  const halit = await as('halit');
  assert.ok(halit.boot.notifications.some((n) => n.kind === 'report' && n.text.includes('%70')));
  // Out-of-range values are refused
  assert.equal((await emre.post(`/projects/${p.id}/reports`, { progress: 140, health: 'iyi', note: 'x' })).status, 400);
});

test('meeting invitations are limited to people you work with', async () => {
  const emre = await as('emre');
  const halit = await as('halit');
  const tomorrow = new Date(Date.now() + 86400e3).toISOString();
  const bad = await emre.post('/meetings', { title: 'Dış ekip', at: tomorrow, dur: 30, mode: 'online', attendeeIds: [uid(halit.boot, 'can')] });
  assert.equal(bad.status, 400);
  const ok = await emre.post('/meetings', { title: 'Yöneticimle birebir', at: tomorrow, dur: 30, mode: 'online', attendeeIds: [uid(emre.boot, 'ayse')] });
  assert.equal(ok.status, 201);
  // only invitees can RSVP, only the organiser (or deputy GM) can cancel
  const zeynep = await as('zeynep');
  assert.equal((await zeynep.post(`/meetings/${ok.data.id}/rsvp`, { status: 'yes' })).status, 404);
  const ayse = await as('ayse');
  assert.equal((await ayse.post(`/meetings/${ok.data.id}/rsvp`, { status: 'yes' })).status, 200);
  assert.equal((await ayse.del(`/meetings/${ok.data.id}`)).status, 403);
  assert.equal((await emre.del(`/meetings/${ok.data.id}`)).status, 200);
});

test('lobby: workers cannot post, read lists are private to the author', async () => {
  const ali = await as('ali');
  assert.equal((await ali.post('/announcements', { kind: 'duyuru', title: 'Selam', body: 'Merhaba herkese' })).status, 403);
  const emre = await as('emre');
  const a = emre.boot.announcements.find((x) => x.title.startsWith('İlerleme raporları'));
  assert.ok(a.acks.every((id) => id === emre.user.id), 'a manager sees only their own read mark');
  const halit = await as('halit');
  assert.ok(halit.boot.announcements.find((x) => x.id === a.id).acks.length >= 5);
  // a director's post always goes to their own team, whatever audience is sent
  const murat = await as('murat');
  const r = await murat.post('/announcements', { kind: 'hatirlatma', title: 'Operasyon notu', body: 'Sadece operasyon', audience: 'all' });
  assert.equal(r.status, 201);
  const ayse = await as('ayse');
  assert.ok(!ayse.boot.announcements.some((x) => x.id === r.data.id));
  const can = await as('can');
  assert.ok(can.boot.announcements.some((x) => x.id === r.data.id));
});

test('new people get a temporary password and must change it first', async () => {
  const elif = await as('elif');
  const r = await elif.post('/users', { name: 'Yeni Müdür', title: 'Muhasebe Müdürü', username: 'yeni.mudur', email: '', dept: '' });
  assert.equal(r.status, 201);
  const fresh = client();
  const u = await fresh.login('yeni.mudur', r.data.tempPassword);
  assert.equal(u.mustChangePassword, true);
  assert.equal(u.role, 'manager');
  assert.equal(u.managerId, elif.user.id);
  assert.equal((await fresh.get('/bootstrap')).status, 403);
  assert.equal((await fresh.post('/me/password', { current: r.data.tempPassword, next: 'kisa' })).status, 400);
  assert.equal((await fresh.post('/me/password', { current: r.data.tempPassword, next: 'GüçlüŞifre2026' })).status, 200);
  assert.equal((await fresh.get('/bootstrap')).status, 200);
  // the director now sees the new manager in scope
  const again = await as('elif');
  assert.ok(again.boot.users.some((x) => x.username === 'yeni.mudur'));
});

test('directors manage only their own managers', async () => {
  const ayse = await as('ayse');
  const halit = await as('halit');
  const can = uid(halit.boot, 'can');
  assert.equal((await ayse.post(`/users/${can}/reset-password`)).status, 404);
  assert.equal((await ayse.post(`/users/${can}/deactivate`)).status, 404);
  assert.equal((await ayse.patch(`/users/${uid(halit.boot, 'murat')}`, { name: 'X Y', title: 'Z Z' })).status, 404);
  const emre = uid(ayse.boot, 'emre');
  const rp = await ayse.post(`/users/${emre}/reset-password`);
  assert.equal(rp.status, 200);
  const c = client();
  const u = await c.login('emre', rp.data.tempPassword);
  assert.equal(u.mustChangePassword, true);
});

test('deactivating someone blocks login and hands their projects up', async () => {
  const halit = await as('halit');
  const deniz = uid(halit.boot, 'deniz');
  const elif = uid(halit.boot, 'elif');
  // directors with people under them cannot be removed
  assert.equal((await halit.post(`/users/${elif}/deactivate`)).status, 400);
  assert.equal((await halit.post(`/users/${deniz}/deactivate`)).status, 200);
  const c = client();
  assert.equal((await c.post('/auth/login', { username: 'deniz', password: PW })).status, 401);
  const after = await as('halit');
  assert.ok(after.boot.projects.filter((p) => p.name === 'Tedarikçi portalı').every((p) => p.ownerId === elif));
});

test('the deputy GM can move a manager to another director', async () => {
  const halit = await as('halit');
  const selin = halit.boot.users.find((u) => u.username === 'selin');
  const r = await halit.patch(`/users/${selin.id}`, { name: selin.name, title: selin.title, dept: 'Bilgi Teknolojileri', email: selin.email, role: 'manager', managerId: uid(halit.boot, 'ayse') });
  assert.equal(r.status, 200);
  const ayse = await as('ayse');
  assert.ok(ayse.boot.projects.some((p) => p.name === 'ISO 9001 yeniden belgelendirme'));
  const murat = await as('murat');
  assert.ok(!murat.boot.projects.some((p) => p.name === 'ISO 9001 yeniden belgelendirme'));
});

test('workers see only their own work and cannot manage anyone', async () => {
  const ali = await as('ali');
  assert.equal(ali.user.role, 'employee');
  assert.ok(ali.boot.projects.length > 0 && ali.boot.projects.every((p) => p.ownerId === ali.user.id));
  assert.equal((await ali.post('/users', { name: 'X Y', title: 'Z Z', username: 'x.y', role: 'employee' })).status, 403);
  assert.equal((await ali.post('/projects', { name: 'Yeni iş', desc: '', ownerId: ali.user.id, start: '2026-10-01', due: '2026-11-01' })).status, 403);
  const ece = uid(ali.boot, 'ece');
  assert.equal((await ali.post(`/users/${ece}/reset-password`)).status, 404);
  const p = ali.boot.projects[0];
  assert.equal((await ali.post(`/projects/${p.id}/reports`, { progress: 50, health: 'iyi', note: 'Yarıya geldik' })).status, 201);
  // the manager above sees the report
  const zeynep = await as('zeynep');
  assert.equal(proj(zeynep.boot, p.name).progress, 50);
});

test('managers add workers and assign them projects; the top account can add workers under itself', async () => {
  const zeynep = await as('zeynep');
  assert.equal((await zeynep.post('/users', { name: 'Yeni Müdür', title: 'Müdür', username: 'zz.mudur', role: 'manager' })).status, 403);
  const r = await zeynep.post('/users', { name: 'Yeni Analist', title: 'Veri Analisti', username: 'yeni.analist', email: '', dept: '', role: 'employee' });
  assert.equal(r.status, 201);
  const w = (await as('zeynep')).boot.users.find((x) => x.username === 'yeni.analist');
  assert.equal(w.role, 'employee');
  assert.equal(w.managerId, zeynep.user.id);
  const pr = await zeynep.post('/projects', { name: 'Analist görevi', desc: '', ownerId: w.id, start: '2026-10-01', due: '2026-11-01' });
  assert.equal(pr.status, 201);
  // a manager cannot place a worker under someone outside their team
  const halit = await as('halit');
  assert.equal((await zeynep.post('/users', { name: 'Başka', title: 'Analist', username: 'baska.biri', role: 'employee', managerId: uid(halit.boot, 'emre') })).status, 400);
  const h = await halit.post('/users', { name: 'Doğrudan Çalışan', title: 'Veri Analisti', username: 'dogrudan', role: 'employee', managerId: halit.user.id });
  assert.equal(h.status, 201);
  const again = await as('halit');
  assert.equal(again.boot.users.find((x) => x.username === 'dogrudan').managerId, halit.user.id);
  // a worker cannot be given a manager-level person below them
  assert.equal((await halit.post('/users', { name: 'Ters', title: 'Müdür', username: 'ters', role: 'manager', managerId: uid(again.boot, 'dogrudan') })).status, 400);
});

test('only the top account edits its own title', async () => {
  const halit = await as('halit');
  const r = await halit.patch('/me', { title: 'Veri Analitiği Müdürü' });
  assert.equal(r.status, 200);
  assert.equal(r.data.user.title, 'Veri Analitiği Müdürü');
  const selin = await as('selin');
  const before = selin.user.title;
  assert.equal((await selin.patch('/me', { title: 'Genel Müdür' })).data.user.title, before);
});

test('scores are validated', async () => {
  const c = await as('zeynep');
  assert.equal((await c.post('/scores', { game: 'xox', score: 70 })).status, 201);
  assert.equal((await c.post('/scores', { game: 'chess', score: 70 })).status, 400);
  assert.equal((await c.post('/scores', { game: 'xox', score: 1000 })).status, 400);
});

test('logout ends the session', async () => {
  const c = await as('murat');
  assert.equal((await c.post('/auth/logout')).status, 200);
  assert.equal((await c.get('/bootstrap')).status, 401);
});

test('repeated failed logins are throttled', async () => {
  const c = client();
  let last;
  for (let i = 0; i < 6; i++) last = await c.post('/auth/login', { username: 'burak', password: 'yanlis' + i });
  assert.equal(last.status, 429);
});
