'use strict';

class HttpError extends Error {
  constructor(status, message, code) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

// Express 4 does not catch rejected promises; route handlers go through this.
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

// Small validators: each returns the clean value or throws a 400 with a Turkish message.
const v = {
  str(val, label, { min = 0, max = 500, optional = false } = {}) {
    if (val == null || val === '') {
      if (optional || min === 0) return '';
      throw new HttpError(400, `${label} gerekli.`);
    }
    if (typeof val !== 'string') throw new HttpError(400, `${label} geçersiz.`);
    const s = val.trim();
    if (s.length < min) throw new HttpError(400, `${label} gerekli.`);
    if (s.length > max) throw new HttpError(400, `${label} en fazla ${max} karakter olabilir.`);
    return s;
  },
  int(val, label, { min, max }) {
    const n = Number(val);
    if (!Number.isInteger(n) || n < min || n > max) throw new HttpError(400, `${label} ${min} ile ${max} arasında olmalı.`);
    return n;
  },
  oneOf(val, label, list) {
    if (!list.includes(val)) throw new HttpError(400, `${label} geçersiz.`);
    return val;
  },
  uuid(val, label) {
    if (typeof val !== 'string' || !UUID.test(val)) throw new HttpError(400, `${label} geçersiz.`);
    return val;
  },
  date(val, label) {
    if (typeof val !== 'string' || !DATE.test(val) || Number.isNaN(Date.parse(val))) throw new HttpError(400, `${label} geçersiz.`);
    return val;
  },
  instant(val, label) {
    const t = Date.parse(val);
    if (typeof val !== 'string' || Number.isNaN(t)) throw new HttpError(400, `${label} geçersiz.`);
    return new Date(t).toISOString();
  },
  bool: (val) => val === true,
};

function errorHandler(err, req, res, _next) {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ error: err.message, code: err.code });
  }
  if (err && err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Geçersiz istek gövdesi.' });
  if (err && err.type === 'entity.too.large') return res.status(413).json({ error: 'İstek çok büyük.' });
  console.error(err);
  res.status(500).json({ error: 'Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.' });
}

module.exports = { HttpError, wrap, v, UUID, errorHandler };
