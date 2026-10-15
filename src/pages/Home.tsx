import { useState } from 'react';
import { Link } from 'react-router-dom';
import { songs } from '../data/songs';

export function Home() {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const shown = q ? songs.filter((s) => `${s.title} ${s.artist}`.toLowerCase().includes(q)) : songs;

  return (
    <div className="page home-page">
      <h1>Song Library</h1>
      <p className="subtitle">Lead sheets — melody, chords, bass line and lyrics. Transposable, in Italian or English chord notation.</p>
      <input
        type="search"
        className="song-search"
        placeholder="Search title or artist"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search songs"
      />
      <ul className="song-list">
        {shown.map((song) => (
          <li key={song.slug}>
            <Link to={`/songs/${song.slug}`} className="song-list-item">
              <span className="song-title">{song.title}</span>
              <span className="song-artist">{song.artist}</span>
              {song.originalKey && <span className="song-key">Key: {song.originalKey}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
