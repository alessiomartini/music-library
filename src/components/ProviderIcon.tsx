/** Small brand glyph for the platform a recording link points to. */
export function ProviderIcon({ provider }: { provider: 'spotify' | 'youtube' | 'instagram' }) {
  const label = { spotify: 'Spotify', youtube: 'YouTube', instagram: 'Instagram' }[provider];
  return (
    <svg className={`provider-icon ${provider}`} viewBox="0 0 24 24" width="16" height="16" role="img" aria-label={label}>
      <title>{label}</title>
      {provider === 'spotify' && (
        <>
          <circle cx="12" cy="12" r="12" fill="#1DB954" />
          <path d="M6 9.2c4-1.2 8.6-.9 12.2 1.1M6.7 12.4c3.3-.9 7-.6 10 1M7.4 15.4c2.7-.7 5.4-.5 7.8.8" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" fill="none" />
        </>
      )}
      {provider === 'youtube' && (
        <>
          <rect x="1" y="4.5" width="22" height="15" rx="4.5" fill="#FF0000" />
          <path d="M10 8.7v6.6l5.6-3.3z" fill="#fff" />
        </>
      )}
      {provider === 'instagram' && (
        <>
          <defs>
            <linearGradient id="ig-gradient" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0" stopColor="#FEDA75" />
              <stop offset="0.35" stopColor="#FA7E1E" />
              <stop offset="0.65" stopColor="#D62976" />
              <stop offset="1" stopColor="#4F5BD5" />
            </linearGradient>
          </defs>
          <rect x="1.5" y="1.5" width="21" height="21" rx="6" fill="url(#ig-gradient)" />
          <rect x="6" y="6" width="12" height="12" rx="3.8" stroke="#fff" strokeWidth="1.7" fill="none" />
          <circle cx="12" cy="12" r="2.9" stroke="#fff" strokeWidth="1.7" fill="none" />
          <circle cx="16.6" cy="7.4" r="1" fill="#fff" />
        </>
      )}
    </svg>
  );
}
