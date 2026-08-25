import { Link, useParams } from 'react-router-dom';
import { getSongBySlug } from '../data/songs';
import { ChordLine } from '../components/ChordLine';
import { TransposeControls } from '../components/TransposeControls';
import { KeyPreference } from '../components/KeyPreference';
import { MelodyStaff } from '../components/MelodyStaff';
import { useGlobalPrefs, useSongPrefs } from '../lib/prefs';
import { shouldPreferFlats } from '../lib/theory';

export function SongPage() {
  const { slug } = useParams<{ slug: string }>();
  const song = slug ? getSongBySlug(slug) : undefined;
  const [globalPrefs, setGlobalPrefs] = useGlobalPrefs();
  const [songPrefs, setSongPrefs] = useSongPrefs(slug ?? 'unknown');

  if (!song) {
    return (
      <div className="page">
        <p>Brano non trovato.</p>
        <Link to="/">Torna alla libreria</Link>
      </div>
    );
  }

  const preferFlats = shouldPreferFlats(song.originalKey);

  return (
    <div className="page song-page">
      <Link to="/" className="back-link">
        ← Libreria
      </Link>
      <h1>{song.title}</h1>
      <p className="song-meta">{song.artist}</p>

      <TransposeControls
        originalKey={song.originalKey}
        semitones={songPrefs.semitones}
        onSemitonesChange={(n) => setSongPrefs({ ...songPrefs, semitones: n })}
        system={globalPrefs.system}
        onSystemChange={(s) => setGlobalPrefs({ ...globalPrefs, system: s })}
        capo={song.capo}
      />

      {song.melody?.map((line, i) => (
        <MelodyStaff key={i} melody={line} semitones={songPrefs.semitones} preferFlats={preferFlats} />
      ))}

      <div className="song-body">
        {song.sections.map((section, i) => (
          <div className="song-section" key={i}>
            <h2>{section.label}</h2>
            {section.lines.map((line, j) => (
              <ChordLine
                key={j}
                line={line}
                semitones={songPrefs.semitones}
                system={globalPrefs.system}
                preferFlats={preferFlats}
              />
            ))}
          </div>
        ))}
      </div>

      <KeyPreference
        originalKey={song.originalKey}
        preferredKey={songPrefs.preferredKey}
        note={songPrefs.note}
        system={globalPrefs.system}
        onSave={(preferredKey, note) => setSongPrefs({ ...songPrefs, preferredKey, note })}
        onApply={(semitones) => setSongPrefs({ ...songPrefs, semitones })}
      />

      {song.notes && <p className="song-source-notes">{song.notes}</p>}
    </div>
  );
}
