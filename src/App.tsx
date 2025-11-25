// src/App.tsx
import React, { useState, useMemo } from "react";
import {
  DEFAULT_CONFIG,
  type ScalingConfig,
  computeAllTierStats,
} from "./lib/scaling";
import { ConfigPanel } from "./components/ConfigPanel";
import { LevelChart } from "./components/LevelChart";
import { SummaryTable } from "./components/SummaryTable";

const BASE_WEIGHT = 300;

const App: React.FC = () => {
  const [config, setConfig] = useState<ScalingConfig>(DEFAULT_CONFIG);
  const [trainerTier, setTrainerTier] = useState<number>(1);

  const stats = useMemo(
    () => computeAllTierStats(trainerTier, config),
    [trainerTier, config]
  );

  return (
    <div
      style={{
        color: "#eee",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingRight: "16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <img src="/src/assets/icon.png" alt="Mod Icon" />
          <h1 style={{ margin: 0 }}>Config Helper</h1>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1.75rem" }}>
          <a
            href="https://www.curseforge.com/minecraft/mc-mods/ultimate-cobblemon-progression"
            target="_blank"
            rel="noopener noreferrer"
            title="CurseForge"
          >
            <img
              src="/src/assets/curseforge.svg"
              alt="CurseForge"
              className="svg"
              style={{
                width: "48px",
                height: "48px",
              }}
            />
          </a>

          <a
            href="https://modrinth.com/mod/ultimate-cobblemon-progression"
            target="_blank"
            rel="noopener noreferrer"
            title="Modrinth"
          >
            <img
              src="/src/assets/modrinth.svg"
              alt="Modrinth"
              className="svg"
              style={{ width: "48px", height: "48px" }}
            />
          </a>

          <a
            href="https://github.com/ppVon/ucp-config-helper"
            target="_blank"
            rel="noopener noreferrer"
            title="GitHub"
            className="svg"
          >
            <img
              src="/src/assets/github.svg"
              alt="GitHub"
              style={{ width: "48px", height: "48px" }}
            />
          </a>
        </div>
      </div>
      <p style={{ maxWidth: "800px", fontSize: "0.95rem" }}>
        Adjust the tier caps and scaling config to see how Pokémon tiers shift
        their level distributions and spawn weights relative to a given trainer
        tier.
      </p>

      {/* 2-column layout: left = config, right = chart + summary */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 2fr)",
          gap: "1rem",
          alignItems: "flex-start",
          marginTop: "1rem",
        }}
      >
        <ConfigPanel
          config={config}
          trainerTier={trainerTier}
          onChangeConfig={setConfig}
          onChangeTrainerTier={setTrainerTier}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <LevelChart stats={stats} trainerTier={trainerTier} />
          <SummaryTable
            stats={stats}
            trainerTier={trainerTier}
            baseWeight={BASE_WEIGHT}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
