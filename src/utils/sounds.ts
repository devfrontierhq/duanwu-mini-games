// Synthesised sound effects via Web Audio API — no audio files needed

let ctx: AudioContext | null = null;

function ac(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

function tone(
  freq: number,
  dur: number,
  wave: OscillatorType = 'sine',
  vol = 0.22,
  offset = 0,
) {
  const c = ac();
  const osc = c.createOscillator();
  const gain = c.createGain();
  const t = c.currentTime + offset;

  osc.type = wave;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(vol, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

  osc.connect(gain);
  gain.connect(c.destination);
  osc.start(t);
  osc.stop(t + dur + 0.01);
}

function sweep(
  startFreq: number,
  endFreq: number,
  dur: number,
  wave: OscillatorType = 'sawtooth',
  vol = 0.2,
) {
  const c = ac();
  const osc = c.createOscillator();
  const gain = c.createGain();
  const t = c.currentTime;

  osc.type = wave;
  osc.frequency.setValueAtTime(startFreq, t);
  osc.frequency.exponentialRampToValueAtTime(endFreq, t + dur);
  gain.gain.setValueAtTime(vol, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

  osc.connect(gain);
  gain.connect(c.destination);
  osc.start(t);
  osc.stop(t + dur + 0.01);
}

export const sfx = {
  // Short crisp tick on each correct arrow key
  arrowOk() {
    tone(1100, 0.055, 'sine', 0.13);
  },

  // Low buzz on wrong key
  arrowWrong() {
    sweep(220, 80, 0.14, 'square', 0.2);
  },

  // Two-note "dee-doo" when sequence is done and SPACE unlocks
  unlock() {
    tone(660, 0.09, 'sine', 0.2, 0);
    tone(990, 0.14, 'sine', 0.24, 0.08);
  },

  // Bright ascending arpeggio for PERFECT
  perfect() {
    tone(523, 0.1,  'sine', 0.22, 0);
    tone(659, 0.1,  'sine', 0.22, 0.07);
    tone(784, 0.28, 'sine', 0.28, 0.14);
  },

  // Single pleasant note for GOOD
  good() {
    tone(659, 0.22, 'sine', 0.2);
  },

  // Descending fail tone for MISS
  miss() {
    sweep(320, 90, 0.38, 'sawtooth', 0.2);
  },
};
