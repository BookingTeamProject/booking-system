import type { ReactNode } from 'react';

const icons: [string, ReactNode][] = [
  ['YouTube', <><rect x="1" y="4" width="22" height="16" rx="5" fill="currentColor" /><path d="M10 8L16 12L10 16Z" fill="#6e473b" /></>],
  ['X', <path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />],
  ['TikTok', <path fill="currentColor" d="M14 2h3c.3 3 2 4.5 5 5v3c-2 0-3.5-.6-5-1.7V17a6 6 0 1 1-6-6v3a3 3 0 1 0 3 3Z" />],
  ['Instagram', <g fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".5" fill="currentColor" /></g>],
];

export function SocialLinks() {
  return <div style={{ marginTop: 20 }}>
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      {icons.map(([name, icon]) => <span key={name} role="img" aria-label={`${name}: сторінку ще не додано`}
        title={`${name}: сторінку ще не додано`} style={{ display:'inline-flex',alignItems:'center',justifyContent:'center',
          width:44,height:44,flex:'0 0 44px',borderRadius:'50%',border:'2px solid #dc9666',color:'#dc9666',boxSizing:'border-box' }}>
        <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">{icon}</svg>
      </span>)}
    </div>
    <p style={{fontSize:12,color:'#e1d4c2',marginTop:10}}>Сторінки в соцмережах ще не додано</p>
  </div>;
}
