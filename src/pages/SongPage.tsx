import { Link, useParams } from 'react-router-dom';
import { getSongBySlug } from '../data/songs';
import { TransposeControls } from '../components/TransposeControls';
import { KeyPreference } from '../components/KeyPreference';
import { LeadSheetStaff } from '../components/LeadSheetStaff';
import { useGlobalPrefs, useSongPrefs } from '../lib/prefs';
import { shouldPreferFlats, transposeKeyLabel } from '../lib/theory';
import { computeVocalRange } from '../lib/leadsheet';

export function SongPage() {
  const { slug } = useParams<{ slug: string }>();
  const song = slug ? getSongBySlug(slug) : undefined;
  const [globalPrefs, setGlobalPrefs] = useGlobalPrefs();
  const [songPrefs, setSongPrefs] = useSongPrefs(slug ?? 'unknown');

  if (!song) {
    return (
      <div className="page">
        <p>Song not found.</p>
        <Link to="/">Back to the library</Link>
      </div>
    );
  }

  const preferFlats = shouldPreferFlats(song.originalKey);
  const vocalRange = computeVocalRange(song.leadSheet, songPrefs.semitones, preferFlats);
  const displayedKey = transposeKeyLabel(song.originalKey, songPrefs.semitones, globalPrefs.system, preferFlats);

  return (
    <div className="page song-page">
      <Link to="/" className="back-link">
        ← Library
      </Link>
      <h1>{song.title}</h1>
      <p className="song-meta">
        {song.artist}
        {song.composer ? ` · written by ${song.composer}` : ''}
      </p>

      {(song.capo || song.tuning) && (
        <p className="song-setup">
          {song.capo ? (
            <span className="song-setup-item">
              <strong>Capo {song.capo}</strong>
              {song.soundingKey ? ` — chords written in ${song.originalKey}, sounds in ${song.soundingKey}` : ''}
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
        <span>
          <strong>Key</strong> {displayedKey}
        </span>
        <span>
          <strong>Meter</strong> {song.timeSignature}
        </span>
        <span>
          <strong>Tempo</strong> {song.tempoMarking ? `${song.tempoMarking}, ` : ''}♩ = {song.tempoBpm}
        </span>
        {vocalRange && (
          <span>
            <strong>Vocal range</strong> {vocalRange.low}–{vocalRange.high}
          </span>
        )}
      </div>

      {(song.links.spotify || song.links.youtube) && (
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
        </div>
      )}

      <TransposeControls
        originalKey={song.originalKey}
        semitones={songPrefs.semitones}
        onSemitonesChange={(n) => setSongPrefs({ ...songPrefs, semitones: n })}
        system={globalPrefs.system}
        onSystemChange={(s) => setGlobalPrefs({ ...globalPrefs, system: s })}
      />

      {song.leadSheet && song.leadSheet.length > 0 && (
        <div className="lead-sheet">
          <div className="lead-sheet-header">
            <h2>Lead sheet</h2>
            <div className="lead-sheet-legend">
              <span className="legend-swatch melody">Melody</span>
              <span className="legend-swatch bass">Bass &amp; embellishments</span>
              <button
                type="button"
                className={`bass-toggle ${globalPrefs.showBass ? 'active' : ''}`}
                onClick={() => setGlobalPrefs({ ...globalPrefs, showBass: !globalPrefs.showBass })}
              >
                {globalPrefs.showBass ? 'Hide' : 'Show'} bass &amp; embellishments
              </button>
            </div>
          </div>
          <LeadSheetStaff
            systems={song.leadSheet}
            timeSignature={song.timeSignature}
            semitones={songPrefs.semitones}
            preferFlats={preferFlats}
            chordSystem={globalPrefs.system}
            showBass={globalPrefs.showBass}
          />
        </div>
      )}

      {song.history && (
        <div className="song-history">
          <h2>History &amp; trivia</h2>
          <p>{song.history}</p>
        </div>
      )}

      <KeyPreference
        originalKey={song.originalKey}
        preferredKey={songPrefs.preferredKey}
        note={songPrefs.note}
        system={globalPrefs.system}
        onSave={(preferredKey, note) => setSongPrefs({ ...songPrefs, preferredKey, note })}
        onApply={(semitones) => setSongPrefs({ ...songPrefs, semitones })}
      />

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
