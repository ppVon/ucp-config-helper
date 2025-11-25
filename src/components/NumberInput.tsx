import React from "react";

export interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  fullWidth?: boolean;
}

const round2 = (val: number) => Math.round(val * 100) / 100;

export const NumberInput: React.FC<NumberInputProps> = ({
  value,
  onChange,
  min,
  max,
  step = 1,
  fullWidth = true,
}) => {
  const clamp = (val: number) => {
    let next = val;
    if (typeof min === "number") next = Math.max(min, next);
    if (typeof max === "number") next = Math.min(max, next);
    return next;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === "") {
      onChange(NaN);
      return;
    }
    const parsed = Number(raw);
    if (!Number.isNaN(parsed)) {
      onChange(clamp(parsed));
    }
  };

  const handleStep = (direction: -1 | 1) => {
    const base = Number.isFinite(value) ? value : min ?? 0;
    const rawNext = base + direction * step;
    const rounded = round2(rawNext);
    const next = clamp(rounded);
    onChange(next);
  };

  return (
    <div
      style={{
        display: "flex",
      }}
    >
      <button
        type="button"
        onClick={() => handleStep(-1)}
        style={{
          padding: "0.4rem 0.7rem",
          fontSize: "1.1rem",
          border: "1px solid #555",
          borderRadius: "0.5rem 0 0 0.5rem",
          background: "#222",
          color: "#eee",
          cursor: "pointer",
        }}
      >
        −
      </button>
      <input
        type="number"
        value={Number.isNaN(value) ? "" : value}
        onChange={handleInputChange}
        min={min}
        max={max}
        step={step}
        style={{
          flex: 1,
          padding: "0.4rem 0.6rem",
          fontSize: "1.05rem",
          textAlign: "center",
          borderTop: "1px solid #555",
          borderBottom: "1px solid #555",
          borderLeft: "none",
          borderRight: "none",
          background: "#111",
          color: "#eee",
          width: "100%",
        }}
      />
      <button
        type="button"
        onClick={() => handleStep(1)}
        style={{
          padding: "0.4rem 0.7rem",
          fontSize: "1.1rem",
          border: "1px solid #555",
          borderRadius: "0 0.5rem 0.5rem 0",
          background: "#222",
          color: "#eee",
          cursor: "pointer",
        }}
      >
        +
      </button>
    </div>
  );
};
