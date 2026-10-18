import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getSongBySlug } from '../data/songs';
import { instagramAuthors } from '../data/songs/instagramAuthors';
import { artists } from '../data/songs/artists';
import { songHistory } from '../data/songs/history';
import { photoForYear } from '../lib/artist';
import { TransposeControls } from '../components/TransposeControls';
import { KeyPreference } from '../components/KeyPreference';
import { KeySuggestion } from '../components/KeySuggestion';
import { VocalHistogram } from '../components/VocalHistogram';
import { vocalRanges } from '../data/songs/vocalRanges';
import { ProviderIcon } from '../components/ProviderIcon';
import { ScoreViewer } from '../components/ScoreViewer';
import { useGlobalPrefs, useSongPrefs } from '../lib/prefs';
import { shouldPreferFlats, transposeKeyLabel } from '../lib/theory';
import { loadSongScore, hasScore } from '../lib/songLoader';
import type { Score } from '../lib/score';
import type { SpotifyVersion } from '../lib/types';
import { accordiESpartitiUrl, ultimateGuitarUrl } from '../lib/chordLinks';

const languageName = new Intl.DisplayNames(['en'], { type: 'language' });

/** Videos by the same performer (and note) under one label: "Allie Sherlock · 2 · 3". */
function groupVersions(versions: SpotifyVersion[]): [string, SpotifyVersion[]][] {
  const groups = new Map<string, SpotifyVersion[]>();
  for (const v of versions) {
    const label = v.note ? `${v.artist} · ${v.note}` : v.artist;
    groups.set(label, [...(groups.get(label) ?? []), v]);
  }
  return [...groups.entries()];
}

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

  const wiki = songHistory[song.slug];
  const artistPhoto = photoForYear(artists[song.artist]?.photos ?? [], song.year);
  const originalKey = song.originalKey;
  const theoryTab = song.keyEstimate?.sources.find((s) => s.source === 'Hooktheory')?.url;
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
        {artistPhoto && (
          <a href={artistPhoto.page} target="_blank" rel="noreferrer noopener" className="artist-photo-link">
            <img className="artist-photo" src={artistPhoto.url} alt={song.artist} width={96} height={96} />
          </a>
        )}
        <div>
          <h1>{song.title}</h1>
          <p className="song-meta">
            {song.artist}
            {song.composer ? ` · written by ${song.composer}` : ''}
          </p>
        </div>
      </div>

      {artistPhoto && (
        <p className="photo-credit">
          Photo{artistPhoto.year ? ` (${artistPhoto.year})` : ''}: {artistPhoto.credit} ·{' '}
          <a href={artistPhoto.page} target="_blank" rel="noreferrer noopener">
            {artistPhoto.license}, Wikimedia Commons
          </a>
        </p>
      )}

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
        {wiki && (
          <a href={wiki.url} target="_blank" rel="noreferrer noopener" className="link-pill ug">
            Wikipedia
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
            {theoryTab && (
              <a href={theoryTab} target="_blank" rel="noreferrer noopener" className="link-pill ug">
                Hooktheory analysis
              </a>
            )}
          </>
        )}
      </div>

      {song.translations?.length ? (
        <div className="song-translations">
          <h2>In other languages</h2>
          <ul>
            {song.translations.map((t) => {
              const q = encodeURIComponent(`${t.title} ${t.artist}`);
              return (
                <li key={t.title} lang={t.language}>
                  <span>
                    <strong>{t.title}</strong> · {t.artist} · {languageName.of(t.language)}
                  </span>
                  <span className="translation-links">
                    <a href={t.spotify ?? `https://open.spotify.com/search/${q}`} target="_blank" rel="noreferrer noopener" className="link-pill spotify">
                      Spotify
                    </a>
                    <a href={t.youtube ?? `https://www.youtube.com/results?search_query=${q}`} target="_blank" rel="noreferrer noopener" className="link-pill youtube">
                      YouTube
                    </a>
                    <a href={`https://www.musixmatch.com/search?query=${q}`} target="_blank" rel="noreferrer noopener" className="link-pill ug">
                      Lyrics
                    </a>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      <KeySuggestion
        keys={originalKey ? [originalKey] : song.keyEstimate?.key ? [song.keyEstimate.key] : (song.keyEstimate?.candidates ?? [])}
        artist={artists[song.artist]}
        system={globalPrefs.system}
        onApply={originalKey ? (semitones) => setSongPrefs({ ...songPrefs, semitones }) : undefined}
      />

      {vocalRanges[song.slug] && (
        <VocalHistogram profile={vocalRanges[song.slug]} system={globalPrefs.system} />
      )}

      {(song.links.spotifyVersions?.length || song.links.youtubeVersions?.length || song.links.instagram?.length) ? (
        <div className="song-saved-posts">
          <h2>Other versions</h2>
          <ul>
            {song.links.spotifyVersions?.map((v) => (
              <li key={v.url}>
                <a href={v.url} target="_blank" rel="noreferrer noopener">
                  <ProviderIcon provider="spotify" /> {v.artist}
                  {v.note ? ` · ${v.note}` : ''}
                </a>
              </li>
            ))}
            {groupVersions(song.links.youtubeVersions ?? []).map(([label, videos]) => (
              <li key={videos[0].url}>
                <a href={videos[0].url} target="_blank" rel="noreferrer noopener">
                  <ProviderIcon provider="youtube" /> {label}
                </a>
                {videos.length > 1 &&
                  videos.slice(1).map((v, i) => (
                    <span key={v.url}>
                      {' · '}
                      <a href={v.url} target="_blank" rel="noreferrer noopener" className="more-video">
                        {i + 2}
                      </a>
                    </span>
                  ))}
              </li>
            ))}
            {song.links.instagram?.map((url, i) => (
              <li key={url}>
                <a href={url} target="_blank" rel="noreferrer noopener">
                  <ProviderIcon provider="instagram" /> {instagramAuthors[url] ? `@${instagramAuthors[url]}` : `Post ${i + 1}`}
                </a>
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

      {(song.history || wiki) && (
        <div className="song-history">
          <h2>History &amp; trivia</h2>
          {song.history && <p>{song.history}</p>}
          {wiki && (
            <>
              <p lang={wiki.lang}>{wiki.text}</p>
              <p className="history-source">
                From{' '}
                <a href={wiki.url} target="_blank" rel="noreferrer noopener">
                  Wikipedia
                </a>{' '}
                · text available under{' '}
                <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer noopener">
                  CC BY-SA 4.0
                </a>
              </p>
            </>
          )}
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
