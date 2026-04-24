/**
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CharacterData } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface HUDProps {
  p1: { hp: number; energy: number; data: CharacterData; combo: number };
  p2: { hp: number; energy: number; data: CharacterData; combo: number };
  timer: number;
}

export const HUD: React.FC<HUDProps> = ({ p1, p2, timer }) => {
  return (
    <div className="absolute inset-0 pointer-events-none select-none p-4 md:p-12 z-20">
      <div className="flex justify-between items-start gap-8 w-full">
        {/* Player 1 HUD */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-red-600 flex items-center justify-center font-['Orbitron'] font-black text-2xl -skew-x-[12deg] shadow-[0_0_15px_rgba(220,38,38,0.5)]">
            P1
          </div>
          <div className="flex flex-col gap-2 w-48 md:w-64">
            <div className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-bold">
              {p1.data.name} // <span className="text-zinc-600">INTEGRITY</span>
            </div>
            <div className="h-1 w-full bg-zinc-800 relative">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-400"
                initial={{ width: '100%' }}
                animate={{ width: `${p1.hp}%` }}
                transition={{ type: 'spring', damping: 20, stiffness: 100 }}
              />
            </div>
            <div className="h-0.5 w-3/4 bg-zinc-900 overflow-hidden">
               <motion.div
                className="h-full bg-red-900"
                animate={{ width: `${p1.energy}%` }}
              />
            </div>
          </div>
        </div>

        {/* Center Match Status */}
        <div className="text-center">
          <div className="font-['Orbitron'] text-4xl md:text-5xl font-black italic tracking-tighter text-zinc-100 uppercase">
            ROUND 01
          </div>
          <div className="text-[9px] tracking-[0.4em] text-red-500 font-bold mt-1 uppercase">
            {timer <= 0 ? 'SIGNAL TERMINATED' : 'SIGNAL ACTIVE'}
          </div>
          <motion.div
            key={timer}
            className={cn(
              "font-['Orbitron'] text-2xl font-black leading-none mt-2",
              timer <= 10 ? "text-red-600 animate-pulse" : "text-white"
            )}
          >
            {String(timer).padStart(2, '0')}
          </motion.div>
        </div>

        {/* Player 2 HUD */}
        <div className="flex items-center gap-4 text-right justify-end">
          <div className="flex flex-col gap-2 w-48 md:w-64">
            <div className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-bold text-right">
               <span className="text-zinc-600">INTEGRITY</span> // {p2.data.name}
            </div>
            <div className="h-1 w-full bg-zinc-800 relative">
              <motion.div
                className="absolute inset-0 h-full bg-gradient-to-l from-cyan-600 to-cyan-400"
                style={{ right: 0 }}
                initial={{ width: '100%' }}
                animate={{ width: `${p2.hp}%` }}
                transition={{ type: 'spring', damping: 20, stiffness: 100 }}
              />
            </div>
            <div className="h-0.5 w-3/4 bg-zinc-900 overflow-hidden ml-auto">
               <motion.div
                className="h-full bg-cyan-900"
                animate={{ width: `${p2.energy}%` }}
              />
            </div>
          </div>
          <div className="w-12 h-12 bg-cyan-600 flex items-center justify-center font-['Orbitron'] font-black text-2xl skew-x-[12deg] shadow-[0_0_15px_rgba(8,145,178,0.5)]">
            P2
          </div>
        </div>
      </div>

      <AnimatePresence>
        {(p1.combo >= 2 || p2.combo >= 2) && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="absolute bottom-24 left-1/2 -translate-x-1/2 font-['Orbitron'] font-black italic text-4xl text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.4)] tracking-tighter"
          >
            {p1.combo >= 2 ? p1.combo : p2.combo} HIT
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 text-[10px] tracking-[2px] text-zinc-500 uppercase whitespace-nowrap font-bold">
        <span>Signal Status: <span className="text-zinc-100">OPTIMAL</span></span>
        <span className="w-px h-3 bg-zinc-800" />
        <span>Location: <span className="text-zinc-100">NEON DISTRICT</span></span>
      </div>
    </div>
  );
};

export const WinScreen: React.FC<{ winner: string | null; onContinue: () => void }> = ({ winner, onContinue }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 bg-[#0a0a0c]/90 flex flex-col items-center justify-center z-50 px-4"
    >
      <div className="relative mb-12">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-9xl font-['Orbitron'] font-black italic tracking-tighter text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.4)] transform -skew-x-12"
        >
          {winner ? 'WIN' : 'END'}
        </motion.div>
        <div className="absolute -inset-8 border border-white/10 rounded-full animate-pulse" />
        <div className="absolute -inset-16 border border-white/5 rounded-full" />
      </div>
      
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-[12px] tracking-[8px] text-zinc-450 mt-4 uppercase text-center font-bold"
      >
        {winner ? `${winner} SECURED DOMINANCE` : 'SIGNAL TRUNCATED'}
      </motion.p>
      <motion.button
        whileHover={{ scale: 1.05, letterSpacing: '6px' }}
        whileTap={{ scale: 0.95 }}
        onClick={onContinue}
        className="mt-12 px-12 py-3 font-['Orbitron'] text-[10px] font-black tracking-[4px] uppercase bg-white text-black hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
      >
        NEXT SIGNAL →
      </motion.button>
    </motion.div>
  );
};
