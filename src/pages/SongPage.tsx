import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getSongBySlug } from '../data/songs';
import { instagramAuthors } from '../data/songs/instagramAuthors';
import { TransposeControls } from '../components/TransposeControls';
import { KeyPreference } from '../components/KeyPreference';
import { ScoreViewer } from '../components/ScoreViewer';
import { useGlobalPrefs, useSongPrefs } from '../lib/prefs';
import { shouldPreferFlats, transposeKeyLabel } from '../lib/theory';
import { loadSongScore, hasScore } from '../lib/songLoader';
import type { Score } from '../lib/score';
import { accordiESpartitiUrl, ultimateGuitarUrl } from '../lib/chordLinks';

// Keyed by slug so score/loading state resets when navigating between songs.
export function SongPage() {
  const { slug } = useParams<{ slug: string }>();
  return <SongPageContent key={slug} slug={slug} />;
}

function SongPageContent({ slug }: { slug?: string }) {
  const song = slug ? getSongBySlug(slug) : undefined;
  const [globalPrefs, setGlobalPrefs] = useGlobalPrefs();
  const [songPrefs, setSongPrefs] = useSongPrefs(slug ?? 'unknown');
  const [score, setScore] = useState<Score | null>(null);
  const [scoreLoading, setScoreLoading] = useState(false);

  // Load score if available
  useEffect(() => {
    if (song && hasScore(song)) {
      setScoreLoading(true);
      loadSongScore(song).then((loadedScore) => {
        setScore(loadedScore);
        setScoreLoading(false);
      });
    }
  }, [song]);

  if (!song) {
    return (
      <div className="page">
        <p>Song not found.</p>
        <Link to="/">Back to the library</Link>
      </div>
    );
  }

  const originalKey = song.originalKey;
  const preferFlats = originalKey ? shouldPreferFlats(originalKey) : false;
  const displayedKey = originalKey
    ? transposeKeyLabel(originalKey, songPrefs.semitones, globalPrefs.system, preferFlats)
    : null;
  // A capo raises what sounds, so the shapes you finger sit that many
  // semitones *below* the key on the page. Derived rather than stored, so it
  // stays right when the chart is transposed.
  const capoShapeKey = song.capo && originalKey
    ? transposeKeyLabel(originalKey, songPrefs.semitones - song.capo, globalPrefs.system, preferFlats)
    : null;

  return (
    <div className="page song-page">
      <Link to="/" className="back-link">
        ← Library
      </Link>
      <div className="song-heading">
        {song.albumImage && <img className="album-cover" src={song.albumImage} alt="" width={96} height={96} />}
        <div>
          <h1>{song.title}</h1>
          <p className="song-meta">
            {song.artist}
            {song.composer ? ` · written by ${song.composer}` : ''}
          </p>
        </div>
      </div>

      {(song.capo || song.tuning) && (
        <p className="song-setup">
          {song.capo ? (
            <span className="song-setup-item">
              <strong>Capo {song.capo} if you want it</strong> — fingers the song in {capoShapeKey}; the
              chart below stays in {displayedKey}
            </span>
          ) : null}
          {song.tuning ? (
            <span className="song-setup-item">
              <strong>Tuning</strong> {song.tuning}
            </span>
          ) : null}
        </p>
      )}

      <div className="song-facts">
        {displayedKey && (
          <span>
            <strong>Key</strong> {displayedKey}
          </span>
        )}
        {!displayedKey && song.keyEstimate && (
          <span className="key-estimate">
            <strong>{song.keyEstimate.key ? 'Key' : 'Possible keys'}</strong>{' '}
            {song.keyEstimate.key ?? song.keyEstimate.candidates?.join(' · ')}{' '}
            <span className="key-sources">
              (
              {song.keyEstimate.sources.map((s, i) => (
                <span key={s.url}>
                  {i > 0 && ', '}
                  <a href={s.url} target="_blank" rel="noreferrer noopener">
                    {s.source}
                  </a>
                  {!song.keyEstimate?.key && `: ${s.key}`}
                </span>
              ))}
              )
            </span>
          </span>
        )}
        {song.timeSignature && (
          <span>
            <strong>Meter</strong> {song.timeSignature}
          </span>
        )}
        {song.tempoBpm && (
          <span>
            <strong>Tempo</strong> {song.tempoMarking ? `${song.tempoMarking}, ` : ''}♩ = {song.tempoBpm}
          </span>
        )}
      </div>

      <div className="song-links">
        {song.links.spotify && (
          <a href={song.links.spotify} target="_blank" rel="noreferrer noopener" className="link-pill spotify">
            Listen on Spotify
          </a>
        )}
        {song.links.youtube && (
          <a href={song.links.youtube} target="_blank" rel="noreferrer noopener" className="link-pill youtube">
            Watch on YouTube
          </a>
        )}
        {!song.classical && (
          <>
            <a href={accordiESpartitiUrl(song)} target="_blank" rel="noreferrer noopener" className="link-pill accordi">
              Accordi&amp;Spartiti
            </a>
            <a href={ultimateGuitarUrl(song)} target="_blank" rel="noreferrer noopener" className="link-pill ug">
              Ultimate Guitar
            </a>
          </>
        )}
      </div>

      {(song.links.spotifyVersions?.length || song.links.instagram?.length) ? (
        <div className="song-saved-posts">
          <h2>Other versions</h2>
          <ul>
            {song.links.spotifyVersions?.map((v) => (
              <li key={v.url}>
                <a href={v.url} target="_blank" rel="noreferrer noopener">
                  {v.artist}
                  {v.note ? ` · ${v.note}` : ''}
                </a>{' '}
                <span className="version-source">Spotify</span>
              </li>
            ))}
            {song.links.instagram?.map((url, i) => (
              <li key={url}>
                <a href={url} target="_blank" rel="noreferrer noopener">
                  {instagramAuthors[url] ? `@${instagramAuthors[url]}` : `Post ${i + 1}`}
                </a>{' '}
                <span className="version-source">Instagram</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {originalKey && (
        <TransposeControls
          originalKey={originalKey}
          semitones={songPrefs.semitones}
          onSemitonesChange={(n) => setSongPrefs({ ...songPrefs, semitones: n })}
          system={globalPrefs.system}
          onSystemChange={(s) => setGlobalPrefs({ ...globalPrefs, system: s })}
        />
      )}

      {score && (
        <div className="score-viewer-container">
          <div className="lead-sheet-header">
            <h2>Score</h2>
            <span className="lead-sheet-legend">Full notation with melody, lyrics, and harmony</span>
          </div>
          <ScoreViewer
            score={score}
            semitones={songPrefs.semitones}
            preferFlats={preferFlats}
            chordSystem={globalPrefs.system === 'it' ? 'italian' : 'english'}
          />
        </div>
      )}

      {scoreLoading && !score && (
        <div className="score-viewer-loading">Loading score…</div>
      )}

      {!score && !scoreLoading && (
        <p className="score-unavailable">
          No score published for this song yet — it hasn't been through the audio-first transcription
          workflow.
        </p>
      )}

      {song.history && (
        <div className="song-history">
          <h2>History &amp; trivia</h2>
          <p>{song.history}</p>
        </div>
      )}

      {originalKey && (
        <KeyPreference
          originalKey={originalKey}
          preferredKey={songPrefs.preferredKey}
          note={songPrefs.note}
          system={globalPrefs.system}
          onSave={(preferredKey, note) => setSongPrefs({ ...songPrefs, preferredKey, note })}
          onApply={(semitones) => setSongPrefs({ ...songPrefs, semitones })}
        />
      )}

      {song.notes && (
        <p className="song-source-notes">
          {song.notes}
          {song.links.sheetMusic && (
            <>
              {' '}
              <a href={song.links.sheetMusic} target="_blank" rel="noreferrer noopener">
                Check it against the published sheet music
              </a>
              .
            </>
          )}
        </p>
      )}
    </div>
  );
}
