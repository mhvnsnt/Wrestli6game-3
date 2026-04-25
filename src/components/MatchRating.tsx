/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star } from 'lucide-react';

interface MatchRatingProps {
  score: number;
  highlightEvent?: string | null;
}

export const MatchRating: React.FC<MatchRatingProps> = ({ score, highlightEvent }) => {
  const stars = Math.min(5, Math.floor(score / 20));
  const remainder = (score % 20) / 20;

  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-50">
      <div className="flex gap-1 mb-1">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="relative">
            <Star 
              size={24} 
              className={`${i < stars ? 'text-yellow-400 fill-yellow-400' : 'text-zinc-800'}`} 
            />
            {i === stars && remainder > 0 && (
                <div 
                    className="absolute top-0 left-0 overflow-hidden text-yellow-400 fill-yellow-400"
                    style={{ width: `${remainder * 100}%` }}
                >
                    <Star size={24} className="fill-yellow-400" />
                </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="text-[10px] font-black italic tracking-[4px] text-white/40 uppercase">
        MATCH_QUALITY
      </div>

      <AnimatePresence>
        {highlightEvent && (
          <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -20, opacity: 0, scale: 1.2 }}
            className="mt-4 px-4 py-1 bg-white text-black text-[10px] font-black italic uppercase tracking-[2px]"
          >
            {highlightEvent}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
