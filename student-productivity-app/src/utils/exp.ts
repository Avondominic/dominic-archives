import { Priority, Task } from '../types';

/**
 * EXP & Leveling design
 * -----------------------------------------------------------------------
 * Base EXP comes from a task's estimated duration, run through a square
 * root curve (not linear) so a 4-hour task isn't literally 4x a 1-hour
 * task — this keeps students from gaming the system by inflating
 * duration estimates. A Priority tag then acts as a multiplier, so a
 * short-but-important task ("Submit scholarship form", 20 min, High)
 * can out-earn a long-but-trivial one ("Reorganize desk", 3 hours, Low).
 * An on-time completion bonus (or a small penalty for finishing after
 * the deadline) rewards actually respecting the schedule the student
 * set for themselves, not just checking boxes eventually.
 *
 * See README.md ("EXP & Progression Logic") for the full rationale.
 */

export const PRIORITY_MULTIPLIER: Record<Priority, number> = {
  Low: 0.75,
  Medium: 1.0,
  High: 1.4,
};

const EXP_PER_SQRT_MINUTE = 8;
const MIN_TASK_EXP = 5;
const ON_TIME_BONUS = 1.15;
const LATE_PENALTY = 0.9;

/** EXP required to go from `level` to `level + 1`. Grows super-linearly
 * so early levels come fast (hooks new users) and later levels take
 * sustained effort (keeps the Einstein tier meaningful). */
export function expForLevel(level: number): number {
  return Math.round(100 * Math.pow(Math.max(level, 1), 1.35));
}

export function calculateTaskExp(task: {
  durationMinutes: number;
  priority: Priority;
  deadline?: string;
  completedAt: string;
}): number {
  const base = Math.sqrt(Math.max(task.durationMinutes, 1)) * EXP_PER_SQRT_MINUTE;
  let exp = base * PRIORITY_MULTIPLIER[task.priority];

  if (task.deadline) {
    const onTime = new Date(task.completedAt).getTime() <= new Date(task.deadline).getTime();
    exp *= onTime ? ON_TIME_BONUS : LATE_PENALTY;
  }

  return Math.max(MIN_TASK_EXP, Math.round(exp));
}

export interface RankTier {
  name: string;
  minLevel: number;
}

/** Six rank tiers spread across a much larger range of numeric levels,
 * so progression still feels alive after a user "reaches" a tier —
 * e.g. Einstein starts at level 26 but keeps climbing indefinitely. */
export const RANK_TIERS: RankTier[] = [
  { name: 'Noob', minLevel: 1 },
  { name: 'Avg Avg', minLevel: 6 },
  { name: 'Try Hard', minLevel: 11 },
  { name: 'Geek', minLevel: 16 },
  { name: 'Nerd', minLevel: 21 },
  { name: 'Einstein', minLevel: 26 },
];

export function getRankForLevel(level: number): RankTier {
  let current = RANK_TIERS[0];
  for (const tier of RANK_TIERS) {
    if (level >= tier.minLevel) current = tier;
  }
  return current;
}

export function getNextRank(level: number): RankTier | null {
  const current = getRankForLevel(level);
  const idx = RANK_TIERS.findIndex((t) => t.name === current.name);
  return RANK_TIERS[idx + 1] ?? null;
}

export interface ExpGainResult {
  level: number;
  expIntoLevel: number;
  expToNextLevel: number;
  leveledUp: boolean;
  levelsGained: number;
}

/** Applies a raw EXP gain to a (level, expIntoLevel) pair, carrying the
 * remainder over any number of level-ups in one go. */
export function applyExpGain(
  currentLevel: number,
  currentExpIntoLevel: number,
  gained: number
): ExpGainResult {
  let level = currentLevel;
  let exp = currentExpIntoLevel + gained;
  let needed = expForLevel(level);
  let levelsGained = 0;

  while (exp >= needed) {
    exp -= needed;
    level += 1;
    levelsGained += 1;
    needed = expForLevel(level);
  }

  return {
    level,
    expIntoLevel: exp,
    expToNextLevel: needed,
    leveledUp: levelsGained > 0,
    levelsGained,
  };
}

export function previewTaskExp(task: Pick<Task, 'durationMinutes' | 'priority' | 'deadline'>): number {
  return calculateTaskExp({ ...task, completedAt: new Date().toISOString() });
}
