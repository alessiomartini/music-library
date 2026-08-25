import { parseChordProLine } from '../lib/chordpro';
import { convertChord, type ChordSystem } from '../lib/theory';

interface Props {
  line: string;
  semitones: number;
  system: ChordSystem;
  preferFlats: boolean;
}

export function ChordLine({ line, semitones, system, preferFlats }: Props) {
  const tokens = parseChordProLine(line);
  if (tokens.length === 0) {
    return <div className="lyric-line lyric-line-empty">&nbsp;</div>;
  }

  return (
    <div className="lyric-line">
      {tokens.map((token, i) => (
        <span className="word" key={i}>
          {token.chord && (
            <span className="chord">{convertChord(token.chord, semitones, system, preferFlats)}</span>
          )}
          <span className="lyric-text">{token.text.trim() === '' ? '   ' : token.text}</span>
        </span>
      ))}
    </div>
  );
}
