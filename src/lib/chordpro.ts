// Minimal ChordPro-style line parser: "[C]Some [G]lyrics" -> tokens of
// { chord?, text } used to render chords positioned above the lyrics.

export interface ChordProToken {
  chord: string | null;
  text: string;
}

const TOKEN_RE = /\[([^\]]+)\]([^[]*)/g;

export function parseChordProLine(line: string): ChordProToken[] {
  const tokens: ChordProToken[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  TOKEN_RE.lastIndex = 0;

  // Text before the first chord bracket (rare, but handle it).
  const firstBracket = line.indexOf('[');
  if (firstBracket === -1) {
    return line.length ? [{ chord: null, text: line }] : [];
  }
  if (firstBracket > 0) {
    tokens.push({ chord: null, text: line.slice(0, firstBracket) });
  }

  while ((match = TOKEN_RE.exec(line)) !== null) {
    tokens.push({ chord: match[1], text: match[2] });
    lastIndex = TOKEN_RE.lastIndex;
  }
  if (lastIndex < line.length && lastIndex !== 0) {
    // covered by the loop's captured text already
  }
  return tokens;
}
