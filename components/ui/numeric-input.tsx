"use client";

import React, { useEffect, useState } from "react";
import { clsx } from "clsx";

interface NumericInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "onChange"> {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

const completeNumberPattern = /^-?(?:\d+|\d*\.\d+)$/;

function formatValue(value: number) {
  return Number.isFinite(value) ? String(value) : "";
}

export function NumericInput({ value, onChange, min, max, className = "", onBlur, onKeyDown, ...props }: NumericInputProps) {
  const [draft, setDraft] = useState(formatValue(value));

  useEffect(() => {
    setDraft(formatValue(value));
  }, [value]);

  const commit = (raw: string) => {
    const trimmed = raw.trim();
    if (trimmed === "" || !completeNumberPattern.test(trimmed)) {
      setDraft(formatValue(value));
      return;
    }

    let nextValue = Number(trimmed);
    if (typeof min === "number") nextValue = Math.max(min, nextValue);
    if (typeof max === "number") nextValue = Math.min(max, nextValue);

    onChange(nextValue);
    setDraft(String(nextValue));
  };

  return (
    <input
      {...props}
      type="text"
      inputMode="decimal"
      value={draft}
      className={clsx(className)}
      onChange={(event) => {
        const nextDraft = event.target.value;
        setDraft(nextDraft);
        if (completeNumberPattern.test(nextDraft.trim())) {
          onChange(Number(nextDraft));
        }
      }}
      onBlur={(event) => {
        commit(draft);
        onBlur?.(event);
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.currentTarget.blur();
        }
        onKeyDown?.(event);
      }}
    />
  );
}
