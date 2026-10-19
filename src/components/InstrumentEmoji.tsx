import { INSTRUMENTS, type Instrument } from '../lib/instruments';

/** Small instrument emoji with an accessible label; renders nothing without instruments. */
export function InstrumentEmoji({ instruments }: { instruments?: Instrument[] }) {
  if (!instruments?.length) return null;
  const label = instruments.map((i) => INSTRUMENTS[i].label).join(', ');
  return (
    <span className="instrument-emoji" role="img" aria-label={label} title={label}>
      {' '}
      {instruments.map((i) => INSTRUMENTS[i].emoji).join('')}
    </span>
  );
}
