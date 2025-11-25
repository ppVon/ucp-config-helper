export interface ScalingConfig {
  tierCaps: number[];

  weightCurrentTierBuff: number;
  weightDecayPerTier: number;
  weightMinFactor: number;

  minLevelScaling: number;
  avgLevelScaling: number;
  maxLevelScaling: number;

  tierCapScaling: number;
}

export interface TierStats {
  tier: number;
  baseCap: number;
  effectiveCap: number;
  levelMin: number;
  levelMode: number;
  levelMax: number;
  levelExpectedAvg: number;
  weightMultiplier: number;
}

export function getTierCap(tier: number, config: ScalingConfig): number {
  if (tier < 1 || tier > config.tierCaps.length) {
    throw new Error(`Tier ${tier} out of range for caps ${config.tierCaps}`);
  }
  return config.tierCaps[tier - 1];
}

export function computeWeightMultiplier(
  monTier: number,
  trainerTier: number,
  config: ScalingConfig
): number {
  if (monTier === trainerTier) {
    return config.weightCurrentTierBuff;
  }

  const diff = trainerTier - monTier;
  let multiplier =
    config.weightCurrentTierBuff - diff * config.weightDecayPerTier;
  if (multiplier < config.weightMinFactor) {
    multiplier = config.weightMinFactor;
  }
  return multiplier;
}

export function computeEffectiveCap(
  monTier: number,
  trainerTier: number,
  config: ScalingConfig
): number {
  const monCap = getTierCap(monTier, config);
  const trainerCap = getTierCap(trainerTier, config);

  if (monTier < trainerTier) {
    const diff = trainerCap - monCap;
    const buff = diff * config.tierCapScaling;
    return monCap + buff;
  }

  return monCap;
}

export function levelRangeFromCap(
  effectiveCap: number,
  config: ScalingConfig
): {
  min: number;
  mode: number;
  max: number;
  expectedAvg: number;
} {
  let min = Math.round(effectiveCap * config.minLevelScaling);
  let mode = Math.round(effectiveCap * config.avgLevelScaling);
  let max = Math.round(effectiveCap * config.maxLevelScaling);

  min = Math.max(1, min);
  if (mode < min) mode = min;
  if (max < mode) max = mode;

  const expectedAvg = (min + mode + max) / 3;

  if (max > 100) max = 100;

  return { min, mode, max, expectedAvg };
}

export function triangularDensity(
  x: number,
  min: number,
  mode: number,
  max: number
): number {
  if (x < min || x > max) return 0;
  if (min === max) return 1;
  if (x === mode) return 1;
  if (x < mode) {
    return (x - min) / (mode - min || 1);
  }
  return (max - x) / (max - mode || 1);
}

export function computeAllTierStats(
  trainerTier: number,
  config: ScalingConfig
): TierStats[] {
  const n = config.tierCaps.length;

  const stats: TierStats[] = [];

  for (let tier = 1; tier <= n; tier++) {
    const baseCap = getTierCap(tier, config);
    const effectiveCap = computeEffectiveCap(tier, trainerTier, config);
    const { min, mode, max, expectedAvg } = levelRangeFromCap(
      effectiveCap,
      config
    );
    const weightMultiplier = computeWeightMultiplier(tier, trainerTier, config);

    stats.push({
      tier,
      baseCap,
      effectiveCap,
      levelMin: min,
      levelMode: mode,
      levelMax: max,
      levelExpectedAvg: expectedAvg,
      weightMultiplier,
    });
  }

  return stats;
}

export const DEFAULT_CONFIG: ScalingConfig = {
  tierCaps: [15, 27, 40, 54, 69, 85, 100],

  weightCurrentTierBuff: 2,
  weightDecayPerTier: 0.2,
  weightMinFactor: 0.15,

  minLevelScaling: 0.45,
  avgLevelScaling: 0.75,
  maxLevelScaling: 1.1,

  tierCapScaling: 0.25,
};
