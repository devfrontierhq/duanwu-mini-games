import { useReducer, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import type { Arrow, HitQuality, GameState, GamePhase } from '../types';
import {
  GAME_DURATION, SCORE, BOAT_DELTA, DRIFT_AMOUNT, DRIFT_INTERVAL,
  BAR_DURATION_START, BAR_DURATION_MIN, BAR_DURATION_DEC,
} from '../config';
import { sfx } from '../utils/sounds';

const ARROWS: Arrow[] = ['↑', '↓', '←', '→'];
const ARROW_MAP: Record<string, Arrow> = {
  ArrowUp: '↑', ArrowDown: '↓', ArrowLeft: '←', ArrowRight: '→',
};

const ACTIVE_PHASES: GamePhase[] = ['playing', 'feedback'];

function randomSeq(len: number): Arrow[] {
  return Array.from({ length: len }, () => ARROWS[Math.floor(Math.random() * 4)]);
}

function seqLen(round: number) {
  if (round < 5) return 3;
  if (round < 10) return 4;
  if (round < 16) return 5;
  return 6;
}

function comboMult(combo: number) {
  if (combo >= 10) return 2;
  if (combo >= 5) return 1.5;
  return 1;
}

function barDuration(round: number) {
  return Math.max(BAR_DURATION_MIN, BAR_DURATION_START - (round - 1) * BAR_DURATION_DEC);
}

// Hit zones: bar moves left→right (0→100%)
// Too early (<40%) = MISS, early (40-65%) = GOOD, sweet (65-85%) = PERFECT,
// slightly late (85-95%) = GOOD, too late (>95%) = MISS, reaching end = auto-MISS
function evalHit(pct: number): HitQuality {
  if (pct < 0.40) return 'miss';
  if (pct < 0.65) return 'good';
  if (pct < 0.85) return 'perfect';
  if (pct < 0.95) return 'good';
  return 'miss';
}

const initial: GameState = {
  phase: 'start',
  score: 0, combo: 0, maxCombo: 0,
  timeLeft: GAME_DURATION,
  boatProgress: 0,
  sequence: [], inputIndex: 0, sequenceDone: false, roundCount: 0,
  wrongKey: false, feedbackType: null, feedbackPoints: 0, isWin: false,
  driftPaused: false, paused: false,
};

type Action =
  | { type: 'START' }
  | { type: 'ARROW'; key: Arrow }
  | { type: 'CLEAR_SHAKE' }
  | { type: 'HIT'; quality: HitQuality }
  | { type: 'NEXT_ROUND' }
  | { type: 'TICK' }
  | { type: 'DRIFT' }
  | { type: 'RESUME_DRIFT' }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'RESET' };

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'START': {
      const round = 1;
      return { ...initial, phase: 'playing', roundCount: round, sequence: randomSeq(seqLen(round)) };
    }

    case 'ARROW': {
      if (state.phase !== 'playing' || state.wrongKey || state.sequenceDone) return state;
      if (action.key === state.sequence[state.inputIndex]) {
        const next = state.inputIndex + 1;
        return { ...state, inputIndex: next, sequenceDone: next >= state.sequence.length };
      }
      return { ...state, wrongKey: true, driftPaused: true };
    }

    case 'CLEAR_SHAKE':
      if (state.phase !== 'playing') return state;
      return { ...state, wrongKey: false, inputIndex: 0 };

    case 'HIT': {
      if (state.phase !== 'playing') return state;
      const { quality } = action;
      const newCombo = quality === 'miss' ? 0 : state.combo + 1;
      const multi = comboMult(newCombo);
      const points = Math.round(SCORE[quality] * multi);
      const boat = Math.max(0, Math.min(100, state.boatProgress + BOAT_DELTA[quality]));
      return {
        ...state,
        phase: 'feedback',
        score: state.score + points,
        combo: newCombo,
        maxCombo: Math.max(state.maxCombo, newCombo),
        boatProgress: boat,
        feedbackType: quality,
        feedbackPoints: points,
        driftPaused: quality === 'miss',
      };
    }

    case 'NEXT_ROUND': {
      if (state.phase !== 'feedback') return state;
      if (state.boatProgress >= 100) return { ...state, phase: 'gameover', isWin: true };
      const round = state.feedbackType !== 'miss' ? state.roundCount + 1 : state.roundCount;
      return {
        ...state,
        phase: 'playing',
        roundCount: round,
        sequence: randomSeq(seqLen(round)),
        inputIndex: 0,
        sequenceDone: false,
        feedbackType: null,
        wrongKey: false,
      };
    }

    case 'TICK': {
      if (!ACTIVE_PHASES.includes(state.phase)) return state;
      if (state.timeLeft <= 1) return { ...state, timeLeft: 0, phase: 'gameover', isWin: false };
      return { ...state, timeLeft: state.timeLeft - 1 };
    }

    case 'DRIFT': {
      if (!ACTIVE_PHASES.includes(state.phase) || state.driftPaused) return state;
      const boat = Math.min(100, state.boatProgress + DRIFT_AMOUNT);
      if (boat >= 100) return { ...state, boatProgress: 100, phase: 'gameover', isWin: true };
      return { ...state, boatProgress: boat };
    }

    case 'RESUME_DRIFT':
      return { ...state, driftPaused: false };

    case 'PAUSE':
      if (!ACTIVE_PHASES.includes(state.phase)) return state;
      return { ...state, paused: true };

    case 'RESUME':
      return { ...state, paused: false };

    case 'RESET':
      return initial;

    default:
      return state;
  }
}

export function useGame() {
  const [state, dispatch] = useReducer(reducer, initial);
  const stateRef = useRef(state);
  useLayoutEffect(() => { stateRef.current = state; });

  const sliderPosRef = useRef(0);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  // Game timer
  useEffect(() => {
    if (!ACTIVE_PHASES.includes(state.phase) || state.paused) return;
    const id = setInterval(() => dispatch({ type: 'TICK' }), 1000);
    return () => clearInterval(id);
  }, [state.phase, state.paused]);

  // Background drift
  useEffect(() => {
    if (!ACTIVE_PHASES.includes(state.phase) || state.paused) return;
    const id = setInterval(() => dispatch({ type: 'DRIFT' }), DRIFT_INTERVAL);
    return () => clearInterval(id);
  }, [state.phase, state.paused]);

  // Resume drift after wrong-key or miss pause
  useEffect(() => {
    if (!state.driftPaused || state.paused) return;
    const id = setTimeout(() => dispatch({ type: 'RESUME_DRIFT' }), 1000);
    return () => clearTimeout(id);
  }, [state.driftPaused, state.paused]);

  // Timing bar: starts with round, moves left→right, reaching end = auto-MISS
  useEffect(() => {
    if (state.phase !== 'playing') return;

    sliderPosRef.current = 0;
    if (indicatorRef.current) indicatorRef.current.style.left = '0px';

    const duration = barDuration(state.roundCount);
    const startTime = performance.now();
    let totalPaused = 0;
    let pauseStart: number | null = null;
    let rafId: number;

    const tick = (now: number) => {
      const isPaused = stateRef.current.paused;

      if (isPaused) {
        if (pauseStart === null) pauseStart = now;
        rafId = requestAnimationFrame(tick);
        return;
      }
      if (pauseStart !== null) {
        totalPaused += now - pauseStart;
        pauseStart = null;
      }

      const progress = Math.min(1, (now - startTime - totalPaused) / duration);
      const barWidth = barRef.current?.offsetWidth ?? 500;
      const xPos = progress * barWidth;

      sliderPosRef.current = xPos;
      if (indicatorRef.current) indicatorRef.current.style.left = `${xPos}px`;

      if (progress >= 1) {
        dispatch({ type: 'HIT', quality: 'miss' });
        return;
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [state.phase, state.roundCount]);

  // Clear wrong-key shake, reset sequence input
  useEffect(() => {
    if (!state.wrongKey || state.paused) return;
    const id = setTimeout(() => dispatch({ type: 'CLEAR_SHAKE' }), 380);
    return () => clearTimeout(id);
  }, [state.wrongKey, state.paused]);

  // Auto-advance from feedback to next round
  useEffect(() => {
    if (state.phase !== 'feedback' || state.paused) return;
    const delay = state.feedbackType === 'miss' ? 850 : 500;
    const id = setTimeout(() => dispatch({ type: 'NEXT_ROUND' }), delay);
    return () => clearTimeout(id);
  }, [state.phase, state.feedbackType, state.paused]);

  // Sequence unlock sound
  useEffect(() => {
    if (state.sequenceDone) sfx.unlock();
  }, [state.sequenceDone]);

  // Hit quality sounds
  useEffect(() => {
    if (!state.feedbackType) return;
    if (state.feedbackType === 'perfect') sfx.perfect();
    else if (state.feedbackType === 'good') sfx.good();
    else sfx.miss();
  }, [state.feedbackType]);

  const togglePause = useCallback(() => {
    const s = stateRef.current;
    if (!ACTIVE_PHASES.includes(s.phase)) return;
    dispatch({ type: s.paused ? 'RESUME' : 'PAUSE' });
  }, []);

  const handleSpace = useCallback(() => {
    const s = stateRef.current;
    if (s.phase !== 'playing' || !s.sequenceDone || s.paused) return;
    const barWidth = barRef.current?.offsetWidth ?? 500;
    const quality = evalHit(sliderPosRef.current / barWidth);
    dispatch({ type: 'HIT', quality });
  }, []);

  const handleArrow = useCallback((key: Arrow) => {
    const s = stateRef.current;
    if (s.phase !== 'playing' || s.wrongKey || s.sequenceDone || s.paused) return;
    // Play sound immediately before dispatch for zero-latency feedback
    if (key === s.sequence[s.inputIndex]) {
      sfx.arrowOk();
    } else {
      sfx.arrowWrong();
    }
    dispatch({ type: 'ARROW', key });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); togglePause(); return; }
      if (e.key === ' ') { e.preventDefault(); handleSpace(); return; }
      const arrow = ARROW_MAP[e.key];
      if (arrow) { e.preventDefault(); handleArrow(arrow); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleArrow, handleSpace, togglePause]);

  return {
    state,
    indicatorRef,
    barRef,
    start: () => dispatch({ type: 'START' }),
    reset: () => dispatch({ type: 'RESET' }),
    togglePause,
    handleArrow,
    handleSpace,
  };
}
