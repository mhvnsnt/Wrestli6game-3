import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sword, Shield, Zap, Skull, Trophy, Users, Star } from 'lucide-react';
import { sounds } from '../engine/audio';

interface MatchSelectionProps {
  onSelect: (category: string, type: string) => void;
  onBack: () => void;
}

const CATEGORIES = [
  { id: '1v1', name: '1 ON 1', icon: <Users size={20} /> },
  { id: '2v2', name: '2 ON 2', icon: <Users size={20} /> },
  { id: 'triple_threat', name: 'TRIPLE THREAT', icon: <Users size={20} /> },
  { id: 'fatal_4_way', name: 'FATAL 4-WAY', icon: <Users size={20} /> },
  { id: 'hardcore', name: 'HARDCORE', icon: <Skull size={20} /> },
  { id: 'rumble', name: 'ROYAL RUMBLE', icon: <Trophy size={20} /> },
  { id: 'specialty', name: 'SPECIALTY', icon: <Zap size={20} /> },
  { id: 'backstage', name: 'BACKSTAGE', icon: <Sword size={20} /> },
];

const MATCH_TYPES: Record<string, { id: string, name: string, desc: string }[]> = {
  '1v1': [
    { id: 'standard', name: 'NORMAL', desc: 'Standard rules. Pin or submission.' },
    { id: 'submission', name: 'SUBMISSION', desc: 'Victory only via surrender. Pinning disabled.' },
    { id: 'iron_man', name: 'IRON MAN', desc: 'Most falls in the time limit wins.' },
    { id: 'no_dq', name: 'EXTREME RULES', desc: 'No disqualifications. Anything goes.' },
    { id: 'falls_anywhere', name: 'FALLS COUNT ANYWHERE', desc: 'Pin or submit anywhere in the arena.' },
  ],
  'hardcore': [
    { id: 'deathmatch', name: 'BARBED WIRE', desc: 'Explosive ropes and barbed wire everywhere.' },
    { id: 'blood', name: 'FIRST BLOOD', desc: 'First person to bleed loses the match.' },
    { id: 'inferno', name: 'INFERNO MATCH', desc: 'Surround the ring with flames.' },
    { id: 'cage_extreme', name: 'STEEL CAGE', desc: 'Traditional steel cage match.' },
  ],
  'rumble': [
    { id: 'rumble_30', name: '30-MAN RUMBLE', desc: 'Over the top rope elimination. Last one standing.' },
    { id: 'gauntlet', name: 'GAUNTLET', desc: 'Defeat consecutive opponents to win.' },
  ],
  'specialty': [
    { id: 'ladder', name: 'LADDER MATCH', desc: 'Climb the ladder and retrieve the prize.' },
    { id: 'chamber', name: 'ELIMINATION CHAMBER', desc: '6 men enter, 1 man leaves the structure.' },
    { id: 'wargames', name: 'WAR GAMES', desc: 'Two rings, one giant cage.' },
  ]
};

export const MatchSelection: React.FC<MatchSelectionProps> = ({ onSelect, onBack }) => {
  const [activeCategoryIdx, setActiveCategoryIdx] = useState(0);
  const [activeTypeIdx, setActiveTypeIdx] = useState(0);
  const [focusArea, setFocusArea] = useState<'category' | 'type' | 'options'>('category');
  
  // Match Rules State
  const [rules, setRules] = useState({
    pin: true,
    submission: true,
    ropeBreak: false,
    disqualification: true,
    timeLimit: 15,
    healthMultiplier: 1.0,
    weaponFrequency: 'Normal'
  });

  const [activeOptionIdx, setActiveOptionIdx] = useState(0);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      
      if (key === 'escape' || key === 'b') {
        if (focusArea === 'options') setFocusArea('type');
        else if (focusArea === 'type') setFocusArea('category');
        else onBack();
        return;
      }

      const types = MATCH_TYPES[CATEGORIES[activeCategoryIdx].id] || [];

      if (focusArea === 'category') {
        if (key === 'w' || key === 'arrowup') setActiveCategoryIdx(prev => (prev > 0 ? prev - 1 : CATEGORIES.length - 1));
        if (key === 's' || key === 'arrowdown') setActiveCategoryIdx(prev => (prev < CATEGORIES.length - 1 ? prev + 1 : 0));
        if (key === 'd' || key === 'arrowright' || key === 'enter' || key === 'f') {
          setFocusArea('type');
          setActiveTypeIdx(0);
        }
      } else if (focusArea === 'type') {
        if (key === 'w' || key === 'arrowup') setActiveTypeIdx(prev => (prev > 0 ? prev - 1 : types.length - 1));
        if (key === 's' || key === 'arrowdown') setActiveTypeIdx(prev => (prev < types.length - 1 ? prev + 1 : 0));
        if (key === 'a' || key === 'arrowleft') setFocusArea('category');
        if (key === 'd' || key === 'arrowright') setFocusArea('options');
        if (key === 'enter' || key === 'f') {
          onSelect(CATEGORIES[activeCategoryIdx].id, types[activeTypeIdx].id);
        }
      } else if (focusArea === 'options') {
        const optionKeys = ['pin', 'submission', 'ropeBreak', 'disqualification', 'timeLimit', 'healthMultiplier', 'weaponFrequency'] as const;
        if (key === 'w' || key === 'arrowup') setActiveOptionIdx(prev => (prev > 0 ? prev - 1 : optionKeys.length - 1));
        if (key === 's' || key === 'arrowdown') setActiveOptionIdx(prev => (prev < optionKeys.length - 1 ? prev + 1 : 0));
        if (key === 'a' || key === 'arrowleft') setFocusArea('type');
        
        if (key === 'd' || key === 'arrowright' || key === 'enter' || key === 'f') {
           const ruleKey = optionKeys[activeOptionIdx];
           setRules(prev => {
             const next = { ...prev };
             if (typeof (next as any)[ruleKey] === 'boolean') {
               (next as any)[ruleKey] = !(next as any)[ruleKey];
             } else if (ruleKey === 'timeLimit') {
               next.timeLimit = next.timeLimit >= 60 ? 5 : next.timeLimit + 5;
             } else if (ruleKey === 'healthMultiplier') {
               next.healthMultiplier = next.healthMultiplier >= 3.0 ? 0.5 : next.healthMultiplier + 0.5;
             } else if (ruleKey === 'weaponFrequency') {
               const freqs = ['None', 'Low', 'Normal', 'High', 'Extreme'];
               const currentIdx = freqs.indexOf(next.weaponFrequency);
               next.weaponFrequency = freqs[(currentIdx + 1) % freqs.length];
             }
             return next;
           });
           sounds.playImpact('light'); 
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activeCategoryIdx, activeTypeIdx, focusArea, activeOptionIdx, rules, onBack, onSelect]);

  const toggleRule = (ruleKey: string) => {
    setRules(prev => {
        const next = { ...prev };
        if (typeof (next as any)[ruleKey] === 'boolean') {
          (next as any)[ruleKey] = !(next as any)[ruleKey];
        } else if (ruleKey === 'timeLimit') {
          next.timeLimit = next.timeLimit >= 60 ? 5 : next.timeLimit + 5;
        } else if (ruleKey === 'healthMultiplier') {
          next.healthMultiplier = next.healthMultiplier >= 3.0 ? 0.5 : next.healthMultiplier + 0.5;
        } else if (ruleKey === 'weaponFrequency') {
          const freqs = ['None', 'Low', 'Normal', 'High', 'Extreme'];
          const currentIdx = freqs.indexOf(next.weaponFrequency);
          next.weaponFrequency = freqs[(currentIdx + 1) % freqs.length];
        }
        return next;
      });
      sounds.playImpact('light');
  };

  const currentTypes = MATCH_TYPES[CATEGORIES[activeCategoryIdx].id] || [{ id: 'na', name: 'NOT AVAILABLE', desc: 'Locked in this sector.' }];

  return (
    <div className="fixed inset-0 bg-black/98 z-[500] flex flex-col font-['Orbitron'] text-white p-6 lg:p-12 overflow-hidden backdrop-blur-xl">
      {/* Progress Monitor */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-zinc-900 flex">
         <motion.div 
            animate={{ width: focusArea === 'category' ? '33.3%' : focusArea === 'type' ? '66.6%' : '100%' }}
            className="h-full bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.8)]" 
         />
      </div>

      {/* Header */}
      <header className="flex-none flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 lg:mb-12 gap-4 lg:gap-0">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <span className={`h-2 w-2 rounded-full ${focusArea === 'category' ? 'bg-red-600 animate-pulse' : 'bg-zinc-700'}`} />
              <span className={`h-2 w-2 rounded-full ${focusArea === 'type' ? 'bg-red-600 animate-pulse' : 'bg-zinc-700'}`} />
              <span className={`h-2 w-2 rounded-full ${focusArea === 'options' ? 'bg-red-600 animate-pulse' : 'bg-zinc-700'}`} />
              <span className="text-[10px] font-black text-zinc-500 tracking-[5px] uppercase ml-2">MATCH_SETUP_PHASE_{focusArea === 'category' ? '01' : focusArea === 'type' ? '02' : '03'}</span>
           </div>
          <h1 className="text-4xl lg:text-7xl font-black italic tracking-tighter uppercase leading-none">
            MATCH <span className="text-red-600">SELECTION</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-8">
            <div className="text-right hidden sm:block">
                <span className="text-[10px] font-black text-zinc-600 tracking-widest uppercase">SELECTED_TYPE</span>
                <p className="text-white font-black italic">{CATEGORIES[activeCategoryIdx].name} // {currentTypes[activeTypeIdx]?.name || 'PENDING'}</p>
            </div>
            <button onClick={onBack} className="px-8 py-3 bg-zinc-900 text-zinc-500 border border-zinc-800 hover:border-white transition-all text-[9px] font-black tracking-[4px] uppercase italic">
              ← RETURN_HUB
            </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 lg:gap-12 min-h-0 relative">
        {/* Selection Indicator Background */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.02]">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_50%,rgba(220,38,38,1),transparent_50%)]" />
        </div>

        {/* Categories List */}
        <div className="w-full lg:w-80 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto custom-scrollbar pr-2 relative z-10 flex-none min-h-0">
          <h3 className="hidden lg:block text-[10px] font-black text-zinc-700 tracking-[5px] uppercase mb-4 pl-5">CATEGORIES</h3>
          <div className="flex lg:flex-col gap-2">
            {CATEGORIES.map((cat, idx) => (
              <motion.button
                key={cat.id}
                onClick={() => { setActiveCategoryIdx(idx); setFocusArea('category'); }}
                onMouseEnter={() => { if (focusArea !== 'options') setActiveCategoryIdx(idx); }}
                animate={{ 
                  x: activeCategoryIdx === idx ? 10 : 0, 
                  backgroundColor: activeCategoryIdx === idx ? 'rgba(220,38,38,1)' : 'rgba(24,24,27,0.4)',
                  borderColor: activeCategoryIdx === idx ? 'rgba(220,38,38,1)' : 'rgba(39,39,42,1)'
                }}
                className={`
                  flex items-center gap-4 p-4 lg:p-5 text-left border transition-all relative flex-none w-48 lg:w-full
                  ${activeCategoryIdx === idx ? 'shadow-[0_0_30px_rgba(220,38,38,0.4)]' : 'text-zinc-500 hover:text-white'}
                  ${focusArea === 'category' && activeCategoryIdx === idx ? 'ring-2 ring-white z-20 outline-none' : ''}
                `}
              >
                <div className={`${activeCategoryIdx === idx ? 'text-white' : 'text-zinc-600'}`}>{cat.icon}</div>
                <span className={`text-[10px] lg:text-[11px] font-black tracking-widest uppercase italic transition-all ${activeCategoryIdx === idx ? 'scale-105' : ''}`}>{cat.name}</span>
                {activeCategoryIdx === idx && (
                  <motion.div 
                    layoutId="cat-indicator"
                    className="absolute -left-1 top-0 bottom-0 w-1 bg-white"
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Types List */}
        <div className="flex-1 flex flex-col gap-2 overflow-y-auto custom-scrollbar pr-4 relative z-10 min-h-0">
          <h3 className="text-[10px] font-black text-zinc-700 tracking-[5px] uppercase mb-4 pl-8">MATCH_VARIANTS</h3>
          <div className="flex flex-col gap-2">
            {currentTypes.map((type, idx) => (
              <motion.button
                key={type.id}
                onClick={() => { 
                    setActiveTypeIdx(idx); 
                    setFocusArea('type');
                    if (activeTypeIdx === idx && focusArea === 'type') {
                        onSelect(CATEGORIES[activeCategoryIdx].id, currentTypes[activeTypeIdx].id);
                    }
                }}
                onMouseEnter={() => { setActiveTypeIdx(idx); if (focusArea !== 'options') setFocusArea('type'); }}
                animate={{ 
                  x: focusArea === 'type' && activeTypeIdx === idx ? 20 : 0, 
                  backgroundColor: focusArea === 'type' && activeTypeIdx === idx ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.02)',
                  borderColor: focusArea === 'type' && activeTypeIdx === idx ? 'rgba(220,38,38,0.5)' : 'rgba(39,39,42,1)'
                }}
                className={`
                  group p-6 lg:p-8 text-left border flex justify-between items-center transition-all relative
                  ${focusArea === 'type' && activeTypeIdx === idx ? 'text-white shadow-[0_0_40px_rgba(0,0,0,0.5)]' : 'text-zinc-600'}
                  ${focusArea === 'type' && activeTypeIdx === idx ? 'ring-1 ring-red-600/50 outline-none' : ''}
                `}
              >
                {focusArea === 'type' && activeTypeIdx === idx && (
                  <div className="absolute inset-y-0 left-0 w-1 bg-red-600" />
                )}
                <div className="flex flex-col gap-1">
                  <h3 className={`text-2xl lg:text-4xl font-black italic tracking-tighter uppercase transition-all ${focusArea === 'type' && activeTypeIdx === idx ? 'text-white' : 'group-hover:text-zinc-300'}`}>{type.name}</h3>
                  <p className="text-[10px] lg:text-[11px] font-bold tracking-[4px] opacity-40 uppercase truncate max-w-md">{type.desc}</p>
                </div>
                <div className={`w-12 h-12 lg:w-14 lg:h-14 border-2 flex items-center justify-center transition-all flex-none ${focusArea === 'type' && activeTypeIdx === idx ? 'border-red-600 bg-red-600 text-white' : 'border-zinc-800 text-zinc-800 group-hover:border-zinc-700'}`}>
                  <span className="text-lg lg:text-xl font-black italic">{idx + 1}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Preview & Options Panel */}
        <div className="w-full lg:w-[450px] flex flex-col gap-6 relative z-10 min-h-0">
          <div className="aspect-video bg-zinc-900 border border-zinc-800 relative overflow-hidden group flex-none">
             <div className="absolute inset-0 bg-gradient-to-t from-red-900/40 via-transparent to-transparent" />
             <div className="absolute inset-0 flex items-center justify-center">
                <Skull size={100} className="text-zinc-800 opacity-20 transition-transform group-hover:scale-110 duration-1000" />
             </div>
             <motion.div 
               animate={{ top: ['0%', '100%', '0%'] }}
               transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
               className="absolute left-0 w-full h-[2px] bg-red-600 opacity-40" 
             />
             
             <div className="absolute bottom-6 left-8">
                <span className="text-[10px] font-black tracking-[4px] text-zinc-500 uppercase">PREVIEW</span>
                <h4 className="text-2xl lg:text-3xl font-black italic text-white uppercase tracking-tighter leading-none">{currentTypes[activeTypeIdx]?.name}</h4>
             </div>
          </div>

          <div className={`p-6 lg:p-8 bg-zinc-900/50 border transition-all duration-300 flex-1 flex flex-col justify-between overflow-y-auto custom-scrollbar ${focusArea === 'options' ? 'border-red-600 shadow-[0_0_50px_rgba(220,38,38,0.2)] bg-zinc-900/80' : 'border-zinc-800'}`}>
             <div className="space-y-6">
                <div className="flex justify-between items-end border-b border-zinc-800 pb-2">
                    <h5 className="text-[10px] font-black text-red-600 tracking-[6px] uppercase">MATCH_RULES</h5>
                    <span className="text-[8px] font-bold text-zinc-600 tracking-[2px] uppercase">CLICK_TO_CHANGE</span>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                   {[
                     { label: 'PINFALL', val: rules.pin ? 'ON' : 'OFF', key: 'pin' },
                     { label: 'SUBMISSION', val: rules.submission ? 'ON' : 'OFF', key: 'submission' },
                     { label: 'ROPE BREAK', val: rules.ropeBreak ? 'ON' : 'OFF', key: 'ropeBreak' },
                     { label: 'DQ ENABLED', val: rules.disqualification ? 'ON' : 'OFF', key: 'disqualification' },
                     { label: 'TIME LIMIT', val: `${rules.timeLimit} MIN`, key: 'timeLimit' },
                     { label: 'HEALTH BUFF', val: `x${rules.healthMultiplier}`, key: 'healthMultiplier' },
                     { label: 'WEAPONS', val: rules.weaponFrequency, key: 'weaponFrequency' },
                   ].map((opt, i) => (
                     <button 
                        key={opt.key}
                        onMouseEnter={() => { setActiveOptionIdx(i); setFocusArea('options'); }}
                        onClick={() => toggleRule(opt.key)}
                        className={`flex justify-between items-center p-3 border transition-all w-full text-left font-['Orbitron'] ${focusArea === 'options' && activeOptionIdx === i ? 'bg-white text-black border-white' : 'border-zinc-800 text-zinc-500 hover:border-zinc-600'}`}
                     >
                        <span className="text-[9px] font-black tracking-widest uppercase">{opt.label}</span>
                        <span className="text-[11px] font-black italic uppercase tracking-tighter">{opt.val}</span>
                     </button>
                   ))}
                </div>
             </div>

             <div className="space-y-4 pt-6">
                <div className="hidden lg:block p-4 bg-red-600/5 border border-red-600/20 text-[9px] font-mono text-zinc-500 leading-relaxed uppercase">
                   <span className="text-red-500 font-bold block mb-1">MATCH_LOG:</span>
                   "Structural integrity for {CATEGORIES[activeCategoryIdx].name} is confirmed. Rules are pending enforcement."
                </div>
                <div className="flex gap-4">
                    <button onClick={onBack} className="flex-1 py-4 border border-zinc-700 text-zinc-500 font-black uppercase text-[10px] tracking-[4px] hover:text-white hover:border-white transition-all">ABORT</button>
                    <button 
                      onClick={() => onSelect(CATEGORIES[activeCategoryIdx].id, currentTypes[activeTypeIdx].id)}
                      className="flex-1 py-4 bg-red-600 text-white font-black uppercase text-[10px] tracking-[4px] hover:bg-white hover:text-black transition-all shadow-[0_0_30px_rgba(220,38,38,0.4)]"
                    >
                      CONFIRM
                    </button>
                </div>
             </div>
          </div>
        </div>
      </div>

      <footer className="mt-8 lg:mt-12 flex justify-between items-center pt-8 border-t border-zinc-900 text-[8px] font-black text-zinc-700 tracking-[10px] uppercase flex-none">
        <span className="hidden sm:block">© SOVEREIGN_STRIKE_MATCH_SYSTEM // 2026 // VERSION 9.0</span>
        <div className="flex gap-8">
            <span>[W/S] NAVIGATE</span>
            <span>[ENTER] SELECT</span>
            <span>[B] BACK</span>
        </div>
      </footer>
    </div>
  );
};

