# Kademe Yönetim Portalı

A web portal for a deputy general manager (Genel Müdür Yardımcısı), the directors who report to them, and the managers under each director. The interface is in Turkish and built phone-first, and it works on desktop too.

| Tab | What it does |
| --- | --- |
| **Ana sayfa** | Team progress ring, upcoming meetings, projects needing a report, at-risk projects, team status. Shortcuts to the weekly report, the meeting calendar and the org chart (Ekibim). |
| **Projeler** | Projects with progress bars, status (Yolunda / Riskli / Gecikmede), due dates, report history, comments. |
| **Lobi** | Announcements, rules and reminders, with "Okudum" acknowledgements and reminders for people who haven't read them. |
| **Gelen** | Notifications for invitations, reports, comments and announcements. |
| **Mola** | Three short games (XOX, Adam Asmaca, Hafıza Kartları) and a shared leaderboard. |
| **Ayarlar** | Profile, password, theme, notification switches. |

## Who sees what

The server enforces these rules on every request. The browser only ever receives data the person is allowed to see.

| | Deputy GM | Director | Manager |
| --- | --- | --- | --- |
| Projects and reports | All | Own and their managers' | Own |
| Assign, edit, complete projects | All | Within their team | No (reports only) |
| Meetings visible | All | Involving anyone in their team | Their own |
| Invite to meetings | Anyone | Team, own manager, peers | Own director, deputy GM, peers |
| Post in Lobi | Whole organisation or one team | Own team | No |
| Add people, reset passwords, deactivate | Everyone | Own managers | No |

## Accounts and sign-in

- People sign in with a username (or email) and password. Passwords are hashed with scrypt; sessions are random tokens stored hashed in the database, sent as `HttpOnly`, `SameSite=Lax`, `Secure` cookies.
- New people are added in **Ekibim → Kişi ekle**. The portal generates a temporary password and shows it once; the person must set their own password at first sign-in. A forgotten password is reset the same way by their manager or the deputy GM.
- Failed logins are throttled (10 per username, 50 per IP address, per 15 minutes).
- Deactivating someone blocks their sign-in, removes them from future meetings, and moves their projects to their manager. Their past reports and comments stay.

## Run it locally

Needs Node.js 20+ and PostgreSQL 14+.

```bash
npm install
cp .env.example .env            # edit DATABASE_URL and the ADMIN_* values
set -a; . ./.env; set +a
npm start                        # runs migrations, creates the first account, serves on :3000
```

Or with Docker (portal + database):

```bash
cp .env.example .env             # edit it
POSTGRES_PASSWORD=your-db-password docker compose up -d
```

### Demo data

To try the portal with a sample organisation (1 deputy GM, 3 directors, 6 managers, projects, meetings, announcements):

```bash
npm run seed:demo                # on an empty database; add -- --reset to wipe an existing one
DEMO_MODE=1 npm start            # shows the demo accounts on the sign-in page
```

All demo accounts use the password `demo1234`. Never set `DEMO_MODE=1` on the real database.

## Put it online

The app is one Node.js process plus a PostgreSQL database. Any host that runs Node or Docker works.

**Render (easiest):** push this repository to GitHub, then in Render choose *New → Blueprint* and pick the repository. `render.yaml` creates the database and the web service; Render asks for `ADMIN_USERNAME`, `ADMIN_PASSWORD` (a temporary password of at least 8 characters) and `ADMIN_NAME`. Check the plan names in `render.yaml` against Render's current pricing before applying.

**Railway, Fly.io, a VPS or company server:** use the `Dockerfile` (or `npm ci --omit=dev && npm start`) and set the variables from `.env.example`. Set `DATABASE_SSL=1` if the database requires SSL and `TRUST_PROXY=1` behind a proxy.

Always serve it over HTTPS. In production the session cookie is `Secure`, so sign-in does not work over plain HTTP. For a quick test on a private network only, `INSECURE_COOKIES=1` turns that off.

After the first deploy: sign in with the `ADMIN_*` account, set a new password, then add directors and managers in **Ekibim**.

### Backups

All data is in PostgreSQL. Turn on your host's automatic backups, or schedule `pg_dump "$DATABASE_URL" > backup.sql`.

## Tests

```bash
createdb kademe_test
TEST_DATABASE_URL=postgresql://localhost/kademe_test npm test
```

`test/api.test.js` covers sign-in, the CSRF guard, throttling and the visibility and permission rules above. It wipes the test database each run. `test/e2e/browser.e2e.js` is a Playwright walkthrough of the main screens against a running demo server.

## Project layout

```
src/server.js         start-up: migrations, first account, HTTP server
src/app.js            Express app, security headers, API mounting
src/auth.js           password hashing, sessions, CSRF guard, login throttle
src/org.js            reporting hierarchy: scope, invite and audience rules
src/routes/*.js       API endpoints
migrations/*.sql      database schema (applied automatically, in order)
scripts/              create-admin, seed-demo, migrate
public/               the browser app (no build step)
```

## Not included yet

- Email: invitations and password resets are shown on screen, not emailed. Adding SMTP is the natural next step.
- Company single sign-on (Microsoft 365 / Google Workspace).
- Calendar sync (Outlook / Google Calendar) and file attachments on reports.
