'use strict';
// The reporting hierarchy, loaded per request. Every visibility and permission rule in the
// API is expressed through these few functions, so the rules live in one place.

class Org {
  constructor(users) {
    this.users = users;
    this.byId = new Map(users.map((u) => [u.id, u]));
  }

  static async load(db) {
    const { rows } = await db.query('SELECT * FROM users ORDER BY created_at, name');
    return new Org(rows);
  }

  get(id) { return this.byId.get(id) || null; }
  active() { return this.users.filter((u) => u.active); }
  subs(u) { return this.users.filter((x) => x.active && x.manager_id === u.id); }

  chainUp(u) {
    const out = [];
    const seen = new Set();
    let c = this.get(u.manager_id);
    while (c && !seen.has(c.id)) { seen.add(c.id); out.push(c); c = this.get(c.manager_id); }
    return out;
  }

  // Ids of the people whose work `u` may see: everyone for the deputy GM, otherwise self and everyone below.
  scope(u) {
    if (u.role === 'gmy') return new Set(this.active().map((x) => x.id));
    const ids = new Set([u.id]);
    const walk = (x) => this.subs(x).forEach((s) => { if (!ids.has(s.id)) { ids.add(s.id); walk(s); } });
    walk(u);
    return ids;
  }

  isAbove(a, b) { return !!b && this.chainUp(b).some((x) => x.id === a.id); }

  // People `u` may invite: their scope, their chain of superiors and their peers.
  meetingCandidates(u) {
    if (u.role === 'gmy') return new Set(this.active().filter((x) => x.id !== u.id).map((x) => x.id));
    const ids = new Set([...this.scope(u), ...this.chainUp(u).map((x) => x.id)]);
    this.active().filter((x) => x.manager_id === u.manager_id).forEach((x) => ids.add(x.id));
    ids.delete(u.id);
    return ids;
  }

  // Everyone an announcement reaches. A team announcement also reaches every deputy GM.
  audience(a) {
    if (!a.audience_lead_id) return new Set(this.active().map((x) => x.id));
    const lead = this.get(a.audience_lead_id);
    if (!lead || !lead.active) return new Set();
    const ids = this.scope(lead);
    this.active().filter((x) => x.role === 'gmy').forEach((x) => ids.add(x.id));
    return ids;
  }

  // May `actor` manage (edit, deactivate, reset password of) `target`?
  canManageUser(actor, target) {
    if (!target || actor.id === target.id) return false;
    if (actor.role === 'gmy') return true;
    return actor.role === 'director' && this.isAbove(actor, target);
  }
}

module.exports = { Org };
