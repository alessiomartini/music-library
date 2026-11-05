import { useState } from 'react';
import { Link } from 'react-router-dom';
import { coverCount, songs } from '../data/songs';
import { VoiceSettings } from '../components/VoiceSettings';
import { mine } from '../data/songs/mine';
import { genres } from '../data/songs/genres';
import { popularity } from '../data/songs/popularity';
import { globalScores, score, type Order } from '../lib/ranking';
import type { Song } from '../lib/types';

const GLOBAL = globalScores(songs, popularity);
const ORDERS: [Order, string][] = [['mix', 'Mix'], ['mine', 'Mine'], ['global', 'Global']];
const VIEWS = ['Songs', 'Artists', 'Genres'] as const;
const NO_GENRE = 'No genre';

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

function SongRow({ song }: { song: Song }) {
  return (
    <li>
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
  );
}

/** Groups of songs under a heading, each group collapsed. */
function Groups({ groups }: { groups: [string, Song[]][] }) {
  return (
    <div className="song-groups">
      {groups.map(([name, list]) => (
        <details key={name}>
          <summary>
            {name} <span className="filter-count">{list.length}</span>
          </summary>
          <ul className="song-list">{list.map((s) => <SongRow key={s.slug} song={s} />)}</ul>
        </details>
      ))}
    </div>
  );
}

export function Home() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [order, setOrder] = useState<Order>('mix');
  const [view, setView] = useState<(typeof VIEWS)[number]>('Songs');
  const q = query.trim().toLowerCase();
  const keep = FILTERS.find(([name]) => name === filter)![1];
  const key = (s: Song) => score(order, mine[s.slug], GLOBAL.get(s.slug));
  const shown = songs.filter(
    (s) =>
      keep(s) &&
      (!q || [s.title, s.artist, ...(s.translations ?? []).flatMap((t) => [t.title, t.artist])].join(' ').toLowerCase().includes(q)),
  ).sort((a, b) => key(b) - key(a) || a.title.localeCompare(b.title));

  const group = (names: (s: Song) => string[]) => {
    const m = new Map<string, Song[]>();
    for (const s of shown) for (const n of names(s)) m.set(n, [...(m.get(n) ?? []), s]);
    return [...m];
  };
  // Artists: best-liked first (shown is already sorted). Genres: biggest first, "No genre" last.
  const byArtist = group((s) => [s.artist]);
  const byGenre = group((s) => genres[s.artist] ?? [NO_GENRE]).sort(
    ([a, x], [b, y]) => Number(a === NO_GENRE) - Number(b === NO_GENRE) || y.length - x.length || a.localeCompare(b),
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
      <div className="song-filters" role="group" aria-label="View">
        {VIEWS.map((v) => (
          <button key={v} type="button" aria-pressed={view === v} onClick={() => setView(v)}>{v}</button>
        ))}
      </div>
      <div className="song-filters" role="group" aria-label="Order by">
        <span className="filter-count">Order by</span>
        {ORDERS.map(([o, label]) => (
          <button key={o} type="button" aria-pressed={order === o} onClick={() => setOrder(o)}>{label}</button>
        ))}
      </div>
      <div className="song-filters" role="group" aria-label="Filter songs">
        {FILTERS.map(([name, test]) => (
          <button key={name} type="button" aria-pressed={filter === name} onClick={() => setFilter(name)}>
            {name} <span className="filter-count">{songs.filter(test).length}</span>
          </button>
        ))}
      </div>
      {view === 'Songs' && <ul className="song-list">{shown.map((song) => <SongRow key={song.slug} song={song} />)}</ul>}
      {view === 'Artists' && <Groups groups={byArtist} />}
      {view === 'Genres' && <Groups groups={byGenre} />}
    </div>
  );
}
