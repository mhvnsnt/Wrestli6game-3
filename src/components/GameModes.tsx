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
  superstars: CharacterData[];
  onStartMatch: (p1: CharacterData, p2: CharacterData, championship?: string, arena?: any) => void;
}

export const GameModes: React.FC<GameModesProps> = ({ mode, onBack, playerChar, superstars, onStartMatch }) => {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
        if (e.key.toLowerCase() === 'escape' || e.key.toLowerCase() === 'b') onBack();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onBack]);

  const [activeStep, setActiveStep] = useState(0);

  // GM Mode State
  const [gmState, setGmState] = useState(() => {
    const saved = localStorage.getItem('SOVEREIGN_GM_STATE');
    if (saved) return JSON.parse(saved);
    return {
      budget: 1000000,
      fanBase: 100000,
      rosterIds: [] as string[],
      currentCard: [
        { id: '1', p1Id: '', p2Id: '', type: 'Opener', winner: null as string | null },
        { id: '2', p1Id: '', p2Id: '', type: 'Mid-Card', winner: null as string | null },
        { id: '3', p1Id: '', p2Id: '', type: 'Main Event', winner: null as string | null },
      ],
      draftPhase: true,
      week: 1,
      showHistory: [] as any[]
    };
  });

  const [pickingSlot, setPickingSlot] = useState<{ matchIndex: number; side: string } | null>(null);

  // Career Mode State
  const [careerState, setCareerState] = useState(() => {
    const saved = localStorage.getItem('SOVEREIGN_CAREER_STATE');
    if (saved) return JSON.parse(saved);
    return {
      week: 1,
      momentum: 20,
      debt: 10000,
      standing: 50,
      opponentId: superstars[1].name,
      history: [] as any[]
    };
  });

  useEffect(() => {
    localStorage.setItem('SOVEREIGN_CAREER_STATE', JSON.stringify(careerState));
  }, [careerState]);

  const advanceCareer = (won: boolean) => {
    const nextOppIndex = (careerState.week + 1) % superstars.length;
    setCareerState(prev => ({
        ...prev,
        week: prev.week + 1,
        momentum: Math.min(100, Math.max(0, prev.momentum + (won ? 15 : -5))),
        debt: Math.max(0, prev.debt - (won ? 1500 : 200)),
        opponentId: superstars[nextOppIndex].name
    }));
  };

  const renderCareer = () => {
    const opponent = superstars.find(s => s.name === careerState.opponentId) || superstars[1];
    
    return (
    <div className="space-y-8">
      <div className="flex items-center gap-6 mb-12">
        <div className="w-24 h-24 border-2 border-red-600 rotate-45 flex items-center justify-center">
            <Trophy size={40} className="-rotate-45" />
        </div>
        <div>
            <h1 className="text-6xl font-black italic tracking-tighter uppercase underline decoration-red-600 underline-offset-8">THE_CORE_UNLOCKED</h1>
            <p className="text-zinc-500 font-bold tracking-[8px] uppercase mt-2">CAREER AUDIT // SUBJECT: {playerChar.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="col-span-2 space-y-4">
            <div className="bg-zinc-900/50 border border-zinc-800 p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 bg-red-600 text-black text-[10px] font-black uppercase">CURRENT_CONTRACT</div>
                <h2 className="text-2xl font-black text-white italic mb-4">WEEK {careerState.week}: THE AUDIT CONTINUES</h2>
                <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                    The Sovereign Architect has assigned your target for the week. Beat <span className="text-white font-black italic">{opponent.name}</span> to clear more of your soul's debt. Failure is not formatted for this sector.
                </p>
                <div className="flex gap-4">
                    <button 
                        onClick={() => onStartMatch(playerChar, opponent)}
                        className="px-12 py-4 bg-white text-black font-black uppercase hover:bg-red-600 hover:text-white transition-all shadow-lg text-[10px] tracking-[4px]"
                    >
                        PLAY_MATCH
                    </button>
                    <button 
                        onClick={() => advanceCareer(false)}
                        className="px-12 py-4 border border-zinc-700 text-zinc-500 font-black uppercase hover:text-white transition-all text-[10px] tracking-[4px]"
                    >
                        SKIP_WEEK
                    </button>
                </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <div className="p-6 border border-zinc-800 bg-zinc-900/20">
                  <span className="text-zinc-600 text-[10px] font-black uppercase tracking-[2px]">MOMENTUM</span>
                  <div className="h-1 bg-zinc-800 mt-2"><motion.div animate={{ width: `${careerState.momentum}%` }} className="h-full bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)]" /></div>
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
                    <span className="text-red-500">{Math.floor((10000 - careerState.debt) / 100)}%</span>
                </div>
                <div className="flex items-center justify-between text-[10px] font-black">
                    <span className="text-zinc-600">DEBT_REMAINING</span>
                    <span className="text-white">${careerState.debt.toLocaleString()}</span>
                </div>
            </div>
        </div>
      </div>
    </div>
    );
  };

  useEffect(() => {
    localStorage.setItem('SOVEREIGN_GM_STATE', JSON.stringify(gmState));
  }, [gmState]);

  const gmRoster = superstars.filter(s => gmState.rosterIds.includes(s.name));

  const runGmShow = () => {
    const newCard = gmState.currentCard.map(m => {
        if (m.winner) return m;
        return { ...m, winner: Math.random() > 0.5 ? m.p1Id : m.p2Id };
    });
    
    // Calculate gains
    const totalPower = newCard.reduce((acc, m) => acc + (m.p1Id && m.p2Id ? 50 : 0), 0);
    const fansGained = totalPower * 1000;
    const revenue = fansGained * 0.1;

    setGmState(prev => ({
        ...prev,
        fanBase: prev.fanBase + fansGained,
        budget: prev.budget + revenue,
        week: prev.week + 1,
        currentCard: prev.currentCard.map(m => ({ ...m, p1Id: '', p2Id: '', winner: null }))
    }));
  };

  const simGmMatch = (matchIndex: number) => {
    setGmState(prev => {
        const next = [...prev.currentCard];
        const m = next[matchIndex];
        if (!m.p1Id || !m.p2Id) return prev;
        m.winner = Math.random() > 0.5 ? m.p1Id : m.p2Id;
        return { ...prev, currentCard: next };
    });
  };

  const renderGM = () => {
    if (gmState.draftPhase) {
      return (
        <div className="space-y-8">
            <header className="flex justify-between items-end mb-12 border-b border-zinc-900 pb-8">
                <div>
                   <h1 className="text-7xl font-black italic tracking-tighter uppercase leading-none text-red-600">ROSTER_DRAFT</h1>
                   <p className="text-zinc-500 font-bold tracking-[8px] uppercase mt-4">Drafting Phase // Budget: ${gmState.budget.toLocaleString()}</p>
                </div>
                {gmState.rosterIds.length >= 3 && (
                  <button 
                    onClick={() => setGmState(prev => ({ ...prev, draftPhase: false }))}
                    className="px-12 py-3 bg-red-600 text-white text-[10px] font-black uppercase tracking-[4px] hover:bg-white hover:text-red-600 transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)]"
                  >
                    FINALIZE_DRAFT
                  </button>
                )}
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
               {superstars.slice(0, 24).map(s => {
                  const cost = (s.stats.str + s.stats.def + s.stats.spd) * 1000 + (s.stats.cha || 50) * 200;
                  const isDrafted = gmState.rosterIds.includes(s.name);
                  return (
                    <div key={s.name} className={`p-6 border ${isDrafted ? 'border-red-600 bg-red-900/10' : 'border-zinc-800 bg-zinc-950'} transition-all relative group overflow-hidden`}>
                       <div className="relative z-10">
                           <p className="text-xl font-black italic text-white uppercase">{s.name}</p>
                           <p className="text-[10px] text-zinc-500 font-black mb-4">SIGNING_BONUS: ${cost.toLocaleString()}</p>
                           <div className="flex justify-between text-[8px] font-black text-zinc-700 uppercase mb-4">
                               <span>CHA: {s.stats.cha || 50}</span>
                               <span>OVR: {s.overall || 85}</span>
                           </div>
                           {!isDrafted && (
                             <button 
                                 onClick={() => {
                                     if (gmState.budget >= cost) {
                                         setGmState(prev => ({
                                             ...prev,
                                             budget: prev.budget - cost,
                                             rosterIds: [...prev.rosterIds, s.name]
                                         }));
                                     }
                                 }}
                                 disabled={gmState.budget < cost}
                                 className="w-full py-2 bg-zinc-900 text-[10px] font-black hover:bg-red-600 hover:text-white transition-all disabled:opacity-30 uppercase tracking-[2px]"
                             >
                                 DRAFT_TALENT
                             </button>
                            )}
                           {isDrafted && <span className="text-[10px] text-red-600 font-black uppercase tracking-[2px] block text-center py-2">CONTRACT_ACTIVE</span>}
                       </div>
                    </div>
                  );
               })}
            </div>
        </div>
      );
    }

    return (
    <div className="space-y-8">
        <div className="flex justify-between items-end mb-12 border-b border-zinc-900 pb-8">
            <div>
                <h1 className="text-7xl font-black italic tracking-tighter uppercase leading-none">GM_STRAT <span className="text-red-600">AUDIT</span></h1>
                <p className="text-zinc-500 font-bold tracking-[8px] uppercase mt-4">Executive Oversight // Week: {gmState.week} // Budget: ${gmState.budget.toLocaleString()}</p>
            </div>
            <div className="text-right">
                <div className="flex gap-12 items-end mb-4">
                    <div>
                        <span className="text-[10px] font-black text-zinc-700 tracking-[4px] uppercase block mb-1">AUDIENCE_INDEX</span>
                        <span className="text-2xl font-black text-white italic">{(gmState.fanBase / 1000000).toFixed(1)}M</span>
                    </div>
                    <div>
                        <button 
                          onClick={() => setGmState(prev => ({ ...prev, draftPhase: true, rosterIds: [] }))}
                          className="text-[10px] text-zinc-600 font-black hover:text-red-600 transition-colors uppercase tracking-[2px]"
                        >
                          RESET_GM_DATA
                        </button>
                    </div>
                </div>
                <button 
                    onClick={runGmShow}
                    className="px-12 py-3 bg-red-600 text-white text-[10px] font-black uppercase tracking-[4px] hover:scale-105 transition-all"
                >
                    RUN_BROADCAST
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 space-y-6">
                <h3 className="text-sm font-black italic tracking-[6px] uppercase text-zinc-500 flex items-center gap-4">
                    <span className="w-8 h-[2px] bg-red-600" />
                    SHOW_BOOKING
                </h3>
                
                <div className="space-y-4">
                    {gmState.currentCard.map((seg: any, i: number) => {
                        const p1 = superstars.find(s => s.name === seg.p1Id);
                        const p2 = superstars.find(s => s.name === seg.p2Id);
                        return (
                        <div 
                          key={seg.id}
                          className={`p-6 border transition-all ${seg.winner ? 'border-zinc-900 bg-zinc-950 opacity-50' : 'bg-zinc-900 border-zinc-800'}`}
                        >
                            <div className="flex items-center gap-6">
                                <div className="text-2xl font-black italic text-zinc-800">#{i+1}</div>
                                <div className="flex-1 grid grid-cols-3 gap-4 items-center relative">
                                    {seg.winner && (
                                        <div className="absolute inset-0 z-20 flex items-center justify-center">
                                            <span className="bg-red-600 text-white px-4 py-1 text-[10px] font-black uppercase italic tracking-[4px]">WINNER: {seg.winner}</span>
                                        </div>
                                    )}
                                    <button 
                                        onClick={() => setPickingSlot({ matchIndex: i, side: 'p1' })}
                                        className="h-16 border border-zinc-800 bg-black flex items-center justify-center text-xs font-black uppercase tracking-widest hover:border-red-600 transition-all px-4 truncate"
                                    >
                                        {seg.p1Id || 'PICK_P1'}
                                    </button>
                                    <div className="text-center font-black text-red-600 text-2xl italic tracking-tighter uppercase relative">
                                        VS
                                        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-red-600/20 -z-10" />
                                    </div>
                                    <button 
                                        onClick={() => setPickingSlot({ matchIndex: i, side: 'p2' })}
                                        className="h-16 border border-zinc-800 bg-black flex items-center justify-center text-xs font-black uppercase tracking-widest hover:border-red-600 transition-all px-4 truncate"
                                    >
                                        {seg.p2Id || 'PICK_P2'}
                                    </button>
                                </div>
                                <div className="flex gap-2">
                                    {!seg.winner && p1 && p2 && (
                                      <button 
                                        onClick={() => onStartMatch(p1, p2)}
                                        className="p-4 bg-red-600 text-white hover:bg-white hover:text-red-600 transition-all"
                                      >
                                        <Sword size={20} />
                                      </button>
                                    )}
                                    {!seg.winner && p1 && p2 && (
                                      <button 
                                        onClick={() => simGmMatch(i)}
                                        className="p-4 bg-zinc-800 text-white hover:bg-zinc-700 transition-all border border-zinc-700"
                                      >
                                        SIM
                                      </button>
                                    )}
                                </div>
                            </div>
                            <div className="text-[8px] font-black text-zinc-600 tracking-[4px] uppercase mt-2">{seg.type} // AUDIENCE_PROJECTION: +{(Math.random()*2+1).toFixed(1)}%</div>
                        </div>
                        );
                    })}
                </div>
            </div>

            <div className="space-y-8">
                <div className="p-8 bg-zinc-950 border border-zinc-900 relative">
                    <div className="absolute top-0 right-0 p-2 bg-red-600 text-black text-[8px] font-black uppercase">ROSTER_INVENTORY</div>
                    <h4 className="text-[10px] font-black text-zinc-500 tracking-[4px] uppercase mb-6">DRAFTED_TALENT</h4>
                    <div className="space-y-2">
                       {gmRoster.map(s => (
                         <div key={s.name} className="flex justify-between items-center bg-zinc-900/30 p-3 border border-zinc-900">
                            <span className="text-[11px] font-black text-white uppercase italic">{s.name}</span>
                            <span className="text-[10px] font-black text-red-600">OVR {s.overall || 85}</span>
                         </div>
                       ))}
                       {gmRoster.length === 0 && <p className="text-[10px] text-zinc-700 italic font-black uppercase tracking-widest text-center py-4">NO_CONTRACTS_ACTIVE</p>}
                    </div>
                </div>

                <div className="p-8 bg-zinc-900/40 border border-zinc-800">
                   <h4 className="text-[10px] font-black text-zinc-500 tracking-[4px] uppercase mb-4 border-b border-zinc-800 pb-2">BRAND_POWER</h4>
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                         <p className="text-2xl font-black text-white italic">{(gmState.fanBase / 1000000).toFixed(2)}M</p>
                         <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest">FANS</p>
                      </div>
                      <div>
                         <p className="text-2xl font-black text-white italic">${(gmState.budget / 1000).toFixed(0)}K</p>
                         <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest">REVENUE</p>
                      </div>
                   </div>
                </div>
            </div>
        </div>

        <AnimatePresence>
            {pickingSlot && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/90 backdrop-blur-md"
                        onClick={() => setPickingSlot(null)}
                    />
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="relative z-10 w-full max-w-2xl bg-[#0f0f12] border border-zinc-800 p-8 max-h-[80vh] overflow-y-auto custom-scrollbar"
                    >
                        <h2 className="text-3xl font-black italic text-white uppercase mb-8 border-b border-zinc-800 pb-4">SELECT_TALENT</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {gmRoster.map(s => (
                                <button
                                    key={s.name}
                                    onClick={() => {
                                        setGmState(prev => {
                                            const next = [...prev.currentCard];
                                            (next[pickingSlot.matchIndex] as any)[pickingSlot.side + 'Id'] = s.name;
                                            return { ...prev, currentCard: next };
                                        });
                                        setPickingSlot(null);
                                    }}
                                    className="p-4 bg-zinc-900 border border-zinc-800 hover:border-red-600 transition-all flex justify-between items-center group"
                                >
                                    <span className="text-sm font-black italic text-zinc-400 group-hover:text-white uppercase">{s.name}</span>
                                    <span className="text-[10px] font-black text-red-600">{s.overall || 85}</span>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    </div>
    );
  };

  // Universe Mode State
  const [universeState, setUniverseState] = useState(() => {
    const saved = localStorage.getItem('SOVEREIGN_UNIVERSE_STATE');
    if (saved) return JSON.parse(saved);
    return {
      week: 1,
      card: [
        { id: 'm1', p1Id: superstars[0].name, p2Id: superstars[1].name, type: 'Singles', winner: null as string | null },
        { id: 'm2', p1Id: superstars[2].name, p2Id: superstars[3].name, type: 'Singles', winner: null as string | null },
        { id: 'm3', p1Id: superstars[4].name, p2Id: superstars[5].name, type: 'Technical', winner: null as string | null },
        { id: 'm4', p1Id: superstars[6].name, p2Id: superstars[7].name, type: 'Extreme', winner: null as string | null },
        { id: 'm5', p1Id: superstars[8].name, p2Id: superstars[9].name, type: 'Main Event', winner: null as string | null },
      ],
      history: [] as any[]
    };
  });

  useEffect(() => {
    localStorage.setItem('SOVEREIGN_UNIVERSE_STATE', JSON.stringify(universeState));
  }, [universeState]);

  const generateUniverseCard = () => {
    const roster = [...superstars].sort(() => Math.random() - 0.5);
    const newCard = Array.from({ length: 5 }).map((_, i) => ({
      id: `m${i}`,
      p1Id: roster[i*2].name,
      p2Id: roster[i*2+1].name,
      type: i === 4 ? 'Main Event' : (Math.random() > 0.7 ? 'Extreme' : 'Singles'),
      winner: null
    }));
    setUniverseState(prev => ({ ...prev, card: newCard, week: prev.week + 1 }));
  };

  const simUniverseMatch = (matchId: string) => {
    setUniverseState(prev => ({
      ...prev,
      card: prev.card.map(m => {
        if (m.id === matchId) {
          return { ...m, winner: Math.random() > 0.5 ? m.p1Id : m.p2Id };
        }
        return m;
      })
    }));
  };

  const renderUniverse = () => {
    const universeRoster = [...superstars].sort((a,b) => (b.stats.str + b.stats.def) - (a.stats.str + a.stats.def));
    
    return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-12">
        <div>
           <h1 className="text-6xl font-black italic tracking-tighter uppercase underline decoration-red-600 underline-offset-8">UNIVERSE_CHRT</h1>
           <p className="text-zinc-500 font-bold tracking-[8px] uppercase mt-2">DYNAMO_CHART // WEEK: {universeState.week}</p>
        </div>
        <div className="text-right p-4 border-l border-red-600 bg-zinc-900/40">
           <span className="text-zinc-600 text-[10px] font-black uppercase tracking-[4px]">NEXT_BIG_EVENT</span>
           <p className="text-white font-black italic text-xl uppercase tracking-tighter">SURVIVOR_SERIES_ULTRA</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-baseline border-b border-zinc-900 pb-2">
                <h3 className="text-sm font-black italic tracking-[4px] uppercase text-zinc-500">WEEKLY_CARD</h3>
                <button 
                  onClick={generateUniverseCard}
                  className="text-[10px] font-black text-red-600 hover:text-white transition-colors"
                >
                  ADVANCE_WEEK →
                </button>
            </div>

            <div className="space-y-4">
                {universeState.card.map((m: any, i: number) => {
                    const p1 = superstars.find(s => s.name === m.p1Id);
                    const p2 = superstars.find(s => s.name === m.p2Id);
                    return (
                        <div key={m.id} className={`p-6 border ${m.winner ? 'border-zinc-800 bg-zinc-900/10 opacity-50' : 'border-zinc-800 bg-zinc-900/40'} group relative`}>
                            {m.winner && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10">
                                    <span className="text-3xl font-black italic text-white uppercase tracking-tighter">WINNER: {m.winner}</span>
                                </div>
                            )}
                            <div className="flex items-center justify-between">
                                <div className="flex-1 flex items-center justify-center gap-12 font-black italic text-2xl uppercase">
                                    <span className="text-white">{m.p1Id}</span>
                                    <span className="text-red-600 text-sm">VS</span>
                                    <span className="text-white">{m.p2Id}</span>
                                </div>
                                <div className="flex gap-2 relative z-20">
                                    <button 
                                        onClick={() => {
                                            if (p1 && p2) onStartMatch(p1, p2);
                                        }}
                                        className="px-6 py-2 bg-red-600 text-white text-[10px] font-black uppercase tracking-[2px] transition-all hover:bg-white hover:text-red-600"
                                    >
                                        PLAY
                                    </button>
                                    <button 
                                        onClick={() => simUniverseMatch(m.id)}
                                        className="px-6 py-2 border border-zinc-800 text-zinc-500 text-[10px] font-black uppercase tracking-[2px] transition-all hover:text-white hover:border-zinc-500"
                                    >
                                        SIM
                                    </button>
                                </div>
                            </div>
                            <div className="absolute top-0 left-0 p-1 bg-zinc-800 text-[8px] font-black text-zinc-500 uppercase">{m.type}</div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-12">
                <h3 className="text-sm font-black italic tracking-[4px] uppercase text-zinc-500 border-b border-zinc-900 pb-2 mb-6">CHAMPIONSHIP_DATABASE</h3>
                <div className="grid grid-cols-2 gap-4">
                    {[
                    { title: 'CORE_CHAMPIONSHIP', holder: universeRoster[0]?.name, color: 'red' },
                    { title: 'INTERSECTOR_TITLE', holder: universeRoster[1]?.name, color: 'cyan' },
                    { title: 'WORLD_HEAVYWEIGHT', holder: universeRoster[2]?.name, color: 'amber' },
                    { title: 'DYNAMO_WOMENS', holder: universeRoster[3]?.name, color: 'purple' },
                    ].map(c => (
                    <div key={c.title} className="p-6 bg-zinc-900/60 border border-zinc-800 relative overflow-hidden group hover:border-white transition-all">
                        <div className="absolute top-0 right-0 p-1 bg-white/5 text-[8px] font-bold uppercase tracking-widest">{c.title}</div>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase mb-2">HOLDER</p>
                        <p className="text-xl font-black italic text-white underline decoration-zinc-700">{c.holder}</p>
                        {c.holder && (
                        <button 
                            onClick={() => {
                            const holder = superstars.find(s => s.name === c.holder);
                            if (holder) onStartMatch(playerChar, holder, c.title);
                            }}
                            className="mt-4 text-[8px] font-black text-red-600 uppercase tracking-[2px] opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            CHALLENGE_FOR_TITLE
                        </button>
                        )}
                    </div>
                    ))}
                </div>
            </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
           <h3 className="text-sm font-black italic tracking-[4px] uppercase text-zinc-500 border-b border-zinc-900 pb-2">POWER_RANKINGS</h3>
           <div className="space-y-2">
              {universeRoster.slice(0, 12).map((r, i) => (
                <div 
                    key={r.name} 
                    onClick={() => onStartMatch(playerChar, r)}
                    className="flex items-center justify-between p-4 bg-zinc-950 border border-zinc-900 hover:border-zinc-700 transition-all cursor-pointer group"
                >
                   <div className="flex items-center gap-4">
                      <span className="text-xl font-black italic text-red-600">#{i+1}</span>
                      <span className="text-[11px] font-black italic text-white uppercase group-hover:text-red-500">{r.name}</span>
                   </div>
                   <div className={`w-2 h-2 ${i < 3 ? 'bg-green-500' : 'bg-zinc-500'}`} />
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
    );
  };

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
