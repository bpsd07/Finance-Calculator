"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Calculator } from "lucide-react";

interface Step {
  label: string;
  value: number;
  type: "add" | "subtract" | "result";
  detail?: string;
}

interface TaxComputationStepsProps {
  steps: Step[];
  title?: string;
}

export function TaxComputationSteps({ steps, title }: TaxComputationStepsProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="glass-panel rounded-2xl border border-card-border overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-3">
          <Calculator className="w-5 h-5 text-emerald-400" />
          <span className="text-base font-semibold text-white">
            {title || "How Your Tax is Calculated"}
          </span>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-1">
              {steps.map((step, i) => {
                const isLast = i === steps.length - 1;
                const isFirst = i === 0;

                return (
                  <motion.div
                    key={step.label}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className={`flex items-center justify-between py-2.5 ${
                      step.type === "result"
                        ? "border-t-2 border-emerald-500/30 mt-2 pt-4"
                        : step.type === "subtract"
                        ? "text-gray-400"
                        : ""
                    } ${step.detail ? "border-b border-white/5" : ""}`}
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      {isFirst ? null : (
                        <span className="text-xs text-gray-600 shrink-0 mr-1">
                          {step.type === "add" ? "+" : step.type === "subtract" ? "−" : "="}
                        </span>
                      )}
                      <span
                        className={`text-sm truncate ${
                          step.type === "result"
                            ? "text-white font-bold"
                            : "text-gray-400"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                    <span
                      className={`text-sm font-medium shrink-0 ml-4 ${
                        step.type === "result"
                          ? "text-emerald-400 text-base"
                          : step.type === "subtract"
                          ? "text-rose-400"
                          : "text-white"
                      }`}
                    >
                      {step.type === "subtract" ? "− " : step.type === "add" ? "+ " : "= "}
                      ₹{step.value.toLocaleString("en-IN")}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
