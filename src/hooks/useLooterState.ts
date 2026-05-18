// ============================================================================
// FILE: hooks/useLooterState.ts
// PURPOSE: Page-owned state for the Looter feature with localStorage persistence.
//
// State shape:
//   - stageBucket: per-stage priority bucket. Skipped stages are removed from
//     material demand entirely.
//   - lineDone: set of completed line ids. Stage completion is DERIVED from
//     this — never stored as a separate flag, so unticking any line reopens
//     the stage. Load-bearing design contract from Phase 2.
//   - goalOn: per-goal (project/event/bench) on/off toggle.
//
// Persistence:
//   - Single versioned key in localStorage. On mount, hydrate from storage;
//     `initial` is only applied for first-time visitors (no stored entry).
//   - `Set` is serialized as an array (JSON can't represent Sets natively).
//   - If the stored blob is malformed, fall back to `initial` and log.
// ============================================================================

import { useCallback, useEffect, useState } from "react";
import type { Bucket } from "../components/looter/types";

export interface LooterState {
  stageBucket: Record<string, Bucket>;
  lineDone: Set<string>;
}

export interface LooterActions {
  setBucket: (stageId: string, bucket: Bucket) => void;
  toggleLine: (lineId: string) => void;
}
const STORAGE_KEY = "arc-kits.looter.v1";

interface StoredShape {
  stageBucket: Record<string, Bucket>;
  lineDone: string[];
}

function serialize(state: LooterState): string {
  const payload: StoredShape = {
    stageBucket: state.stageBucket,
    lineDone: Array.from(state.lineDone),
  };
  return JSON.stringify(payload);
}

function loadFromStorage(): LooterState | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === null) return null;
  try {
    const parsed = JSON.parse(raw) as StoredShape;
    return {
      stageBucket: parsed.stageBucket ?? {},
      lineDone: new Set(parsed.lineDone ?? []),
    };
  } catch (err) {
    console.warn("[useLooterState] failed to parse stored state, resetting", err);
    return null;
  }
}

function buildInitial(initial: Partial<LooterState>): LooterState {
  return {
    stageBucket: initial.stageBucket ?? {},
    lineDone: initial.lineDone ?? new Set(),
  };
}

export function useLooterState(initial: Partial<LooterState> = {}): LooterState & LooterActions {
  const [state, setState] = useState<LooterState>(() => loadFromStorage() ?? buildInitial(initial));

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, serialize(state));
    } catch (err) {
      console.warn("[useLooterState] failed to persist state", err);
    }
  }, [state]);

  const setBucket = useCallback((stageId: string, bucket: Bucket) => {
    setState((prev) => ({ ...prev, stageBucket: { ...prev.stageBucket, [stageId]: bucket } }));
  }, []);

  const toggleLine = useCallback((lineId: string) => {
    setState((prev) => {
      const next = new Set(prev.lineDone);
      if (next.has(lineId)) next.delete(lineId);
      else next.add(lineId);
      return { ...prev, lineDone: next };
    });
  }, []);

  return {
    ...state,
    setBucket,
    toggleLine,
  };
}
