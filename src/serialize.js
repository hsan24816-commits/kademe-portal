'use strict';
// Converts database rows to the JSON shapes the browser app works with.

const iso = (d) => (d ? new Date(d).toISOString() : null);

function meUser(u) {
  return {
    id: u.id, username: u.username, name: u.name, title: u.title, role: u.role, managerId: u.manager_id,
    dept: u.dept, email: u.email, phone: u.phone, color: u.color, theme: u.theme,
    prefs: { meeting: true, report: true, lobby: true, comment: true, project: true, ...(u.prefs || {}) },
    mustChangePassword: u.must_change_password, active: u.active,
  };
}

// Directory entry. Contact details only for people the viewer works with.
function dirUser(u, withContact) {
  const out = {
    id: u.id, name: u.name, title: u.title, role: u.role, managerId: u.manager_id,
    dept: u.dept, color: u.color, active: u.active,
  };
  if (withContact) Object.assign(out, { username: u.username, email: u.email, phone: u.phone });
  return out;
}

function project(p, reports = [], comments = []) {
  return {
    id: p.id, name: p.name, desc: p.description, ownerId: p.owner_id, createdBy: p.created_by,
    createdAt: iso(p.created_at), start: p.start_date, due: p.due_date, status: p.status,
    progress: p.progress, health: p.health,
    reports: reports.map((r) => ({ id: r.id, at: iso(r.created_at), by: r.author_id, progress: r.progress, health: r.health, note: r.note })),
    comments: comments.map((c) => ({ id: c.id, at: iso(c.created_at), by: c.author_id, text: c.body })),
  };
}

function meeting(m, attendees = []) {
  const rsvp = {};
  attendees.forEach((a) => { if (a.rsvp) rsvp[a.user_id] = a.rsvp; });
  return {
    id: m.id, at: iso(m.starts_at), dur: m.duration_min, title: m.title, organizerId: m.organizer_id,
    attendeeIds: attendees.map((a) => a.user_id), mode: m.mode, location: m.location, agenda: m.agenda,
    rsvp, createdAt: iso(m.created_at),
  };
}

function announcement(a, acks) {
  return {
    id: a.id, by: a.author_id, audience: a.audience_lead_id || 'all', kind: a.kind, at: iso(a.created_at),
    title: a.title, body: a.body, pinned: a.pinned, acks,
  };
}

const notification = (n) => ({ id: n.id, userId: n.user_id, kind: n.kind, text: n.text, link: n.link, at: iso(n.created_at), read: n.read });
const score = (s) => ({ id: s.id, userId: s.user_id, game: s.game, score: s.score, at: iso(s.created_at) });

module.exports = { meUser, dirUser, project, meeting, announcement, notification, score, iso };
