'use strict';
// Browser walkthrough against a running server with demo data (DEMO_MODE=1, npm run seed:demo).
// Usage: BASE_URL=http://localhost:3000 node test/e2e/browser.e2e.js   (needs the `playwright` package)
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');

(async () => {
  const B = process.env.BASE_URL || 'http://localhost:3000';
  const out = process.env.SHOT_DIR || null;
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 400, height: 860 } });
  const pg = await ctx.newPage();
  const errs = [];
  pg.on('pageerror', (e) => errs.push('PAGEERR ' + e.message));
  pg.on('console', (m) => { if (m.type() === 'error' && !m.text().includes('Failed to load resource')) errs.push('CONSOLE ' + m.text()); });
  await pg.route('**/fonts.googleapis.com/**', (r) => r.abort());
  const shot = (n) => (out ? pg.screenshot({ path: `${out}/${n}.png`, fullPage: true }) : null);
  const txt = () => pg.textContent('#app');
  const expect = async (cond, msg) => { if (!(await cond)) errs.push(msg); };

  await pg.goto(B); await pg.waitForSelector('#lg-user'); await shot('01-login');
  await pg.fill('#lg-user', 'halit'); await pg.fill('#lg-pass', 'wrong'); await pg.click('[type=submit]'); await pg.waitForSelector('.err');
  await pg.click('[data-act=demoLogin][data-u=halit]'); await pg.waitForSelector('.hello'); await shot('02-home');
  for (const t of ['projects', 'lobby', 'inbox', 'games', 'settings']) { await pg.click(`.nav button[data-v=${t}]`); await pg.waitForTimeout(150); }

  // meeting
  await pg.click('.nav button[data-v=home]'); await pg.click('[data-act=go][data-v=meetings]'); await pg.click('[data-act=newMeeting]');
  await pg.fill('#mf-title', 'E2E toplantı');
  const tm = new Date(Date.now() + 86400e3);
  await pg.fill('#mf-date', `${tm.getFullYear()}-${String(tm.getMonth() + 1).padStart(2, '0')}-${String(tm.getDate()).padStart(2, '0')}`);
  await pg.check('.checks input >> nth=3'); await pg.click('form[data-form=meeting] [type=submit]'); await pg.waitForTimeout(700);
  await expect(txt().then((t) => t.includes('E2E toplantı')), 'meeting not shown');

  // project, report, comment
  await pg.click('.nav button[data-v=projects]'); await pg.click('[data-act=newProject]'); await pg.fill('#pj-name', 'E2E projesi');
  await pg.click('form[data-form=project] [type=submit]'); await pg.waitForTimeout(700);
  await expect(txt().then((t) => t.includes('E2E projesi')), 'project not created');
  await pg.click('[data-act=report]'); await pg.fill('#rp-note', 'İlk rapor');
  await pg.$eval('#rp-prog', (e) => { e.value = 25; e.dispatchEvent(new Event('input', { bubbles: true })); });
  await pg.click('form[data-form=report] [type=submit]'); await pg.waitForTimeout(700);
  await expect(txt().then((t) => t.includes('%25')), 'report not saved');
  await pg.fill('form[data-form=comment] input', 'E2E yorum'); await pg.click('form[data-form=comment] [type=submit]'); await pg.waitForTimeout(600);
  await expect(txt().then((t) => t.includes('E2E yorum')), 'comment not saved');
  await shot('03-project');

  // add a manager, read the temporary password
  await pg.click('.nav button[data-v=home]'); await pg.click('[data-act=go][data-v=team]'); await pg.click('[data-act=newPerson]');
  await pg.fill('#ps-name', 'Test Müdür'); await pg.fill('#ps-title', 'Test Müdürü');
  await pg.click('label:has(input[name=role][value=manager]) span'); await pg.fill('#ps-user', 'test.mudur');
  await pg.click('form[data-form=person] [type=submit]');
  await pg.waitForSelector('#tp-pass'); const temp = (await pg.textContent('#tp-pass')).trim(); await shot('04-temp');
  await pg.click('[data-act=closeSheet]');

  // lobby
  await pg.click('.nav button[data-v=lobby]'); await pg.click('[data-act=newAnn]');
  await pg.fill('#an-title', 'E2E duyuru'); await pg.fill('#an-body', 'Herkes okusun.'); await pg.click('form[data-form=ann] [type=submit]'); await pg.waitForTimeout(600);
  await expect(txt().then((t) => t.includes('E2E duyuru')), 'announcement not posted');

  // a game
  await pg.click('.nav button[data-v=games]'); await pg.click('[data-act=openGame][data-v=xox]');
  for (let k = 0; k < 5; k++) { const f = await pg.$$('.xox button:not([disabled])'); if (!f.length) break; await f[0].click(); await pg.waitForTimeout(600); }
  await pg.click('[data-act=closeSheet]');

  // new person signs in with the temporary password and must change it
  await pg.click('.nav button[data-v=settings]'); await pg.click('[data-act=logout]'); await pg.waitForSelector('#lg-user');
  await pg.fill('#lg-user', 'test.mudur'); await pg.fill('#lg-pass', temp); await pg.click('[type=submit]');
  await pg.waitForSelector('#fp-cur'); await shot('05-first-password');
  await pg.fill('#fp-cur', temp); await pg.fill('#fp-new', 'yeniSifre123'); await pg.fill('#fp-new2', 'yeniSifre123'); await pg.click('[type=submit]');
  await pg.waitForSelector('.hello');
  await pg.click('.nav button[data-v=lobby]'); await expect(txt().then((t) => t.includes('E2E duyuru')), 'new user cannot see org-wide announcement');
  await pg.click('.nav button[data-v=projects]');
  const n = await pg.$$eval('.pcard', (x) => x.length); if (n !== 0) errs.push('new manager sees projects: ' + n);

  // a manager from the demo org
  await pg.click('.nav button[data-v=settings]'); await pg.click('[data-act=logout]');
  await pg.click('[data-act=demoLogin][data-u=emre]'); await pg.waitForSelector('.hello');
  await pg.click('.nav button[data-v=projects]'); const n2 = await pg.$$eval('.pcard', (x) => x.length);
  if (n2 !== 2) errs.push('emre should see 2 active projects, saw ' + n2);
  await pg.click('.nav button[data-v=inbox]'); await shot('06-inbox-manager');
  await pg.reload(); await pg.waitForSelector('.page-h');

  await b.close();
  if (errs.length) { console.error(errs.join('\n')); process.exit(1); }
  console.log('Browser walkthrough passed.');
})().catch((e) => { console.error(e); process.exit(1); });
