'use strict';

// Sends one notification to each recipient, skipping the actor, inactive people and anyone
// who switched that kind off in their settings.
async function notify(db, org, actor, ids, kind, text, link = {}) {
  const recipients = [...new Set(ids)].filter((id) => {
    if (!id || id === actor.id) return false;
    const r = org.get(id);
    return r && r.active && !(r.prefs && r.prefs[kind] === false);
  });
  if (!recipients.length) return 0;
  await db.query(
    `INSERT INTO notifications (user_id, kind, text, link)
     SELECT unnest($1::uuid[]), $2, $3, $4::jsonb`,
    [recipients, kind, text, JSON.stringify(link)]
  );
  return recipients.length;
}

const trDate = (d) => new Date(d).toLocaleString('tr-TR', {
  day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: process.env.TZ_DISPLAY || 'Europe/Istanbul',
});

module.exports = { notify, trDate };
