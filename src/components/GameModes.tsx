/**
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CharacterData } from '../types';
import { Users, Trophy, Settings, Sword } from 'lucide-react';

interface GameModesProps {
  mode: 'career' | 'gm' | 'universe' | 'faction';
  onBack: () => void;
  playerChar: CharacterData;
}

export const GameModes: React.FC<GameModesProps> = ({ mode, onBack, playerChar }) => {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
        if (e.key.toLowerCase() === 'escape' || e.key.toLowerCase() === 'b') onBack();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onBack]);

  const [activeStep, setActiveStep] = useState(0);

  const renderCareer = () => (
    <div className="space-y-8">
      <div className="flex items-center gap-6 mb-12">
        <div className="w-24 h-24 border-2 border-red-600 rotate-45 flex items-center justify-center">
            <Trophy size={40} className="-rotate-45" />
        </div>
        <div>
            <h1 className="text-6xl font-black italic tracking-tighter italic uppercase underline decoration-red-600 underline-offset-8">THE_CORE_UNLOCKED</h1>
            <p className="text-zinc-500 font-bold tracking-[8px] uppercase mt-2">CAREER AUDIT // SUBJECT: {playerChar.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="col-span-2 space-y-4">
            <div className="bg-zinc-900/50 border border-zinc-800 p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 bg-red-600 text-black text-[10px] font-black uppercase">CURRENT_CONTRACT</div>
                <h2 className="text-2xl font-black text-white italic mb-4">WEEK 1: THE INITIATION</h2>
                <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                    You have entered the 8th house. The Sovereign Architect is watching. Your first task is to clear the debts of the lower bracket. Beat three opponents to unlock the next sector.
                </p>
                <div className="flex gap-4">
                    <button className="px-12 py-4 bg-white text-black font-black uppercase hover:bg-red-600 hover:text-white transition-all shadow-lg text-[10px] tracking-[4px]">START_EVOLUTION</button>
                    <button className="px-12 py-4 border border-zinc-700 text-zinc-500 font-black uppercase hover:text-white transition-all text-[10px] tracking-[4px]">VIEW_STORYBOARD</button>
                </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <div className="p-6 border border-zinc-800 bg-zinc-900/20">
                  <span className="text-zinc-600 text-[10px] font-black uppercase tracking-[2px]">MOMENTUM</span>
                  <div className="h-1 bg-zinc-800 mt-2"><div className="h-full bg-red-600 w-1/4" /></div>
               </div>
               <div className="p-6 border border-zinc-800 bg-zinc-900/20">
                  <span className="text-zinc-600 text-[10px] font-black uppercase tracking-[2px]">FACTION_STANDING</span>
                  <div className="h-1 bg-zinc-800 mt-2"><div className="h-full bg-cyan-600 w-1/2" /></div>
               </div>
            </div>
        </div>
        
        <div className="bg-zinc-950 border border-red-600/20 p-8 space-y-6">
            <h3 className="text-zinc-500 font-bold text-[10px] tracking-[4px] uppercase border-b border-zinc-900 pb-2">THE_WARDEN_SATURN</h3>
            <div className="text-sm text-zinc-400 font-mono">
                "Restriction is your weapon. Master the limit to break the cycle."
            </div>
            <div className="space-y-4">
                <div className="flex items-center justify-between text-[10px] font-black">
                    <span className="text-zinc-600">AUDIT_PROGRESS</span>
                    <span className="text-red-500">12%</span>
                </div>
                <div className="flex items-center justify-between text-[10px] font-black">
                    <span className="text-zinc-600">DEBT_CLEARED</span>
                    <span className="text-white">$2,400</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );

  const renderGM = () => (
    <div className="space-y-8">
        <div className="flex justify-between items-end mb-12 border-b border-zinc-900 pb-8">
            <div>
                <h1 className="text-7xl font-black italic tracking-tighter uppercase leading-none">GM_STRAT <span className="text-red-600">AUDIT</span></h1>
                <p className="text-zinc-500 font-bold tracking-[8px] uppercase mt-4">Executive Oversight // Branding: MONDAY_AUDIT</p>
            </div>
            <div className="text-right">
                <div className="flex gap-12 items-end mb-4">
                    <div>
                        <span className="text-[10px] font-black text-zinc-700 tracking-[4px] uppercase block mb-1">AUDIENCE_INDEX</span>
                        <span className="text-2xl font-black text-white italic">4.2M</span>
                    </div>
                    <div>
                        <span className="text-[10px] font-black text-zinc-700 tracking-[4px] uppercase block mb-1">CORE_BUDGET</span>
                        <span className="text-2xl font-black text-white italic">$104,200</span>
                    </div>
                </div>
                <button className="px-12 py-3 bg-red-600 text-white text-[10px] font-black uppercase tracking-[4px]">FINALIZE_BROADCAST</button>
            </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Show Segments */}
            <div className="xl:col-span-2 space-y-6">
                <h3 className="text-sm font-black italic tracking-[6px] uppercase text-zinc-500 flex items-center gap-4">
                    <span className="w-8 h-[2px] bg-red-600" />
                    SHOW_SEGMENTS
                </h3>
                
                <div className="space-y-4">
                    {[
                      { time: '19:00', type: 'PROMO', title: 'The Opening Audit', subject: 'The Architect', energy: 85 },
                      { time: '19:15', type: 'MATCH', title: '1v1 Technical Bout', subject: 'Reaper vs. King', energy: 92 },
                      { time: '19:45', type: 'BRAWL', title: 'Backstage Conflict', subject: 'Security Breach', energy: 78 },
                      { time: '20:00', type: 'CONTRACT', title: 'Title Unification', subject: 'Final Signature', energy: 95 },
                    ].map((seg, i) => (
                        <motion.div 
                          key={i}
                          whileHover={{ x: 10 }}
                          className="flex items-center gap-6 p-6 bg-zinc-900 border border-zinc-800 hover:border-red-600 group transition-all"
                        >
                            <div className="text-2xl font-black italic text-zinc-800 group-hover:text-red-600 transition-colors">{seg.time}</div>
                            <div className="w-12 h-[2px] bg-zinc-800" />
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <span className="px-2 py-0.5 bg-zinc-800 text-zinc-400 text-[8px] font-black tracking-widest">{seg.type}</span>
                                    <span className="text-white text-xs font-black uppercase italic tracking-tighter">{seg.title}</span>
                                </div>
                                <p className="text-[10px] text-zinc-600 font-bold tracking-widest uppercase">{seg.subject}</p>
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] font-black text-red-600">{seg.energy}%</span>
                                <div className="w-24 h-1 bg-zinc-800 mt-2">
                                    <div className="h-full bg-red-600" style={{ width: seg.energy + '%' }} />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    
                    <button className="w-full py-6 border-2 border-dashed border-zinc-900 text-zinc-700 hover:text-white hover:border-zinc-700 font-black uppercase text-[10px] tracking-[8px] transition-all">
                        + INJECT_SEGMENT_DATA
                    </button>
                </div>
            </div>

            {/* Roster & Stats */}
            <div className="space-y-8">
                <div className="p-8 bg-zinc-950 border border-zinc-900 relative h-fit">
                    <div className="absolute top-0 right-0 p-2 bg-red-600 text-black text-[8px] font-black uppercase">LIVE_DASHBOARD</div>
                    <h4 className="text-[10px] font-black text-zinc-500 tracking-[4px] uppercase mb-6">TOP_VIEW_DRIVERS</h4>
                    <div className="space-y-4">
                        {[
                          { name: 'THE ARCHITECT', power: 98, status: 'AVAILABLE' },
                          { name: 'SPECTRAL REAPER', power: 95, status: 'INJURED' },
                          { name: 'SOVEREIGN KING', power: 94, status: 'AVAILABLE' },
                        ].map((p, i) => (
                           <div key={i} className="flex justify-between items-center bg-zinc-900/50 p-4 border border-zinc-800">
                               <div>
                                   <p className="text-[11px] font-black text-white italic">{p.name}</p>
                                   <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest">{p.status}</p>
                               </div>
                               <span className="text-lg font-black italic text-red-600">{p.power}</span>
                           </div>
                        ))}
                    </div>
                    
                    <div className="mt-12 pt-8 border-t border-zinc-900">
                        <div className="flex justify-between text-[10px] font-black uppercase mb-4">
                            <span className="text-zinc-600">FATIGUE_OVERALL</span>
                            <span className="text-white">12.4%</span>
                        </div>
                        <div className="h-1 bg-zinc-800"><div className="h-full bg-red-600 w-1/4" /></div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 bg-zinc-900 border border-zinc-800 flex flex-col justify-center items-center text-center cursor-pointer hover:border-red-600 transition-all">
                        <Users size={16} className="text-zinc-500 mb-2" />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest leading-tight">ROSTER_MGT</span>
                    </div>
                    <div className="p-6 bg-zinc-900 border border-zinc-800 flex flex-col justify-center items-center text-center cursor-pointer hover:border-red-600 transition-all">
                        <Settings size={16} className="text-zinc-500 mb-2" />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest leading-tight">BRAND_OPTS</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );

  const renderUniverse = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-12">
        <div>
           <h1 className="text-6xl font-black italic tracking-tighter uppercase underline decoration-red-600 underline-offset-8">UNIVERSE_CHRT</h1>
           <p className="text-zinc-500 font-bold tracking-[8px] uppercase mt-2">DYNAMO_CHART // LIVE_SYSTEM</p>
        </div>
        <div className="text-right p-4 border-l border-red-600 bg-zinc-900/40">
           <span className="text-zinc-600 text-[10px] font-black uppercase tracking-[4px]">NEXT_BIG_EVENT</span>
           <p className="text-white font-black italic text-xl uppercase tracking-tighter">SURVIVOR_SERIES_ULTRA</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
           <h3 className="text-sm font-black italic tracking-[4px] uppercase text-zinc-500 border-b border-zinc-900 pb-2">POWER_RANKINGS</h3>
           <div className="space-y-2">
              {[
                { name: 'THE SPECTRAL REAPER', rank: 1, trend: 'up' },
                { name: 'THE TRIBAL CHIEF_X', rank: 2, trend: 'down' },
                { name: playerChar.name, rank: 3, trend: 'up' },
                { name: 'THE SOVEREIGN KING', rank: 4, trend: 'stable' },
                { name: 'MAMY_DARKNESS', rank: 5, trend: 'up' },
              ].map(r => (
                <div key={r.name} className="flex items-center justify-between p-4 bg-zinc-950 border border-zinc-900 hover:border-zinc-700 transition-all">
                   <div className="flex items-center gap-4">
                      <span className="text-xl font-black italic text-red-600">#{r.rank}</span>
                      <span className="text-[11px] font-black italic text-white uppercase">{r.name}</span>
                   </div>
                   <div className={`w-2 h-2 ${r.trend === 'up' ? 'bg-green-500' : r.trend === 'down' ? 'bg-red-500' : 'bg-zinc-500'}`} />
                </div>
              ))}
           </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
            <h3 className="text-sm font-black italic tracking-[4px] uppercase text-zinc-500 border-b border-zinc-900 pb-2">CHAMPIONSHIP_DATABASE</h3>
            <div className="grid grid-cols-2 gap-4">
                {[
                  { title: 'CORE_CHAMPIONSHIP', holder: 'THE SPECTRAL REAPER', color: 'red' },
                  { title: 'INTERSECTOR_TITLE', holder: 'THE ARCHITECT', color: 'cyan' },
                  { title: 'WORLD_HEAVYWEIGHT', holder: 'THE SOVEREIGN KING', color: 'amber' },
                  { title: 'DYNAMO_WOMENS', holder: 'MAMY_DARKNESS', color: 'purple' },
                ].map(c => (
                  <div key={c.title} className="p-6 bg-zinc-900/60 border border-zinc-800 relative overflow-hidden group hover:border-white transition-all">
                    <div className="absolute top-0 right-0 p-1 bg-white/5 text-[8px] font-bold uppercase tracking-widest">{c.title}</div>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase mb-2">HOLDER</p>
                    <p className="text-xl font-black italic text-white underline decoration-zinc-700">{c.holder}</p>
                  </div>
                ))}
            </div>

            <div className="mt-8 p-8 border border-zinc-800 bg-zinc-900/20">
               <h4 className="text-[10px] font-black text-zinc-600 tracking-[8px] uppercase mb-6">EVENT_CALENDAR</h4>
               <div className="flex gap-2 h-20">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i} className={`flex-1 border border-zinc-800 flex items-center justify-center text-xs font-black ${i === 0 ? 'bg-red-600 text-white' : 'text-zinc-600'}`}>
                       {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                    </div>
                  ))}
               </div>
            </div>
        </div>
      </div>
    </div>
  );

  const renderFaction = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-12">
        <div>
           <h1 className="text-6xl font-black italic tracking-tighter uppercase underline decoration-cyan-600 underline-offset-8">MY_FACTION</h1>
           <p className="text-zinc-500 font-bold tracking-[8px] uppercase mt-2">SOCIAL_SYNC // UNITY_ALGORITHM</p>
        </div>
        <div className="flex gap-4">
           <button className="px-8 py-3 bg-white text-black font-black uppercase text-[10px] tracking-[4px] hover:bg-cyan-600 hover:text-white transition-all">CREATE_FACTION</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: 'THE CROWN COUNCIL', members: 4, power: 98, color: '#ffcc00' },
            { name: 'VOID VIGILANTES', members: 3, power: 85, color: '#4400ff' },
            { name: 'BLOOD_INITIATIVE', members: 5, power: 92, color: '#cc0000' },
            { name: 'TECH_NATION', members: 2, power: 78, color: '#00ccff' },
          ].map(f => (
            <div key={f.name} className="p-6 bg-zinc-900/60 border border-zinc-800 flex flex-col items-center text-center group cursor-pointer hover:border-cyan-600 transition-all relative">
               <div className="w-12 h-12 bg-zinc-950 border-2 border-zinc-800 group-hover:border-white transition-all rotate-45 flex items-center justify-center mb-6">
                  <div className="w-4 h-4" style={{ backgroundColor: f.color }} />
               </div>
               <h3 className="text-sm font-black italic text-white uppercase mb-2">{f.name}</h3>
               <div className="flex gap-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  <span>{f.members} MEMBERS</span>
                  <span className="text-cyan-500">PWR: {f.power}</span>
               </div>
               <div className="mt-6 opacity-0 group-hover:opacity-100 transition-all">
                  <button className="text-[10px] font-black text-white underline tracking-widest">JOIN_INITIATIVE</button>
               </div>
            </div>
          ))}
      </div>

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-zinc-950 border border-zinc-900 p-8">
             <h3 className="text-sm font-black italic tracking-[4px] uppercase text-zinc-500 mb-6">MEMBER_MANAGEMENT</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(m => (
                  <div key={m} className="p-4 bg-zinc-900/20 border border-zinc-800 flex gap-4 items-center">
                     <div className="w-10 h-10 bg-zinc-800 rounded-full" />
                     <div>
                        <p className="text-xs font-black italic text-white">RECRUIT_BETA_{m}</p>
                        <p className="text-[9px] text-zinc-600 uppercase font-bold tracking-widest">LOYALTY: 100%</p>
                     </div>
                  </div>
                ))}
             </div>
          </div>
          <div className="p-8 bg-cyan-950/10 border border-cyan-900/40">
             <h3 className="text-sm font-black italic tracking-[4px] uppercase text-cyan-500 mb-6 underline">SYNERGY_FEED</h3>
             <div className="space-y-4">
                <div className="text-[11px] text-zinc-400 font-mono italic p-2 border-l-2 border-cyan-500">
                   "FACTION_01 GAINED +14 MOMENTUM AFTER VICTORIOUS RAID."
                </div>
                <div className="text-[11px] text-zinc-400 font-mono italic p-2 border-l-2 border-cyan-500">
                   "NEW CHALLENGE ISSUED BY VOID VIGILANTES."
                </div>
             </div>
          </div>
      </div>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-[100] bg-[#0a0a0c] flex flex-col p-8 lg:p-20 overflow-y-auto custom-scrollbar"
    >
      <header className="flex-none flex justify-between items-center mb-12 relative z-50">
        <button 
          onClick={onBack}
          className="px-8 py-3 border border-zinc-800 text-zinc-500 hover:text-white hover:border-red-600 transition-all font-black uppercase text-[10px] tracking-[4px]"
        >
          ← EXIT_MODE
        </button>
        <div className="flex items-center gap-4">
            <span className="text-[10px] font-black text-zinc-700 tracking-[10px] uppercase">STATUS:CORE_SYNC</span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        </div>
      </header>

      <main className="flex-1">
        {mode === 'career' && renderCareer()}
        {mode === 'gm' && renderGM()}
        {mode === 'universe' && renderUniverse()}
        {mode === 'faction' && renderFaction()}
        {!(['career', 'gm', 'universe', 'faction'].includes(mode)) && (
            <div className="h-full flex flex-col items-center justify-center opacity-30">
                <h2 className="text-8xl font-black italic tracking-tighter text-white mb-4 underline decoration-red-600 underline-offset-8 uppercase">{mode}_LOCKED</h2>
                <p className="text-zinc-500 font-bold tracking-[8px] uppercase italic">ENCRYPTED_SECTOR // NOT_ACCESSIBLE_IN_PREVIEW</p>
            </div>
        )}
      </main>

      <footer className="mt-20 pt-8 border-t border-zinc-900 text-[8px] font-black text-zinc-800 tracking-[8px] uppercase flex justify-between">
        <span>SOVEREIGN_SYSTEM_MODULAR_EXPANSION_09 // 2026</span>
        <span>AUDIT_LOG_CONNECTED</span>
      </footer>
    </motion.div>
  );
};
