export function notFoundHandler(_req, res) {
  res.status(404).json({ error: 'The requested endpoint was not found.' });
}

export function errorHandler(error, _req, res, _next) {
  if (error?.code === 'SQLITE_CONSTRAINT_UNIQUE') {
    return res.status(409).json({ error: 'A record with this unique value already exists.' });
  }
  if (error?.code?.startsWith?.('SQLITE_CONSTRAINT')) {
    return res.status(400).json({ error: 'The operation violates a data constraint.' });
  }
  const message = error?.message || 'An unexpected server error occurred.';
  const status = Number.isInteger(error?.status) ? error.status : 400;
  if (status >= 500) console.error(error);
  return res.status(status).json({ error: message });
}
