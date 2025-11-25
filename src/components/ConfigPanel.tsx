import React from "react";
import { ScalingConfig } from "../lib/scaling";
import { NumberInput } from "./NumberInput";

interface Props {
  config: ScalingConfig;
  trainerTier: number;
  onChangeConfig: (cfg: ScalingConfig) => void;
  onChangeTrainerTier: (tier: number) => void;
}

export const ConfigPanel: React.FC<Props> = ({
  config,
  trainerTier,
  onChangeConfig,
  onChangeTrainerTier,
}) => {
  const handleTierCountChange = (value: number) => {
    const n = Math.max(1, Math.floor(value || 1));
    const current = config.tierCaps;
    let nextCaps = current.slice(0, n);
    if (n > current.length) {
      const last = current[current.length - 1] || 10;
      for (let i = current.length; i < n; i++) {
        nextCaps.push(last + 10 * (i - current.length + 1));
      }
    }
    onChangeConfig({ ...config, tierCaps: nextCaps });
    if (trainerTier > n) onChangeTrainerTier(n);
  };

  const handleTierCapChange = (index: number, value: number) => {
    const caps = [...config.tierCaps];
    caps[index] = Math.max(1, Math.floor(value || 1));
    onChangeConfig({ ...config, tierCaps: caps });
  };

  const handleConfigNumber = (key: keyof ScalingConfig, value: number) => {
    const v = Number.isFinite(value) ? value : (config[key] as number);
    onChangeConfig({ ...config, [key]: v });
  };

  const handleExportSpawnConfig = () => {
    const spawnConfig = {
      doSpeciesBlocking: true, // tweak later if you expose these as toggles
      blockUnknownSpecies: true,
      doLevelScaling: true,
      tierCapScaling: config.tierCapScaling,
      minLevelScaling: config.minLevelScaling,
      avgLevelScaling: config.avgLevelScaling,
      maxLevelScaling: config.maxLevelScaling,
      doWeightScaling: true,
      weightDecayPerTier: config.weightDecayPerTier,
      weightMinFactor: config.weightMinFactor,
      weightCurrentTierBuff: config.weightCurrentTierBuff,
    };

    const json = JSON.stringify(spawnConfig, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "ucp-spawn.json";
    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);
  };

  return (
    <div
      style={{
        padding: "1rem",
        borderRadius: "0.5rem",
        border: "1px solid #444",
        marginBottom: "1rem",
      }}
    >
      <h2 style={{ fontSize: "1.8rem", marginTop: "0" }}>Configuration</h2>

      <div
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        }}
      >
        <div>
          <label style={{ fontSize: "1.2rem" }}>
            Number of tiers
            <NumberInput
              value={config.tierCaps.length}
              min={1}
              step={1}
              onChange={(v) => handleTierCountChange(v)}
            />
          </label>
        </div>

        <div></div>

        <div>
          <label style={{ fontSize: "1.2rem" }}>
            Player's Trainer tier
            <NumberInput
              value={trainerTier}
              min={1}
              max={config.tierCaps.length}
              step={1}
              onChange={(v) =>
                onChangeTrainerTier(
                  Math.min(config.tierCaps.length, Math.max(1, Number(v) || 1))
                )
              }
            />
          </label>
        </div>
      </div>

      <hr style={{ margin: "1rem 0" }} />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        <h3 style={{ fontSize: "1.8rem" }}>Scaling options</h3>
        <button
          type="button"
          onClick={handleExportSpawnConfig}
          style={{
            alignSelf: "center",
            padding: "0.4rem 0.8rem",
            fontSize: "0.9rem",
            borderRadius: "0.4rem",
            border: "1px solid #555",
            background: "#222",
            color: "#eee",
            cursor: "pointer",
          }}
        >
          Export <code>ucp-spawn.json</code>
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: "1rem",
          width: "100%",
        }}
      >
        <NumericField
          label="Min level scaling"
          value={config.minLevelScaling}
          step={0.05}
          onChange={(v) => handleConfigNumber("minLevelScaling", v)}
        />
        <NumericField
          label="Avg level scaling"
          value={config.avgLevelScaling}
          step={0.05}
          onChange={(v) => handleConfigNumber("avgLevelScaling", v)}
        />
        <NumericField
          label="Max level scaling"
          value={config.maxLevelScaling}
          step={0.05}
          onChange={(v) => handleConfigNumber("maxLevelScaling", v)}
        />

        <NumericField
          label="Tier cap scaling"
          value={config.tierCapScaling}
          step={0.05}
          onChange={(v) => handleConfigNumber("tierCapScaling", v)}
        />

        <div></div>
        <div></div>

        <NumericField
          label="Weight current tier buff"
          value={config.weightCurrentTierBuff}
          step={0.05}
          onChange={(v) => handleConfigNumber("weightCurrentTierBuff", v)}
        />
        <NumericField
          label="Weight decay per tier"
          value={config.weightDecayPerTier}
          step={0.05}
          onChange={(v) => handleConfigNumber("weightDecayPerTier", v)}
        />
        <NumericField
          label="Weight min factor"
          value={config.weightMinFactor}
          step={0.05}
          onChange={(v) => handleConfigNumber("weightMinFactor", v)}
        />
      </div>

      <hr style={{ margin: "1rem 0" }} />

      <h3 style={{ fontSize: "1.8rem" }}>Tier level caps</h3>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.8rem",
          flexDirection: "column",
          width: "300px",
        }}
      >
        {config.tierCaps.map((cap, i) => (
          <div key={i} style={{ minWidth: "120px" }}>
            <label style={{ fontSize: "1.3rem" }}>
              Tier {i + 1}
              <NumberInput
                value={cap}
                min={1}
                step={1}
                onChange={(v) => handleTierCapChange(i, v)}
              />
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

interface NumericFieldProps {
  label: string;
  value: number;
  step?: number;
  onChange: (value: number) => void;
}

const NumericField: React.FC<NumericFieldProps> = ({
  label,
  value,
  step = 0.01,
  onChange,
}) => {
  return (
    <div>
      <label style={{ fontSize: "1.2rem" }}>
        {label}
        <NumberInput value={value} step={step} onChange={(v) => onChange(v)} />
      </label>
    </div>
  );
};
