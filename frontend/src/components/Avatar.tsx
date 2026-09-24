import { useState } from 'react';

/** Fixed square geometry prevents flex containers from turning portraits into ovals. */
export function Avatar({ src, name, size = 44 }: { src?: string | null; name: string; size?: number }) {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  let url: string | undefined;
  if (src) {
    try {
      const base = new URL(import.meta.env.VITE_API_BASE_URL || '/api', window.location.origin);
      const candidate = new URL(src, base.origin);
      if (['http:', 'https:'].includes(candidate.protocol)) url = candidate.href;
    } catch { /* Invalid URLs use initials. */ }
  }
  const initials = name.trim().split(/\s+/).slice(0, 2).map(part => part[0]).join('').toUpperCase() || '?';
  return <span className="user-avatar" role="img" aria-label={name || 'Аватар'} style={{
    width: size, height: size, minWidth: size, flex: `0 0 ${size}px`, aspectRatio: '1',
    borderRadius: '50%', overflow: 'hidden', display: 'inline-flex', alignItems: 'center',
    justifyContent: 'center', boxSizing: 'border-box', background: '#ead8c5', color: '#6e473b',
    border: '2px solid #dc9666', fontWeight: 700, fontSize: size * 0.32,
  }}>
    {url && failedSource !== url ? <img src={url} alt="" onError={() => setFailedSource(url!)}
      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} /> : initials}
  </span>;
}
