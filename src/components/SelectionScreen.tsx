/**
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CharacterData, Ability, ManagerType } from '../types';
import { CharacterPreview } from './CharacterPreview';

interface SelectionScreenProps {
  onConfirm: (p1: CharacterData, p1CPU: boolean, p2: CharacterData, p2CPU: boolean, championship?: string) => void;
  onBack: () => void;
  availableSuperstars: CharacterData[];
}

export const SelectionScreen: React.FC<SelectionScreenProps> = ({ onConfirm, onBack, availableSuperstars }) => {
  const [p1Index, setP1Index] = useState(0);
  const [p2Index, setP2Index] = useState(1);
  const [p1CPU, setP1CPU] = useState(false);
  const [p2CPU, setP2CPU] = useState(true);
  const [focus, setFocus] = useState<'p1' | 'p2'>('p1');
  const [matchType, setMatchType] = useState('1v1 Standard');
  const [selectedTitle, setSelectedTitle] = useState<string | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGender, setFilterGender] = useState<'all' | 'male' | 'female'>('all');

  const CHAMPIONSHIPS = [
    { id: 'none', name: 'NO CHAMPIONSHIP' },
    { id: 'sov_world', name: 'SOVEREIGN WORLD TITLE' },
    { id: 'sov_inter', name: 'SOVEREIGN INTERCONTINENTAL' },
    { id: 'sov_women', name: 'SOVEREIGN WOMEN\'S TITLE' }
  ];

  const filteredSuperstars = availableSuperstars.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGender = filterGender === 'all' || s.gender === filterGender;
    return matchesSearch && matchesGender;
  });

  const p1 = availableSuperstars[p1Index] || availableSuperstars[0];
  const p2 = availableSuperstars[p2Index] || availableSuperstars[0];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      
      const currentFilteredIndex = filteredSuperstars.findIndex(s => availableSuperstars.indexOf(s) === (focus === 'p1' ? p1Index : p2Index));

      if (key === 'd' || key === 'arrowright') {
        const nextIdx = (currentFilteredIndex + 1) % filteredSuperstars.length;
        const originalIdx = availableSuperstars.indexOf(filteredSuperstars[nextIdx]);
        if (focus === 'p1') setP1Index(originalIdx); else setP2Index(originalIdx);
      }
      if (key === 'a' || key === 'arrowleft') {
        const nextIdx = (currentFilteredIndex - 1 + filteredSuperstars.length) % filteredSuperstars.length;
        const originalIdx = availableSuperstars.indexOf(filteredSuperstars[nextIdx]);
        if (focus === 'p1') setP1Index(originalIdx); else setP2Index(originalIdx);
      }
      if (key === 'w' || key === 'arrowup') {
        const nextIdx = (currentFilteredIndex - 5 + filteredSuperstars.length) % filteredSuperstars.length;
        const originalIdx = availableSuperstars.indexOf(filteredSuperstars[nextIdx]);
        if (focus === 'p1') setP1Index(originalIdx); else setP2Index(originalIdx);
      }
      if (key === 's' || key === 'arrowdown') {
        const nextIdx = (currentFilteredIndex + 5) % filteredSuperstars.length;
        if (nextIdx < filteredSuperstars.length) {
            const originalIdx = availableSuperstars.indexOf(filteredSuperstars[nextIdx]);
            if (focus === 'p1') setP1Index(originalIdx); else setP2Index(originalIdx);
        }
      }
      if (key === '1') setP1CPU(v => !v);
      if (key === '2') setP2CPU(v => !v);
      if (key === 'q') setFocus('p1');
      if (key === 'r') setFocus('p2');
      if (key === 'enter' || key === 'f') onConfirm(p1, p1CPU, p2, p2CPU, selectedTitle === 'none' ? undefined : selectedTitle);
      if (key === 'escape' || key === 'b') onBack();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredSuperstars, p1Index, p2Index, focus, p1, p1CPU, p2, p2CPU, onConfirm, onBack, availableSuperstars, selectedTitle]);

  const SelectionCard = ({ char, isCPU, side }: { char: CharacterData; isCPU: boolean; side: 'left' | 'right' }) => (
    <div className={`flex-1 relative flex flex-col ${side === 'left' ? 'items-start' : 'items-end'}`}>
      <motion.div 
        layoutId={`bg-${side}`}
        className={`absolute inset-0 bg-gradient-to-b ${side === 'left' ? 'from-red-950/40 via-[#0a0a0c]/80 to-transparent' : 'from-cyan-950/40 via-[#0a0a0c]/80 to-transparent'} border-x border-white/5`}
      />
      
      <div className={`relative z-10 p-12 w-full h-full flex flex-col justify-between ${side === 'left' ? 'items-start' : 'items-end'}`}>
        <div className="w-full">
            <div className="flex items-center gap-4 mb-4">
                <span className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-[2px] ${isCPU ? 'bg-zinc-800 text-zinc-400' : 'bg-red-600 text-white'}`}>
                    {isCPU ? 'CPU_CONTROL' : 'PLAYER_CONTROL'}
                </span>
                <span className="text-zinc-600 font-bold text-[10px] tracking-[4px]">VIBRATION_SIGNAL: 88.2%</span>
            </div>
            
            <motion.h2 
              initial={{ x: side === 'left' ? -50 : 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="font-black italic text-8xl tracking-tighter uppercase text-white leading-none mb-4"
            >
              {char.name}
            </motion.h2>
            
            <div className={`flex gap-6 ${side === 'left' ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className="text-left border-l-2 border-red-600 pl-4">
                    <span className="text-[10px] font-black text-zinc-500 tracking-[3px] uppercase block mb-1">OVERALL_RATING</span>
                    <span className="text-3xl font-black italic text-white">{char.overall || 88}</span>
                </div>
                <div className="text-left border-l-2 border-zinc-800 pl-4">
                    <span className="text-[10px] font-black text-zinc-500 tracking-[3px] uppercase block mb-1">ORIGIN_SECTOR</span>
                    <span className="text-sm font-black italic text-white uppercase">{char.hometown?.toUpperCase() || 'UNKNOWN'}</span>
                </div>
            </div>
        </div>

        <div className={`w-full max-w-md space-y-10 mt-12 bg-black/40 backdrop-blur-md p-8 border border-white/5 -skew-x-6 ${side === 'left' ? 'self-start' : 'self-end'}`}>
          <div className="skew-x-6 space-y-6">
             {/* Stats bars */}
             <div className="space-y-4">
                {[
                    { label: 'STRENGTH', val: char.stats?.strength || 80 },
                    { label: 'AGILITY', val: char.stats?.agility || 75 },
                    { label: 'TECHNIQUE', val: char.stats?.technique || 85 }
                ].map(s => (
                    <div key={s.label} className="space-y-1">
                        <div className="flex justify-between text-[8px] font-black tracking-[4px] text-zinc-500 uppercase">
                            <span>{s.label}</span>
                            <span className="text-white">{s.val}%</span>
                        </div>
                        <div className="h-1 bg-zinc-900 overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${s.val}%` }}
                                transition={{ duration: 1, type: 'spring' }}
                                className={`h-full ${side === 'left' ? 'bg-red-600' : 'bg-cyan-600'}`} 
                            />
                        </div>
                    </div>
                ))}
             </div>

             <div className="h-[1px] bg-zinc-900" />

             <div className="flex justify-between items-end">
                <div>
                   <p className="text-zinc-600 text-[8px] tracking-[4px] uppercase mb-1">SIGNATURE_STRIKE</p>
                   <p className="text-white text-xs font-black uppercase italic tracking-tighter">
                       {char.moveset?.finishers[0]?.name || 'SOVEREIGN_END'}
                   </p>
                </div>
                <div className="text-right">
                   <p className="text-zinc-600 text-[8px] tracking-[4px] uppercase mb-1">MGR_INDEX</p>
                   <p className="text-white text-xs font-black uppercase italic">{char.manager?.toUpperCase() || 'STANDALONE'}</p>
                </div>
             </div>
          </div>
        </div>

        <CharacterPreview data={char} autoRotate className={`absolute bottom-0 ${side === 'left' ? '-left-1/4' : '-right-1/4'} w-[150%] h-[150%] z-0 opacity-40 mix-blend-screen pointer-events-none`} />
      </div>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 bg-[#0a0a0c] flex flex-col z-[100] p-4 lg:p-8 overflow-hidden"
    >
      <div className="flex-none flex justify-between items-center mb-6 lg:mb-12 relative z-50">
        <button onClick={onBack} className="px-6 lg:px-10 py-3 lg:py-4 bg-zinc-900/50 border border-zinc-800 hover:border-white transition-all text-zinc-500 hover:text-white uppercase text-[9px] lg:text-[10px] tracking-[6px] font-black italic flex-none">
          ← ABORT_ROUTER
        </button>
        <div className="flex flex-col items-center">
            <div className="text-[8px] lg:text-[10px] font-black text-red-600 tracking-[8px] lg:tracking-[12px] uppercase mb-1">ROSTER_SYNTHESIS</div>
            <div className="text-2xl lg:text-4xl font-black italic tracking-tighter text-white uppercase leading-none">
              SUPERSTAR <span className="text-zinc-600">SELECTION</span>
            </div>
        </div>
        <button onClick={() => onConfirm(p1, p1CPU, p2, p2CPU, selectedTitle)} className="px-8 lg:px-12 py-3 lg:py-4 bg-white text-black font-black uppercase text-[9px] lg:text-[10px] tracking-[6px] lg:tracking-[8px] -skew-x-12 hover:bg-red-600 hover:text-white transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)] flex-none">
          <span className="inline-block skew-x-12">START MATCH</span>
        </button>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-4 overflow-hidden relative">
        <SelectionCard char={p1} isCPU={p1CPU} side="left" />
        
        {/* Selection Grid Center */}
        <div className="w-full lg:w-[600px] xl:w-[700px] flex flex-col gap-4 z-20 min-h-0">
           <div className="bg-zinc-950/80 border border-white/5 p-4 space-y-3 backdrop-blur-xl flex-none">
              <div className="relative">
                 <input 
                    type="text" 
                    placeholder="SCAN_BIOMETRICS..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-black/50 border border-zinc-800 p-3 lg:p-4 text-[10px] lg:text-[11px] font-bold tracking-[4px] text-white uppercase outline-none focus:border-red-600 transition-all font-mono"
                 />
                 <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[8px] font-black text-red-600 animate-pulse hidden sm:block">SEARCHING_ACTIVE</div>
              </div>
              <div className="flex gap-2">
                 {['all', 'male', 'female'].map(g => (
                    <button 
                      key={g} 
                      onClick={() => setFilterGender(g as any)}
                      className={`flex-1 py-1.5 lg:py-2 text-[8px] lg:text-[9px] font-black uppercase tracking-[2px] lg:tracking-[4px] transition-all border ${filterGender === g ? 'bg-white text-black border-white' : 'bg-zinc-900/50 text-zinc-600 border-zinc-800 hover:text-zinc-400'}`}
                    >
                       {g === 'all' ? 'FULL_ARRAY' : g}
                    </button>
                 ))}
              </div>
           </div>

           <div className="flex-1 bg-zinc-950/80 border border-white/5 p-4 overflow-y-auto custom-scrollbar backdrop-blur-xl min-h-0">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-3">
                 {filteredSuperstars.map((s) => {
                    const originalIndex = availableSuperstars.indexOf(s);
                    const isP1 = p1Index === originalIndex;
                    const isP2 = p2Index === originalIndex;
                    return (
                        <motion.div
                        key={s.name + originalIndex}
                        whileHover={{ scale: 1.02, y: -2 }}
                        onClick={() => {
                            if (focus === 'p1') setP1Index(originalIndex); else setP2Index(originalIndex);
                        }}
                        className={`relative cursor-pointer aspect-[3/4] border transition-all duration-300 ${
                            (isP1 || isP2) ? 'border-red-600 shadow-[0_0_30px_rgba(220,38,38,0.2)]' : 'border-zinc-900 opacity-60 hover:opacity-100 hover:border-zinc-700'
                        } bg-zinc-900 group overflow-hidden`}
                        >
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
                        
                        <div className="absolute inset-0 flex items-center justify-center opacity-10 blur-sm group-hover:blur-none transition-all">
                             <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${s.name}`} alt="" className="w-full h-full object-cover" />
                        </div>

                        <div className="absolute bottom-2 left-2 right-2 z-20">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-[6px] text-zinc-500 uppercase font-black tracking-widest">{s.gender}</span>
                                {isP1 && <span className="text-red-600 font-bold text-[7px]" style={{ textShadow: '0 0 5px rgba(220,38,38,0.5)' }}>PLAYER_1</span>}
                                {isP2 && <span className="text-cyan-400 font-bold text-[7px]" style={{ textShadow: '0 0 5px rgba(34,211,238,0.5)' }}>PLAYER_2</span>}
                            </div>
                            <p className="text-[10px] lg:text-xs text-white font-black uppercase italic tracking-tighter truncate leading-none">{s.name}</p>
                        </div>

                        {(isP1 || isP2) && (
                            <motion.div 
                                layoutId="select-indicator"
                                className={`absolute top-0 right-0 w-6 h-6 lg:w-8 lg:h-8 ${isP1 ? 'bg-red-600' : 'bg-cyan-600'} flex items-center justify-center font-black text-white text-[10px] lg:text-[12px] z-20`}
                            >
                                {isP1 ? '1' : '2'}
                            </motion.div>
                        )}
                        </motion.div>
                    );
                 })}
              </div>
           </div>
           
           <div className="flex-none bg-zinc-950/80 border border-white/5 p-4 lg:p-8 backdrop-blur-xl">
              <div className="space-y-4 lg:space-y-6">
                 <div>
                    <p className="text-[9px] lg:text-[10px] text-zinc-500 font-black tracking-[4px] uppercase mb-2 lg:mb-3 border-b border-zinc-900 pb-2">CHAMPIONSHIP_STAKES</p>
                    <select 
                        value={selectedTitle}
                        onChange={(e) => setSelectedTitle(e.target.value === 'none' ? undefined : e.target.value)}
                        className="w-full bg-zinc-900 text-white text-[9px] lg:text-[10px] p-2 lg:p-4 font-black border border-zinc-800 uppercase focus:border-green-600 outline-none transition-all cursor-pointer"
                    >
                        {CHAMPIONSHIPS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                 </div>

                 <div className="grid grid-cols-2 gap-3 lg:gap-4">
                    <button 
                      onClick={() => setFocus('p1')}
                      className={`relative overflow-hidden group py-3 lg:py-4 text-[9px] lg:text-[10px] font-black uppercase tracking-[2px] lg:tracking-[4px] border transition-all ${focus === 'p1' ? 'bg-red-600 text-white border-red-600' : 'bg-zinc-900/50 text-zinc-600 border-zinc-800'}`}
                    >
                       <span className="relative z-10">ARCHITECT_P1</span>
                       {focus === 'p1' && <motion.div layoutId="focus-bar" className="absolute bottom-0 left-0 right-0 h-1 bg-white" />}
                    </button>
                    <button 
                      onClick={() => setFocus('p2')}
                      className={`relative overflow-hidden group py-3 lg:py-4 text-[9px] lg:text-[10px] font-black uppercase tracking-[2px] lg:tracking-[4px] border transition-all ${focus === 'p2' ? 'bg-cyan-600 text-white border-cyan-600' : 'bg-zinc-900/50 text-zinc-600 border-zinc-800'}`}
                    >
                       <span className="relative z-10">ARCHITECT_P2</span>
                       {focus === 'p2' && <motion.div layoutId="focus-bar" className="absolute bottom-0 left-0 right-0 h-1 bg-white" />}
                    </button>
                 </div>

                 <div className="flex justify-between items-center text-[8px] lg:text-[10px] font-black tracking-[2px] text-zinc-700 italic">
                    <span>[1] Toggle P1 CPU</span>
                    <span>[2] Toggle P2 CPU</span>
                 </div>
              </div>
           </div>
        </div>

        <SelectionCard char={p2} isCPU={p2CPU} side="right" />
      </div>

      <div className="flex-none h-16 lg:h-24 flex items-center justify-center gap-6 lg:gap-12 text-[8px] lg:text-[10px] tracking-[2px] lg:tracking-[4px] text-zinc-600 font-bold uppercase relative z-50">
         <div>SELECT SUPERSTAR // SIGNAL ACTIVE</div>
         <div className="w-1.5 h-1.5 bg-red-600 animate-pulse rounded-full" />
         <div>SECTOR 7-B ARENA // READY</div>
      </div>
    </motion.div>
  );
};
