import { useState } from 'react';
import { Link } from 'react-router-dom';
import { coverCount, songs } from '../data/songs';
import { VoiceSettings } from '../components/VoiceSettings';
import type { Song } from '../lib/types';

/** List filters; "Other languages" also holds instrumentals and songs of unknown language. */
const FILTERS: [string, (s: Song) => boolean][] = [
  ['All', () => true],
  ['English', (s) => s.language === 'en'],
  ['Italian', (s) => s.language === 'it'],
  ['Other languages', (s) => s.language !== 'en' && s.language !== 'it'],
  ['Jazz standards', (s) => !!s.standard],
  ['Classical', (s) => !!s.classical],
  ['Not classical', (s) => !s.classical],
];

export function Home() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const q = query.trim().toLowerCase();
  const keep = FILTERS.find(([name]) => name === filter)![1];
  const shown = songs.filter(
    (s) =>
      keep(s) &&
      (!q || [s.title, s.artist, ...(s.translations ?? []).flatMap((t) => [t.title, t.artist])].join(' ').toLowerCase().includes(q)),
  );

  return (
    <div className="page home-page">
      <h1>Song Library</h1>
      <p className="subtitle">Lead sheets — melody, chords, bass line and lyrics. Transposable, in Italian or English chord notation.</p>
      <VoiceSettings />
      <input
        type="search"
        className="song-search"
        placeholder="Search title or artist"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search songs"
      />
      <div className="song-filters" role="group" aria-label="Filter songs">
        {FILTERS.map(([name, test]) => (
          <button key={name} type="button" aria-pressed={filter === name} onClick={() => setFilter(name)}>
            {name} <span className="filter-count">{songs.filter(test).length}</span>
          </button>
        ))}
      </div>
      <ul className="song-list">
        {shown.map((song) => (
          <li key={song.slug}>
            <Link to={`/songs/${song.slug}`} className="song-list-item">
              <span className="song-title">{song.title}</span>
              <span className="song-artist">{song.artist}</span>
              {coverCount(song) > 0 && (
                <span className="version-badge" title={`${coverCount(song)} covers`}>
                  {coverCount(song)}
                </span>
              )}
              {song.originalKey && <span className="song-key">Key: {song.originalKey}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
