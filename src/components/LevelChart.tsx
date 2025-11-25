import React, { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { TierStats, triangularDensity } from "../lib/scaling";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface Props {
  stats: TierStats[];
  trainerTier: number;
}

const COLORS = [
  "#ff6384",
  "#36a2eb",
  "#ffcd56",
  "#4bc0c0",
  "#9966ff",
  "#ff9f40",
  "#00c853",
  "#d81b60",
];

export const LevelChart: React.FC<Props> = ({ stats, trainerTier }) => {
  const [showLockedTiers, setShowLockedTiers] = useState(true);

  const levels = Array.from({ length: 100 }, (_, i) => i + 1);

  const visibleStats = showLockedTiers
    ? stats
    : stats.filter((s) => s.tier <= trainerTier);

  const datasets = visibleStats.map((tierStats, idx) => {
    const color = COLORS[idx % COLORS.length];
    const { levelMin, levelMode, levelMax, tier } = tierStats;

    const data = levels.map((lvl) => {
      const d = triangularDensity(lvl, levelMin, levelMode, levelMax);
      return d === 0 ? 0.00001 : d;
    });

    const isAboveTrainer = tier > trainerTier;

    return {
      label: `Tier ${tier}`,
      data,
      borderColor: isAboveTrainer ? color + "2f" : color + "ff",
      backgroundColor: isAboveTrainer ? color + "0f" : color + "66",
      borderWidth: 2,
      fill: true,
      spanGaps: true,
      tension: 0.3,
      borderDash: isAboveTrainer ? [6, 4] : [],
    };
  });

  const data = {
    labels: levels,
    datasets,
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false as const,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          title: (items: any[]) => `Level ${items[0].label}`,
          label: (item: any) => `${item.dataset.label}: ${item.raw.toFixed(2)}`,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Level",
        },
      },
      y: {
        title: {
          display: true,
          text: "Density",
        },
        min: 0,
        max: 1.1,
      },
    },
  };

  return (
    <div
      style={{
        padding: "1rem",
        borderRadius: "0.5rem",
        border: "1px solid #444",
      }}
    >
      <h2 style={{ marginTop: 0, marginBottom: "0.5rem" }}>
        Level distribution by Pokemon Tier
      </h2>

      <div
        style={{
          marginBottom: "0.5rem",
          fontSize: "0.9rem",
        }}
      >
        <label style={{ cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={showLockedTiers}
            onChange={(e) => setShowLockedTiers(e.target.checked)}
            style={{ marginRight: "0.35rem" }}
          />
          Show tiers above trainer tier
        </label>
      </div>

      <div style={{ height: "600px" }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
};
