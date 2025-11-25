import React from "react";
import { TierStats } from "../lib/scaling";

interface Props {
  stats: TierStats[];
  trainerTier: number;
  baseWeight: number;
}

export const SummaryTable: React.FC<Props> = ({
  stats,
  trainerTier,
  baseWeight,
}) => {
  return (
    <div
      style={{
        padding: "1rem",
        borderRadius: "0.5rem",
        border: "1px solid #444",
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "0.9rem",
        }}
      >
        <thead>
          <tr style={{ fontSize: "1.5rem" }}>
            <Th>Tier</Th>
            <Th>Unlocked</Th>
            <Th>Level Cap</Th>
            <Th>Minimum Level</Th>
            <Th>Average Level</Th>
            <Th>Max Level</Th>
            <Th>Weight Multiplier</Th>
          </tr>
        </thead>
        <tbody>
          {stats.map((s) => {
            const above = s.tier > trainerTier;
            const adjustedWeight = baseWeight * s.weightMultiplier;
            return (
              <tr
                key={s.tier}
                style={{
                  fontSize: "1.1rem",
                  backgroundColor: above
                    ? "rgba(255, 0, 0, 0.1)"
                    : "rgba(0, 0, 0, 0)",
                }}
              >
                <Td>{s.tier}</Td>
                <Td>{above ? "X" : ""}</Td>
                <Td>{s.baseCap}</Td>
                <Td>{s.levelMin}</Td>
                <Td>{s.levelExpectedAvg.toFixed(0)}</Td>
                <Td>{s.levelMax}</Td>
                <Td>{s.weightMultiplier.toFixed(2)}</Td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const Th: React.FC<React.PropsWithChildren> = ({ children }) => (
  <th
    style={{
      borderBottom: "1px solid #555",
      padding: "0.25rem 0.5rem",
      textAlign: "right",
    }}
  >
    {children}
  </th>
);

const Td: React.FC<
  React.PropsWithChildren<{ style?: React.CSSProperties }>
> = ({ children, style }) => (
  <td
    style={{
      padding: "0.25rem 0.5rem",
      textAlign: "right",
      borderBottom: "1px solid #333",
      ...style,
    }}
  >
    {children}
  </td>
);
