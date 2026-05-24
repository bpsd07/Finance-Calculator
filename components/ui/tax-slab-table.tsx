"use client";

import React from "react";
import { motion } from "framer-motion";
import { TaxSlabBreakdown } from "@/lib/calculators/tax";

interface TaxSlabTableProps {
  oldSlabs: TaxSlabBreakdown[];
  newSlabs: TaxSlabBreakdown[];
  oldTotal: number;
  newTotal: number;
}

export function TaxSlabTable({ oldSlabs, newSlabs, oldTotal, newTotal }: TaxSlabTableProps) {
  const maxSlabs = Math.max(oldSlabs.length, newSlabs.length);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/5">
            <th className="text-left py-3 pr-4 text-gray-500 font-medium">Income Slab</th>
            <th className="text-right py-3 px-4 text-amber-400 font-medium">Old Regime</th>
            <th className="text-right py-3 pl-4 text-emerald-400 font-medium">New Regime</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: maxSlabs }).map((_, i) => {
            const oldSlab = oldSlabs[i];
            const newSlab = newSlabs[i];
            if (!oldSlab || !newSlab) return null;
            return (
              <motion.tr
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="border-b border-white/5 last:border-0"
              >
                <td className="py-3 pr-4 text-gray-300">{oldSlab.slab}</td>
                <td className="text-right py-3 px-4">
                  <span className="text-amber-400 font-medium">
                    ₹{oldSlab.taxAmount.toLocaleString("en-IN")}
                  </span>
                  <span className="text-gray-600 text-xs ml-1">({oldSlab.rate}%)</span>
                </td>
                <td className="text-right py-3 pl-4">
                  <span className="text-emerald-400 font-medium">
                    ₹{newSlab.taxAmount.toLocaleString("en-IN")}
                  </span>
                  <span className="text-gray-600 text-xs ml-1">({newSlab.rate}%)</span>
                </td>
              </motion.tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="border-t border-white/10">
            <td className="py-3 pr-4 text-white font-bold">Total Tax</td>
            <td className="text-right py-3 px-4 text-amber-400 font-bold text-base">
              ₹{oldTotal.toLocaleString("en-IN")}
            </td>
            <td className="text-right py-3 pl-4 text-emerald-400 font-bold text-base">
              ₹{newTotal.toLocaleString("en-IN")}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
