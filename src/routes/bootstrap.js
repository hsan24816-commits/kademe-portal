'use strict';
const express = require('express');
const { wrap } = require('../http');
const { Org } = require('../org');
const S = require('../serialize');

// One read that returns everything the signed-in person may see, already filtered by role.
module.exports = function bootstrapRoutes(pool) {
  const r = express.Router();

  r.get('/bootstrap', wrap(async (req, res) => {
    const me = req.user;
    const org = await Org.load(pool);
    const scope = org.scope(me);
    const contacts = new Set([...scope, ...org.chainUp(me).map((x) => x.id), ...org.meetingCandidates(me), me.id]);
    const users = org.users.map((u) => S.dirUser(u, contacts.has(u.id)));

    // Projects whose owner is in scope
    const pr = await pool.query('SELECT * FROM projects WHERE owner_id = ANY($1::uuid[]) ORDER BY created_at', [[...scope]]);
    const pids = pr.rows.map((p) => p.id);
    const [reps, coms] = await Promise.all([
      pool.query('SELECT * FROM project_reports WHERE project_id = ANY($1::uuid[]) ORDER BY created_at', [pids]),
      pool.query('SELECT * FROM project_comments WHERE project_id = ANY($1::uuid[]) ORDER BY created_at', [pids]),
    ]);
    const group = (rows) => rows.reduce((m, x) => ((m[x.project_id] = m[x.project_id] || []).push(x), m), {});
    const rg = group(reps.rows), cg = group(coms.rows);
    const projects = pr.rows.map((p) => S.project(p, rg[p.id], cg[p.id]));

    // Meetings from the last 120 days onward that involve someone in scope (everything for the deputy GM)
    const mt = await pool.query(`SELECT * FROM meetings WHERE starts_at > now() - interval '120 days' ORDER BY starts_at`);
    const att = await pool.query('SELECT * FROM meeting_attendees WHERE meeting_id = ANY($1::uuid[])', [mt.rows.map((m) => m.id)]);
    const ag = att.rows.reduce((m, x) => ((m[x.meeting_id] = m[x.meeting_id] || []).push(x), m), {});
    const meetings = mt.rows
      .filter((m) => me.role === 'gmy' || [m.organizer_id, ...(ag[m.id] || []).map((a) => a.user_id)].some((id) => scope.has(id)))
      .map((m) => S.meeting(m, ag[m.id]));

    // Announcements whose audience includes me (or that I wrote). Full read lists only for the author and deputy GMs.
    const an = await pool.query('SELECT * FROM announcements ORDER BY pinned DESC, created_at DESC');
    const ak = await pool.query('SELECT announcement_id, user_id FROM announcement_acks');
    const akg = ak.rows.reduce((m, x) => ((m[x.announcement_id] = m[x.announcement_id] || []).push(x.user_id), m), {});
    const announcements = an.rows
      .filter((a) => a.author_id === me.id || org.audience(a).has(me.id))
      .map((a) => {
        const all = akg[a.id] || [];
        const acks = a.author_id === me.id || me.role === 'gmy' ? all : all.filter((id) => id === me.id);
        return S.announcement(a, acks);
      });

    const [nt, sc] = await Promise.all([
      pool.query('SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 200', [me.id]),
      pool.query(`SELECT * FROM scores WHERE created_at > now() - interval '400 days' ORDER BY created_at`),
    ]);

    res.json({
      me: S.meUser(me), users, projects, meetings, announcements,
      notifications: nt.rows.map(S.notification), scores: sc.rows.map(S.score),
      serverTime: new Date().toISOString(),
    });
  }));

  return r;
};
