"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GripHorizontal } from "lucide-react";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export function BottomSheet({ isOpen, onClose, children, title }: BottomSheetProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bottom-sheet-overlay lg:hidden"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
          >
            <div className="glass-panel rounded-t-3xl border border-white/10 max-h-[70vh] overflow-y-auto shadow-2xl shadow-black/30">
              <div className="flex justify-center pt-2 pb-1">
                <GripHorizontal className="w-8 h-5 text-gray-600" />
              </div>
              {title && (
                <div className="px-5 pb-2">
                  <h3 className="text-lg font-bold text-white">{title}</h3>
                </div>
              )}
              <div className="px-5 pb-6">{children}</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
