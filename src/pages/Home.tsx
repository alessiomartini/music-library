import { Link } from 'react-router-dom';
import { songs } from '../data/songs';

export function Home() {
  return (
    <div className="page home-page">
      <h1>Libreria di canzoni</h1>
      <p className="subtitle">Testi, accordi e melodia sul pentagramma — trasponibili, in italiano o inglese.</p>
      <ul className="song-list">
        {songs.map((song) => (
          <li key={song.slug}>
            <Link to={`/canzoni/${song.slug}`} className="song-list-item">
              <span className="song-title">{song.title}</span>
              <span className="song-artist">{song.artist}</span>
              <span className="song-key">Tonalità: {song.originalKey}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
