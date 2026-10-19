-- Kademe Yönetim Portalı: initial schema

CREATE TABLE users (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username             text NOT NULL UNIQUE,
  email                text NOT NULL DEFAULT '',
  phone                text NOT NULL DEFAULT '',
  name                 text NOT NULL,
  title                text NOT NULL DEFAULT '',
  role                 text NOT NULL CHECK (role IN ('gmy', 'director', 'manager')),
  manager_id           uuid REFERENCES users(id),
  dept                 text NOT NULL DEFAULT '',
  color                text NOT NULL DEFAULT '#1d4f86',
  password_hash        text NOT NULL,
  must_change_password boolean NOT NULL DEFAULT false,
  active               boolean NOT NULL DEFAULT true,
  theme                text NOT NULL DEFAULT 'system' CHECK (theme IN ('system', 'light', 'dark')),
  prefs                jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at           timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX users_manager_idx ON users (manager_id);

CREATE TABLE sessions (
  token_hash text PRIMARY KEY,
  user_id    uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  last_seen  timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL
);
CREATE INDEX sessions_user_idx ON sessions (user_id);

CREATE TABLE projects (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  description text NOT NULL DEFAULT '',
  owner_id    uuid NOT NULL REFERENCES users(id),
  created_by  uuid NOT NULL REFERENCES users(id),
  created_at  timestamptz NOT NULL DEFAULT now(),
  start_date  date NOT NULL,
  due_date    date NOT NULL,
  status      text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'done')),
  progress    integer NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  health      text NOT NULL DEFAULT 'iyi' CHECK (health IN ('iyi', 'risk', 'gecikme'))
);
CREATE INDEX projects_owner_idx ON projects (owner_id);

CREATE TABLE project_reports (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  author_id  uuid NOT NULL REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  progress   integer NOT NULL CHECK (progress BETWEEN 0 AND 100),
  health     text NOT NULL CHECK (health IN ('iyi', 'risk', 'gecikme')),
  note       text NOT NULL DEFAULT ''
);
CREATE INDEX project_reports_project_idx ON project_reports (project_id, created_at);

CREATE TABLE project_comments (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  author_id  uuid NOT NULL REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  body       text NOT NULL
);
CREATE INDEX project_comments_project_idx ON project_comments (project_id, created_at);

CREATE TABLE meetings (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title        text NOT NULL,
  starts_at    timestamptz NOT NULL,
  duration_min integer NOT NULL CHECK (duration_min BETWEEN 5 AND 600),
  mode         text NOT NULL DEFAULT 'yuz' CHECK (mode IN ('yuz', 'online')),
  location     text NOT NULL DEFAULT '',
  agenda       text NOT NULL DEFAULT '',
  organizer_id uuid NOT NULL REFERENCES users(id),
  created_at   timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX meetings_starts_idx ON meetings (starts_at);

CREATE TABLE meeting_attendees (
  meeting_id uuid NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
  user_id    uuid NOT NULL REFERENCES users(id),
  rsvp       text CHECK (rsvp IN ('yes', 'no')),
  PRIMARY KEY (meeting_id, user_id)
);
CREATE INDEX meeting_attendees_user_idx ON meeting_attendees (user_id);

CREATE TABLE announcements (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id        uuid NOT NULL REFERENCES users(id),
  audience_lead_id uuid REFERENCES users(id), -- NULL: whole organisation; otherwise that leader's team
  kind             text NOT NULL CHECK (kind IN ('duyuru', 'kural', 'hatirlatma')),
  title            text NOT NULL,
  body             text NOT NULL,
  pinned           boolean NOT NULL DEFAULT false,
  created_at       timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE announcement_acks (
  announcement_id uuid NOT NULL REFERENCES announcements(id) ON DELETE CASCADE,
  user_id         uuid NOT NULL REFERENCES users(id),
  created_at      timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (announcement_id, user_id)
);

CREATE TABLE notifications (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  kind       text NOT NULL CHECK (kind IN ('meeting', 'report', 'lobby', 'comment', 'project')),
  text       text NOT NULL,
  link       jsonb NOT NULL DEFAULT '{}'::jsonb,
  read       boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX notifications_user_idx ON notifications (user_id, created_at DESC);

CREATE TABLE scores (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES users(id),
  game       text NOT NULL CHECK (game IN ('xox', 'hangman', 'memory')),
  score      integer NOT NULL CHECK (score BETWEEN 0 AND 100),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX scores_created_idx ON scores (created_at);
