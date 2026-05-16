// ============================================================================
// FILE: hooks/useLooterState.ts
// PURPOSE: Page-owned state for the Looter feature (Phase 3 — in-memory only).
//
// State shape (stable across Phase 3 → Phase 5):
//   - stageBucket: per-stage priority bucket. Skipped stages are removed from
//     material demand entirely.
//   - lineDone: set of completed line ids. Stage completion is DERIVED from
//     this — never stored as a separate flag, so unticking any line reopens
//     the stage. Load-bearing design contract from Phase 2.
//   - goalOn: per-goal (project/event/bench) on/off toggle.
//   - benchTargetTier: target tier per bench (used for display hint only in
//     Phase 3; aggregator will read it in Phase 4).
//
// Phase 5 promotes this hook to read/write localStorage. The state shape and
// the public API stay identical.
// ============================================================================

import { useCallback, useState } from "react";
import type { Bucket } from "../components/looter/types";

export interface LooterState {
  stageBucket: Record<string, Bucket>;
  lineDone: Set<string>;
  goalOn: Record<string, boolean>;
  benchTargetTier: Record<string, number>;
}

export interface LooterActions {
  setBucket: (stageId: string, bucket: Bucket) => void;
  cycleBucket: (stageId: string) => void;
  toggleLine: (lineId: string) => void;
  toggleGoal: (goalId: string) => void;
  setBenchTargetTier: (benchId: string, tier: number) => void;
}

const CYCLE_ORDER: Bucket[] = ["hi", "soon", "evt", "skip"];

export function useLooterState(initial: Partial<LooterState> = {}): LooterState & LooterActions {
  const [stageBucket, setStageBucket] = useState<Record<string, Bucket>>(initial.stageBucket ?? {});
  const [lineDone, setLineDone] = useState<Set<string>>(initial.lineDone ?? new Set());
  const [goalOn, setGoalOn] = useState<Record<string, boolean>>(initial.goalOn ?? {});
  const [benchTargetTier, setBenchTargetTierState] = useState<Record<string, number>>(
    initial.benchTargetTier ?? {},
  );

  const setBucket = useCallback((stageId: string, bucket: Bucket) => {
    setStageBucket((prev) => ({ ...prev, [stageId]: bucket }));
  }, []);

  const cycleBucket = useCallback((stageId: string) => {
    setStageBucket((prev) => {
      const current = prev[stageId] ?? "soon";
      const i = CYCLE_ORDER.indexOf(current);
      const next = CYCLE_ORDER[(i + 1) % CYCLE_ORDER.length];
      return { ...prev, [stageId]: next };
    });
  }, []);

  const toggleLine = useCallback((lineId: string) => {
    setLineDone((prev) => {
      const next = new Set(prev);
      if (next.has(lineId)) next.delete(lineId);
      else next.add(lineId);
      return next;
    });
  }, []);

  const toggleGoal = useCallback((goalId: string) => {
    setGoalOn((prev) => ({ ...prev, [goalId]: !(prev[goalId] ?? false) }));
  }, []);

  const setBenchTargetTier = useCallback((benchId: string, tier: number) => {
    setBenchTargetTierState((prev) => ({ ...prev, [benchId]: tier }));
  }, []);

  return {
    stageBucket,
    lineDone,
    goalOn,
    benchTargetTier,
    setBucket,
    cycleBucket,
    toggleLine,
    toggleGoal,
    setBenchTargetTier,
  };
}
