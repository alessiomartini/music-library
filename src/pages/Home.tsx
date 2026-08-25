import { Link } from 'react-router-dom';
import { songs } from '../data/songs';

export function Home() {
  return (
    <div className="page home-page">
      <h1>Song Library</h1>
      <p className="subtitle">Lead sheets — melody, chords, bass line and lyrics. Transposable, in Italian or English chord notation.</p>
      <ul className="song-list">
        {songs.map((song) => (
          <li key={song.slug}>
            <Link to={`/songs/${song.slug}`} className="song-list-item">
              <span className="song-title">{song.title}</span>
              <span className="song-artist">{song.artist}</span>
              <span className="song-key">Key: {song.originalKey}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
