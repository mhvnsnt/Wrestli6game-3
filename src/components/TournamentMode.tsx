/**
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Swords, Zap, Lock, ChevronRight, Target } from 'lucide-react';
import { CharacterData } from '../types';
import { ROSTER } from '../data/roster';

interface TournamentModeProps {
  playerChar: CharacterData;
  onBack: () => void;
  onStartMatch: (opponent: CharacterData) => void;
}

export const TournamentMode: React.FC<TournamentModeProps> = ({ playerChar, onBack, onStartMatch }) => {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
        if (e.key.toLowerCase() === 'escape' || e.key.toLowerCase() === 'b') onBack();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onBack]);

  const [currentTier, setCurrentTier] = useState(0);
  
  const tiers = [
    { name: 'THE_GATES', rank: 'BRONZE', opponents: [ROSTER[2], ROSTER[3]], reward: 'Access to the Core' },
    { name: 'THE_VORTEX', rank: 'SILVER', opponents: [ROSTER[4], ROSTER[5]], reward: 'Limb Calibration' },
    { name: 'THE_THRONE', rank: 'GOLD', opponents: [ROSTER[1]], reward: 'Sovereignty' },
  ];

  return (
    <div className="w-full h-full bg-[#050507] p-8 flex flex-col font-['Share_Tech_Mono']">
      <div className="flex justify-between items-center mb-12 border-b border-zinc-900 pb-6">
        <div>
          <div className="text-[10px] text-red-600 font-black tracking-[8px] uppercase mb-1">PROGRAM_SEQUENCE</div>
          <h1 className="text-5xl font-black italic tracking-tighter uppercase">THE_SOVEREIGN_LADDER</h1>
        </div>
        <button onClick={onBack} className="text-[10px] text-zinc-600 hover:text-white border border-zinc-800 px-4 py-2 uppercase tracking-widest transition-all italic">
          [ ABORT_SEQUENCE ]
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-8 overflow-y-auto">
         {tiers.map((tier, idx) => (
           <motion.div 
             key={tier.name}
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: idx * 0.1 }}
             className={`
                relative p-6 border transition-all flex flex-col
                ${currentTier === idx ? 'border-red-600 bg-red-600/5 shadow-[0_0_30px_rgba(220,38,38,0.1)]' : 'border-zinc-800 opacity-40'}
                ${currentTier < idx ? 'grayscale blur-[1px]' : ''}
             `}
           >
              <div className="flex justify-between items-start mb-6">
                 <div>
                    <div className="text-[8px] text-zinc-500 font-black tracking-[4px] uppercase mb-1">{tier.rank}</div>
                    <div className="text-xl font-black italic uppercase tracking-tight">{tier.name}</div>
                 </div>
                 {currentTier > idx ? <Zap className="text-green-500" size={16} /> : currentTier < idx ? <Lock className="text-zinc-700" size={16} /> : <Target className="text-red-600 animate-pulse" size={16} />}
              </div>

              <div className="space-y-4 flex-1">
                 {tier.opponents.map((opp, oIdx) => (
                    <div key={oIdx} className="bg-black/40 p-4 border border-zinc-900 group">
                       <div className="text-[8px] text-zinc-700 font-bold uppercase mb-1">OPPONENT_DETECTED</div>
                       <div className="flex justify-between items-center">
                          <span className="text-sm font-black uppercase text-zinc-400 group-hover:text-white transition-colors">{opp.name}</span>
                          {currentTier === idx && (
                             <motion.button
                               whileHover={{ x: 5 }}
                               onClick={() => onStartMatch(opp)}
                               className="text-red-600"
                             >
                                <ChevronRight />
                             </motion.button>
                          )}
                       </div>
                    </div>
                 ))}
              </div>

              <div className="mt-8 pt-4 border-t border-zinc-900">
                 <div className="text-[9px] text-zinc-600 font-bold uppercase mb-1 tracking-[2px]">TIER_REWARD</div>
                 <div className="text-[10px] text-zinc-400 font-black italic">{tier.reward}</div>
              </div>

              {currentTier === idx && (
                 <div className="absolute -bottom-4 -right-4 bg-red-600 text-[8px] font-black p-2 tracking-[4px] uppercase rotate-[-2deg]">
                    ACTIVE_MISSION
                 </div>
              )}
           </motion.div>
         ))}
      </div>

      <div className="mt-12 flex justify-between items-center text-[9px] text-zinc-800 font-black border-t border-zinc-950 pt-4">
         <div className="tracking-[10px] uppercase">BREACH_STATUS: {currentTier * 33.3}%</div>
         <div className="flex gap-8">
            <span>MOD: {playerChar.archetype.toUpperCase()}</span>
            <span>FREQ: {playerChar.sigil.toUpperCase()}</span>
         </div>
      </div>
    </div>
  );
};
