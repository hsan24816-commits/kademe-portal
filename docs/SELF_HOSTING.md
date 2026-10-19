# Running the portal on your own computer

This sets up the portal and its PostgreSQL database on one always-on computer, reachable only from the work network. Both run in Docker, so nothing else needs installing, and they restart on their own after a reboot.

```
 Work network (e.g. 10.20.0.0/16)
 ┌──────────────────────────────────────────────────────┐
 │  colleague's browser ──► http://<your-PC-IP>:3000    │
 │                              │                       │
 │                  ┌───────────▼───────────┐           │
 │                  │ Your computer         │           │
 │                  │  Docker: app  :3000   │           │
 │                  │  Docker: db (no port, │           │
 │                  │   only the app sees it)│          │
 │                  └───────────────────────┘           │
 └──────────────────────────────────────────────────────┘
```

**Before you start:** the computer must be connected to the work network (office cable or Wi-Fi, or always on the company VPN). If it sits at home, colleagues on the work network cannot reach it without a tunnel; see the last section. Hosting a service on a work PC may also need your IT department's OK, so check the company policy first.

## 1. Install Docker

- **Windows 10/11:** install [Docker Desktop](https://www.docker.com/products/docker-desktop/). In Settings → General, turn on **Start Docker Desktop when you sign in**. Set Windows to sign in automatically or leave the account signed in, because Docker Desktop only runs while someone is signed in.
- **macOS:** install Docker Desktop and turn on the same setting.
- **Linux:** install Docker Engine and the compose plugin (`sudo apt install docker.io docker-compose-v2` on Ubuntu). It starts at boot on its own.

Also install [Git](https://git-scm.com/downloads), or download the repository as a ZIP from GitHub.

## 2. Get the code and settings

```bash
git clone https://github.com/hsan24816-commits/kademe-portal.git
cd kademe-portal
cp .env.example .env        # Windows PowerShell: copy .env.example .env
```

Edit `.env` and change these lines:

```ini
NODE_ENV=production
# The portal is served over plain http inside the work network, so it must not insist on https.
PLAIN_HTTP=1
# Not behind a proxy here
TRUST_PROXY=
ADMIN_USERNAME=halit
ADMIN_PASSWORD=<at least 8 characters, you change it at first sign-in>
ADMIN_NAME="Halit Özdamar"
DEMO_MODE=0
```

Add one more line to the same `.env` file for the database password:

```ini
POSTGRES_PASSWORD=<a long random password>
```

`DATABASE_URL` in `.env` is ignored here; `docker-compose.yml` builds it from `POSTGRES_PASSWORD`.

## 3. Start it

```bash
docker compose up -d --build
docker compose logs -f app      # wait for "Kademe portal listening on :3000", then Ctrl+C
```

Open http://localhost:3000 on the computer itself and sign in with `ADMIN_USERNAME` / `ADMIN_PASSWORD`. Then set your title in **Ayarlar → Profil bilgileri → Ünvan**.

## 4. Let the work network in, and nobody else

Find the computer's address on the work network: `ipconfig` on Windows (IPv4 Address), `ip addr` on Linux. Colleagues then open `http://<that address>:3000`. Ask IT for a fixed (reserved) address or a name like `portal.sirket.local` so the link does not change.

Allow port 3000 only from the work network's address range (ask IT for it, for example `10.20.0.0/16`).

**Windows** (PowerShell as Administrator):

```powershell
New-NetFirewallRule -DisplayName "Kademe portal" -Direction Inbound -Protocol TCP -LocalPort 3000 `
  -RemoteAddress 10.20.0.0/16 -Profile Domain,Private -Action Allow
```

Make sure the work network is marked **Domain** or **Private** in Windows, not Public. Docker Desktop can add its own broad firewall rule on first start; if Windows asks, allow it only on private networks.

**Linux** (ufw):

```bash
sudo ufw allow from 10.20.0.0/16 to any port 3000 proto tcp
```

Note that Docker publishes ports past ufw on Linux. To be strict, change the port line in `docker-compose.yml` to the computer's work address, for example `"10.20.5.40:3000:3000"`.

The database has no published port at all, so only the portal container can talk to it.

## 5. Backups

The data lives in the Docker volume `kademe-portal_pgdata`. Take a copy every night:

```bash
docker compose exec -T db pg_dump -U kademe kademe > backup-$(date +%F).sql
```

On Windows, put this in a `backup.ps1` and schedule it with Task Scheduler:

```powershell
cd C:\path\to\kademe-portal
docker compose exec -T db pg_dump -U kademe kademe | Out-File -Encoding utf8 "D:\yedek\kademe-$(Get-Date -Format yyyy-MM-dd).sql"
```

Keep copies on a different disk or a network share. To restore into an empty database: `docker compose exec -T db psql -U kademe kademe < backup.sql`.

## 6. Updating to a new version

```bash
git pull
docker compose up -d --build
```

Database changes apply on their own when the app starts.

## If the computer is not on the work network

Colleagues on the work network cannot reach a home computer directly, and opening a port on a home router would put the portal on the public internet. The safe options are a private overlay network such as Tailscale (each colleague installs it and joins your network), or asking IT to place the computer, or a small server, inside the office network. Check with IT before using either.
