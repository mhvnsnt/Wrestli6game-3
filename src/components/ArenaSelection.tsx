/**
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArenaData } from '../types';

interface ArenaSelectionProps {
  onConfirm: (arena: ArenaData) => void;
  onBack: () => void;
}

export const ARENAS: ArenaData[] = [
  {
    id: 'sov_stadium',
    name: 'SOVEREIGN GLOBAL STADIUM',
    lighting: '#ff0000',
    ringColor: '#1a1a2e',
    apronColor: '#ff0000',
    matColor: '#1a1a2e',
    floorColor: '#020205',
    barricadeColor: '#111',
    showBackstage: true,
    type: 'stadium'
  },
  {
    id: 'backstage_sector',
    name: 'BACKSTAGE SECTOR 7',
    lighting: '#333',
    ringColor: '#000',
    apronColor: '#000',
    matColor: '#333',
    floorColor: '#222',
    barricadeColor: '#444',
    showBackstage: true,
    type: 'backstage'
  },
  {
    id: 'neon_gym',
    name: 'NEON UNDERGROUND GYM',
    lighting: '#00ffff',
    ringColor: '#0a0a0a',
    apronColor: '#00ffff',
    matColor: '#111',
    floorColor: '#050505',
    barricadeColor: '#222',
    showBackstage: false,
    type: 'gym'
  }
];

export const ArenaSelection: React.FC<ArenaSelectionProps> = ({ onConfirm, onBack }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectedArena = ARENAS[selectedIndex];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-[100] bg-[#050507] flex flex-col p-4 lg:p-12 overflow-hidden"
    >
      {/* Header */}
      <header className="flex-none flex justify-between items-end mb-8 lg:mb-12 border-b border-zinc-900 pb-6 relative z-50">
        <div>
           <div className="text-[8px] lg:text-[10px] text-zinc-500 font-black tracking-[4px] lg:tracking-[8px] uppercase mb-1">LOCATION_SYNTHESIS</div>
           <h1 className="text-3xl lg:text-6xl font-black italic tracking-tighter uppercase leading-none">
             SELECT <span className="text-red-600">ARENA</span>
           </h1>
        </div>
        <button 
          onClick={onBack}
          className="px-6 lg:px-10 py-3 lg:py-4 bg-zinc-900/50 border border-zinc-800 hover:border-white transition-all text-zinc-500 hover:text-white uppercase text-[8px] lg:text-[10px] tracking-[4px] lg:tracking-[6px] font-black italic -skew-x-12"
        >
          <span className="inline-block skew-x-12">← RETURN_BASE</span>
        </button>
      </header>
    
      <div className="flex-1 flex flex-col lg:flex-row gap-6 lg:gap-12 min-h-0 relative">
        <div className="w-full lg:w-[400px] flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2 flex-none min-h-0">
           <div className="flex lg:flex-col gap-2">
             {ARENAS.map((arena, idx) => (
               <motion.button
                 key={arena.id}
                 whileHover={{ x: 10 }}
                 onClick={() => setSelectedIndex(idx)}
                 className={`
                   p-4 lg:p-6 text-left border transition-all relative flex-none
                   ${selectedIndex === idx ? 'border-red-600 bg-red-600/10' : 'border-zinc-900 bg-zinc-950/50 hover:border-zinc-700'}
                 `}
               >
                  <div className="flex justify-between items-start mb-2">
                     <div className="text-[8px] font-black text-zinc-700 tracking-widest uppercase">COORD: {arena.type.toUpperCase()}_{idx+1}</div>
                     {selectedIndex === idx && <div className="w-2 h-2 bg-red-600 animate-pulse" />}
                  </div>
                  <h3 className={`text-xl lg:text-2xl font-black italic uppercase tracking-tight transition-colors ${selectedIndex === idx ? 'text-white' : 'text-zinc-600'}`}>
                    {arena.name}
                  </h3>
                  <p className="text-[9px] font-bold text-zinc-500 tracking-[2px] mt-1 italic uppercase">SUBJECTS_READY</p>
               </motion.button>
             ))}
           </div>
        </div>

        {/* Preview Area */}
        <div className="flex-1 bg-zinc-950 border border-zinc-900 relative group overflow-hidden flex flex-col items-center justify-center">
           {/* Dynamic Background */}
           <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.2)_0%,transparent_70%)]" />
              <div className="w-full h-full" style={{ backgroundImage: 'linear-gradient(rgba(20,20,20,1) 1px, transparent 1px), linear-gradient(90deg, rgba(20,20,20,1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
           </div>

           <div className="relative z-20 flex-1 flex flex-col items-center justify-center p-8 lg:p-20 w-full">
              <motion.div 
                 key={selectedArena.id}
                 initial={{ opacity: 0, scale: 0.9, rotateX: 20 }}
                 animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                 className="relative w-full max-w-3xl aspect-video bg-zinc-900 border border-zinc-800 shadow-2xl flex items-center justify-center overflow-hidden"
              >
                 <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
                 <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${selectedArena.name}`} alt="" className="w-full h-full opacity-10 absolute inset-0" />
                 
                 <div className="relative z-20 text-center">
                    <h4 className="text-4xl lg:text-7xl font-black italic tracking-tighter text-white uppercase drop-shadow-[0_0_30px_black]">{selectedArena.name}</h4>
                    <div className="mt-4 flex justify-center gap-8">
                       <div className="flex flex-col">
                          <span className="text-[8px] lg:text-[10px] text-zinc-500 font-black tracking-widest">CAPACITY</span>
                          <span className="text-sm lg:text-xl font-bold italic">MAX</span>
                       </div>
                       <div className="flex flex-col border-l border-zinc-800 pl-8">
                          <span className="text-[8px] lg:text-[10px] text-zinc-500 font-black tracking-widest">VISUAL_INDEX</span>
                          <span className="text-sm lg:text-xl font-bold italic">STABLE</span>
                       </div>
                    </div>
                 </div>
              </motion.div>

              <div className="mt-8 lg:mt-12 w-full max-w-xl text-center space-y-6">
                 <p className="text-[10px] lg:text-xs text-zinc-500 font-mono italic uppercase tracking-widest leading-relaxed">
                    "This sector has been audited and cleared for Sovereignty trials. Environmental hazards are restricted to Level-3 clearance. Initializing broad-spectrum lighting..."
                 </p>
                 <div className="flex justify-center">
                   <button 
                    onClick={() => onConfirm(selectedArena)}
                    className="px-16 lg:px-24 py-4 lg:py-6 bg-red-600 text-white font-black uppercase text-[10px] lg:text-[12px] tracking-[8px] lg:tracking-[12px] -skew-x-12 hover:bg-white hover:text-black transition-all shadow-[0_0_50px_rgba(220,38,38,0.3)] active:scale-95"
                   >
                     <span className="inline-block skew-x-12">INITIALIZE_ARENA</span>
                   </button>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <footer className="flex-none h-16 lg:h-24 flex items-center justify-between border-t border-zinc-950 px-4 text-[8px] lg:text-[10px] font-black text-zinc-800 tracking-[8px] uppercase">
         <span className="hidden sm:block">SECTOR_OVERRIDE_ACTIVE</span>
         <div className="flex gap-12">
            <span>[W/S] NAVIGATE</span>
            <span>[ENTER] CONFIRM</span>
         </div>
         <span className="hidden sm:block">2026 // CORE_SYNC</span>
      </footer>
    </motion.div>
  );
};
;
