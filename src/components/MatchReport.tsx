/**
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { BarChart3, Shield, Zap, TrendingUp, Award, Clock } from 'lucide-react';
import { CharacterData } from '../types';

interface MatchReportProps {
  winner: string | null;
  p1: CharacterData;
  p2: CharacterData;
  p1Stats: any;
  p2Stats: any;
  onContinue: () => void;
}

export const MatchReport: React.FC<MatchReportProps> = ({ winner, p1, p2, p1Stats, p2Stats, onContinue }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key.toLowerCase() === 'enter' || e.key.toLowerCase() === 'f') {
            onContinue();
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onContinue]);

  const StatRow = ({ label, v1, v2, icon: Icon }: any) => (
    <div className="flex flex-col gap-1 w-full border-b border-zinc-900 py-3">
      <div className="flex justify-between items-center px-2">
        <span className="text-[10px] text-zinc-600 font-bold uppercase flex items-center gap-2">
          <Icon size={12} /> {label}
        </span>
      </div>
      <div className="flex items-center gap-4 px-2">
         <div className="flex-1 h-1.5 bg-zinc-900 relative overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, v1)}%` }}
              className="absolute right-0 h-full bg-red-600"
            />
         </div>
         <div className="flex-1 h-1.5 bg-zinc-900 relative overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, v2)}%` }}
              className="absolute left-0 h-full bg-cyan-600"
            />
         </div>
      </div>
      <div className="flex justify-between px-2">
        <span className="text-xs font-black text-white">{v1}</span>
        <span className="text-xs font-black text-white">{v2}</span>
      </div>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-[1000] bg-black/95 flex items-center justify-center p-6 backdrop-blur-xl"
    >
      <div className="w-full max-w-4xl bg-zinc-950 border border-zinc-800 relative overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)]">
        {/* Background Visuals */}
        <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-red-900/10 to-transparent pointer-events-none" />
        <div className="absolute -top-20 -left-20 w-60 h-60 bg-red-600/10 blur-[100px]" />
        <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-cyan-600/10 blur-[100px]" />

        <div className="relative p-8 flex flex-col h-full">
          <div className="flex justify-between items-start mb-8 border-b border-zinc-800 pb-6">
            <div>
              <div className="text-[10px] text-red-600 font-black tracking-[5px] uppercase mb-1">POST_MATCH_AUDIT</div>
              <h1 className="text-4xl font-black italic uppercase tracking-tighter">VICTORY_DECLARED</h1>
            </div>
            <Award size={48} className="text-red-600 opacity-50" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 flex-1">
             <div className="space-y-6">
                <div className="flex items-center gap-6">
                   <div className="w-20 h-20 bg-zinc-900 border border-red-600 flex items-center justify-center">
                      <BarChart3 className="text-red-600" />
                   </div>
                   <div>
                      <div className="text-[10px] text-zinc-500 font-bold uppercase mb-1">AGGRESSOR_UNIT</div>
                      <div className="text-xl font-black uppercase text-red-500">{p1.name}</div>
                   </div>
                </div>

                <div className="space-y-2">
                   <StatRow label="STRIKES_LANDED" v1={p1Stats.strikes || 0} v2={p2Stats.strikes || 0} icon={Zap} />
                   <StatRow label="MOMENTUM_MAINTAINED" v1={p1Stats.momentum || 85} v2={p2Stats.momentum || 45} icon={TrendingUp} />
                   <StatRow label="VITAL_RESERVE" v1={p1Stats.hp || 0} v2={p2Stats.hp || 0} icon={Shield} />
                   <StatRow label="COMBAT_EFFICIENCY" v1={78} v2={42} icon={Clock} />
                </div>
             </div>

             <div className="flex flex-col justify-center items-center gap-6 border-l border-zinc-900 pl-12 bg-black/20">
                <div className="text-center">
                   <div className="text-[11px] text-zinc-500 font-black tracking-[4px] uppercase mb-2">WINNER_IDENTIFIED</div>
                   <div className="text-6xl font-black italic uppercase italic tracking-tighter text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">{winner}</div>
                </div>

                <div className="p-4 border border-zinc-800 bg-zinc-900/50 w-full">
                   <div className="text-[8px] text-zinc-600 font-bold uppercase mb-2 tracking-[2px]">TACTICAL_POSTROMENS</div>
                   <p className="text-[10px] leading-relaxed text-zinc-400 font-['Share_Tech_Mono'] uppercase">
                      The core has been accessed. Genetic calibration for {winner} has increased by 12%. 
                      The slave contract is fracturing. Breach probability: 84.2%.
                   </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: '#dc2626', color: '#fff' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onContinue}
                  className="w-full py-4 border border-red-600 text-red-600 font-black uppercase tracking-[4px] text-xs skew-x-[-12deg] transition-all"
                >
                  <span className="skew-x-[12deg] block">EXECUTE_RE-ENTRY</span>
                </motion.button>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
