export default function Notice({ error, success, onClose }) {
  if (!error && !success) return null;
  return (
    <div className={`notice ${error ? 'notice-error' : 'notice-success'}`} role="status">
      <span>{error || success}</span>
      {onClose && <button className="notice-close" onClick={onClose} aria-label="Dismiss message">×</button>}
    </div>
  );
}
