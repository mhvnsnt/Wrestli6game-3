/**
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  CharacterData, 
  SKIN_COLORS, 
  HAIR_COLORS, 
  EYE_COLORS, 
  CLOTH_COLORS, 
  HAIR_STYLES, 
  BODY_TYPES, 
  FACE_SHAPES, 
  CLOTHING_OPTIONS,
  Gender,
  Archetype,
  Weapons
} from '../types';
import { ProceduralCharacter } from '../engine/character';
import { Character3D } from '../engine/character3d';
import { MoveLibrary } from '../engine/moveLibrary';
import { calculateGematria, calculateNumerology } from '../engine/sovereign';
import { ROSTER, TEAMS } from '../data/roster';
import { 
  User, 
  Shield, 
  Zap, 
  ChevronLeft, 
  ChevronRight, 
  Swords, 
  Sparkles, 
  Wand2,
  Activity,
  Palette,
  Layers,
  Book,
  Users,
  Trophy,
  History
} from 'lucide-react';

interface CustomizerProps {
  initialData: CharacterData;
  availableCharacters?: CharacterData[];
  onSave: (data: CharacterData) => void;
  onCancel: () => void;
}

export const Customizer: React.FC<CustomizerProps> = ({ initialData, availableCharacters, onSave, onCancel }) => {
  const [view, setView] = useState<'roster' | 'edit'>('roster');
  const [rosterTab, setRosterTab] = useState<'all' | 'teams'>('all');
  const [selectedCharId, setSelectedCharId] = useState<number | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [cd, setCd] = useState<CharacterData>(initialData);
  const [activeTab, setActiveTab] = useState<'signal' | 'physics' | 'cosmetics' | 'wardrobe' | 'neural'>('signal');
  const [showExitModal, setShowExitModal] = useState(false);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const char3dRef = useRef<Character3D | null>(null);

  const displayRoster = availableCharacters || ROSTER;

  useEffect(() => {
    if (char3dRef.current) {
        char3dRef.current.cd = cd;
        char3dRef.current.updateModel();
    }
  }, [cd]);

  useEffect(() => {
    const container = previewContainerRef.current;
    if (!container || view !== 'edit') return;

    let rafId: number;

    const init3D = () => {
      const container = previewContainerRef.current;
      if (!container || view !== 'edit') return;
      
      if (!char3dRef.current && container.offsetWidth > 0) {
          char3dRef.current = new Character3D(container, cd);
          // Set initial orientation
          if (char3dRef.current.group) {
              char3dRef.current.group.rotation.y = (cd.yaw || 0) * Math.PI / 180;
          }
          rafId = requestAnimationFrame(render);
      }
    };

    const render = () => {
        if (char3dRef.current) {
          char3dRef.current.render();
        }
        rafId = requestAnimationFrame(render);
    };

    init3D();
    const resizeObserver = new ResizeObserver(init3D);
    resizeObserver.observe(container);

    let isDragging = false;
    let lastX = 0;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      lastX = e.clientX;
      container.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - lastX;
      lastX = e.clientX;
      update('yaw', ((cd.yaw || 0) + deltaX * 1.5) % 360);
    };

    const onPointerUp = (e: PointerEvent) => {
      isDragging = false;
      container.releasePointerCapture(e.pointerId);
    };

    container.addEventListener('pointerdown', onPointerDown);
    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerup', onPointerUp);
    
    const handleResize = () => char3dRef.current?.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(rafId);
      container.removeEventListener('pointerdown', onPointerDown);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      if (char3dRef.current) {
         char3dRef.current.destroy();
         char3dRef.current = null;
      }
    };
  }, [view]);

  const hasChanged = JSON.stringify(cd) !== JSON.stringify(initialData);

  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === 'escape' || key === 'b') {
        if (view === 'edit') {
            if (hasChanged) setShowExitModal(true);
            else setView('roster');
        } else {
            onCancel();
        }
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, [view, hasChanged, onCancel]);

  const resetView = () => {
    setCd(prev => ({ ...prev, yaw: 0, tilt: 0, zoom: 1 }));
  };

  const update = (key: string, val: any) => {
    setCd(prev => {
      const next = { ...prev };
      if (key.includes('.')) {
        const parts = key.split('.');
        let current: any = next;
        for (let i = 0; i < parts.length - 1; i++) {
          current[parts[i]] = { ...current[parts[i]] };
          current = current[parts[i]];
        }
        current[parts[parts.length - 1]] = val;
      } else {
        (next as any)[key] = val;
      }
      return next;
    });
  };

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-[#0f0f11] border border-zinc-800 p-4 mb-4 relative">
      <div className="absolute top-0 left-0 w-1 h-full bg-red-600" />
      <div className="font-['Orbitron'] text-[10px] font-black italic tracking-[4px] text-zinc-100 uppercase mb-4 border-b border-zinc-800 pb-2">
        {title}
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );

  const Label = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div className={`text-[10px] tracking-[2px] text-zinc-500 uppercase min-w-[100px] font-bold ${className}`}>{children}</div>
  );

  const ColorSwatch = ({ color, active, onClick }: { color: string; active: boolean; onClick: () => void; key?: React.Key }) => (
    <div
      onClick={onClick}
      className={`w-6 h-6 border-2 border-zinc-900 cursor-pointer transition-all ${active ? 'scale-110 border-white ring-2 ring-red-600 ring-offset-2 ring-offset-black' : 'hover:border-zinc-600'}`}
      style={{ backgroundColor: color }}
    />
  );

  const OptionBtn = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode; key?: React.Key }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-[9px] tracking-[2px] font-black uppercase border transition-all -skew-x-[12deg] ${
        active ? 'bg-red-600 text-white border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.4)]' : 'bg-transparent text-zinc-500 border-zinc-800 hover:border-zinc-600'
      }`}
    >
      <span className="inline-block skew-x-[12deg]">{children}</span>
    </button>
  );

  const StatRow = ({ label, value, max }: { label: string; value: number; max: number }) => (
    <div className="flex flex-col gap-1">
       <div className="flex justify-between items-end">
          <span className="text-[9px] text-zinc-500 font-bold uppercase">{label}</span>
          <span className="text-[10px] text-zinc-300 font-black">{Math.round(value)}</span>
       </div>
       <div className="h-1 bg-zinc-900 overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${(value / max) * 100}%` }}
            className="h-full bg-red-600" 
          />
       </div>
    </div>
  );

  const StatBox = ({ label, val, desc }: any) => (
    <div className="bg-black/40 p-3 border border-zinc-900 group hover:border-red-600/50 transition-all cursor-crosshair">
      <div className="text-[8px] text-zinc-600 font-black tracking-widest uppercase mb-1">{label}</div>
      <div className="text-2xl font-black text-white group-hover:text-red-500 transition-colors">{val}</div>
      <div className="text-[7px] text-zinc-700 font-bold uppercase mt-1 line-clamp-1">{desc}</div>
    </div>
  );

  const TabBtn = ({ id, icon: Icon, label }: any) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`flex flex-col items-center gap-1 flex-1 py-1 border-b-2 transition-all ${activeTab === id ? 'border-red-600 text-white bg-red-600/5' : 'border-transparent text-zinc-600 hover:text-zinc-400'}`}
    >
        <Icon size={16} />
        <span className="text-[8px] font-black tracking-widest">{label}</span>
    </button>
  );

  if (view === 'roster') {
    const selectedChar = selectedCharId !== null ? displayRoster[selectedCharId] : null;
    const calculateWeight = (c: any) => {
        const heightInInches = c.height / 100 * 84; // normalized base
        const baseWeight = heightInInches * 2.5; 
        const mod = (c.muscleMass * 80) + (c.fatMass * 60);
        return Math.floor(baseWeight + mod);
    };

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-[#0a0a0c] flex flex-col p-6 lg:p-12 overflow-hidden z-[60]"
      >
        <div className="flex justify-between items-end mb-8">
           <div className="flex flex-col">
              <div className="font-['Orbitron'] text-3xl font-black italic text-white tracking-tighter uppercase transform -skew-x-[12deg]">
                 ARCHITECTS <span className="text-red-600">SANCTUM</span>
              </div>
              <div className="text-[10px] text-zinc-500 tracking-[5px] uppercase font-black italic">
                 SUPERSTAR ROSTER
              </div>
           </div>
           
           <div className="flex gap-4">
              <button 
                onClick={() => setRosterTab('all')}
                className={`text-[10px] font-black tracking-[4px] px-6 py-2 border transition-all ${rosterTab === 'all' ? 'bg-white text-black border-white' : 'text-zinc-500 border-zinc-800'}`}
              >
                ENCYCLOPEDIA
              </button>
              <button 
                onClick={() => setRosterTab('teams')}
                className={`text-[10px] font-black tracking-[4px] px-6 py-2 border transition-all ${rosterTab === 'teams' ? 'bg-white text-black border-white' : 'text-zinc-500 border-zinc-800'}`}
              >
                FACTIONS
              </button>
           </div>
        </div>

        <div className="flex flex-1 gap-8 overflow-hidden">
            {/* List */}
            <div className="w-[300px] flex flex-col gap-2 overflow-y-auto custom-scrollbar pr-2 h-full">
                <button
                    onClick={() => {
                        setCd(initialData);
                        setView('edit');
                    }}
                    className="flex-shrink-0 group relative h-20 border border-red-600/30 bg-red-600/5 hover:bg-red-600/20 transition-all flex flex-col items-center justify-center -skew-x-[12deg] mb-4"
                >
                    <div className="skew-x-[12deg] flex flex-col items-center">
                        <Sparkles className="text-red-500 mb-1" size={20} />
                        <div className="text-[8px] font-black tracking-[3px] text-white">CREATE NEW SUPERSTAR</div>
                    </div>
                </button>

                {rosterTab === 'all' ? (
                  displayRoster.map((char, i) => (
                    <button
                        key={i}
                        onClick={() => {
                            setSelectedCharId(i);
                            setSelectedTeamId(null);
                        }}
                        className={`flex-shrink-0 group relative h-16 border transition-all flex flex-col items-start justify-center -skew-x-[12deg] px-6 ${selectedCharId === i ? 'bg-red-600 border-red-600 text-white' : 'bg-zinc-900/40 border-zinc-800 text-zinc-500 hover:border-zinc-600'}`}
                    >
                        <div className="skew-x-[12deg] flex flex-col items-start w-full">
                            <div className={`text-[11px] font-black italic tracking-tighter uppercase line-clamp-1 ${selectedCharId === i ? 'text-white' : 'text-zinc-300'}`}>{char.name}</div>
                            <div className="text-[7px] font-bold tracking-[2px] uppercase opacity-60">{char.archetype}</div>
                        </div>
                    </button>
                  ))
                ) : (
                  <>
                    <button
                        className="flex-shrink-0 group relative h-16 border border-zinc-800 bg-zinc-900/40 hover:border-red-600 hover:bg-zinc-800/60 transition-all flex flex-col items-center justify-center -skew-x-[12deg] mb-2"
                        onClick={() => {
                            // Logic to create team could go here
                        }}
                    >
                        <div className="skew-x-[12deg] flex items-center gap-2">
                            <Users size={14} className="text-red-500" />
                            <div className="text-[8px] font-black tracking-[3px] text-white">FORM_NEW_FACTION</div>
                        </div>
                    </button>
                    {TEAMS.map((team, i) => (
                        <button
                          key={team.id}
                          onClick={() => {
                              setSelectedTeamId(team.id);
                              setSelectedCharId(null);
                          }}
                          className={`flex-shrink-0 p-4 border transition-all flex flex-col gap-2 text-left ${selectedTeamId === team.id ? 'bg-red-600 border-red-600 text-white' : 'bg-zinc-900/20 border-zinc-800 text-zinc-500 hover:border-zinc-600'}`}
                        >
                          <div className={`text-[12px] font-black italic tracking-tighter uppercase border-l-2 pl-2 ${selectedTeamId === team.id ? 'border-white text-white' : 'border-red-600 text-zinc-200'}`}>{team.name}</div>
                          <div className="text-[8px] font-bold uppercase tracking-widest opacity-60">{team.members.length} UNITS_IN_NODE</div>
                        </button>
                    ))}
                  </>
                )}
            </div>

            {/* Details Panel */}
            <div className="flex-1 bg-[#0f0f11] border border-zinc-800 p-8 overflow-y-auto custom-scrollbar relative">
                {selectedChar ? (
                   <motion.div 
                     key={selectedCharId}
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="max-w-4xl"
                   >
                     {/* Existing Character Bio View */}
                     <div className="flex justify-between items-start mb-8">
                        <div>
                           <div className="text-5xl font-black italic tracking-tighter text-white uppercase mb-2">{selectedChar.name}</div>
                           <div className="flex gap-4">
                              <span className="text-red-600 font-black text-xs tracking-widest uppercase italic">{selectedChar.archetype}</span>
                              <span className="text-zinc-600 font-bold text-xs tracking-widest uppercase">/ {selectedChar.gender}</span>
                              <span className="text-zinc-600 font-bold text-xs tracking-widest uppercase">/ {Math.floor(selectedChar.height / 100 * 7)}'{Math.floor((selectedChar.height / 100 * 7 % 1) * 12)}"</span>
                              <span className="text-zinc-600 font-bold text-xs tracking-widest uppercase">/ {calculateWeight(selectedChar)} LBS</span>
                              <span className="text-zinc-600 font-bold text-xs tracking-widest uppercase">/ {selectedChar.hometown || 'UNKNOWN_ORIGIN'}</span>
                           </div>
                        </div>

                        <div className="flex flex-col items-end gap-2 bg-zinc-900/40 p-4 border border-zinc-800">
                           <div className="text-[8px] text-zinc-500 font-black tracking-widest uppercase">NODE_RECORD</div>
                           <div className="text-3xl font-black text-white">
                              {selectedChar.record?.wins || 0} <span className="text-zinc-600 text-sm">W</span> / {selectedChar.record?.losses || 0} <span className="text-zinc-600 text-sm">L</span>
                           </div>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-8">
                           <Section title="BIOMETRIC_PROFILE">
                              <div className="text-zinc-400 text-sm font-['Share_Tech_Mono'] leading-relaxed tracking-wide">
                                 {selectedChar.bio || "No biometric data recorded for this signal."}
                              </div>
                              {selectedChar.backstory && (
                                <div className="mt-4 text-[11px] text-zinc-500 italic leading-relaxed">
                                   {selectedChar.backstory}
                                </div>
                              )}
                              <div className="mt-4 p-4 border border-zinc-900 bg-black/40">
                                 <div className="text-[8px] text-zinc-700 font-black tracking-widest uppercase mb-1">ORIGINAL_DEFAULTS</div>
                                 <div className="text-[10px] text-zinc-500 italic uppercase">
                                    {selectedChar.gender === 'male' ? "High-performance combat rig with armored weave." : "Sleek aerodynamic bodysuit with reinforced joints."} 
                                    {" "} Standard issue for early deployment.
                                 </div>
                              </div>
                           </Section>

                           <Section title="SOCIAL_NODE_MAP">
                              <div className="grid grid-cols-2 gap-4">
                                 <div>
                                    <div className="text-[9px] text-green-500 font-black tracking-widest uppercase mb-2 flex items-center gap-1"><Users size={10}/> ALLIES</div>
                                    <div className="flex flex-col gap-1">
                                       {(selectedChar.allies || []).length > 0 ? selectedChar.allies?.map(a => (
                                          <div key={a} className="text-[10px] text-zinc-300 font-bold uppercase">{a}</div>
                                       )) : <div className="text-[10px] text-zinc-600 uppercase">SOLO_UNIT</div>}
                                    </div>
                                 </div>
                                 <div>
                                    <div className="text-[9px] text-red-500 font-black tracking-widest uppercase mb-2 flex items-center gap-1"><History size={10}/> RIVALS</div>
                                    <div className="flex flex-col gap-1">
                                       {(selectedChar.rivals || []).length > 0 ? selectedChar.rivals?.map(r => (
                                          <div key={r} className="text-[10px] text-zinc-300 font-bold uppercase">{r}</div>
                                       )) : <div className="text-[10px] text-zinc-600 uppercase">NO_RELIABLE_DATA</div>}
                                    </div>
                                 </div>
                              </div>
                           </Section>
                        </div>

                        <div className="space-y-8">
                           <Section title="MANEUVER_INDEX">
                              <div className="flex flex-col gap-4">
                                 <div>
                                    <div className="text-[8px] text-zinc-600 font-black tracking-widest uppercase mb-1 flex items-center gap-1"><Zap size={10}/> FINISHER</div>
                                    <div className="text-xl font-black text-red-600 italic tracking-tighter uppercase">{selectedChar.moveset?.finishers?.[0]?.name || 'N/A'}</div>
                                 </div>
                                 <div>
                                    <div className="text-[8px] text-zinc-600 font-black tracking-widest uppercase mb-1 flex items-center gap-1"><Trophy size={10}/> SIGNATURES</div>
                                    <div className="space-y-1">
                                       {selectedChar.moveset?.signatures?.map((s, idx) => (
                                          <div key={idx} className="text-[11px] font-bold text-white uppercase">{s.name}</div>
                                       )) || <div className="text-[10px] text-zinc-600">NO_DATA</div>}
                                    </div>
                                 </div>
                              </div>
                           </Section>

                           <div className="flex gap-4 pt-4">
                              <button 
                                onClick={() => {
                                  setCd(JSON.parse(JSON.stringify(selectedChar)));
                                  setView('edit');
                                }}
                                className="flex-1 py-4 bg-white text-black font-black text-xs tracking-widest uppercase hover:bg-red-600 hover:text-white transition-all shadow-xl"
                              >
                                EDIT SUPERSTAR
                              </button>
                           </div>
                        </div>
                     </div>
                   </motion.div>
                ) : selectedTeamId ? (
                   <motion.div
                     key={selectedTeamId}
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="max-w-4xl"
                   >
                      {/* Team Detail View */}
                      {(() => {
                         const team = TEAMS.find(t => t.id === selectedTeamId);
                         if (!team) return null;
                         return (
                            <>
                               <div className="flex justify-between items-start mb-8">
                                  <div>
                                     <div className="text-5xl font-black italic tracking-tighter text-white uppercase mb-2">{team.name}</div>
                                     <div className="text-red-600 font-black text-xs tracking-widest uppercase italic">FACTION_NODE_INFRASTRUCTURE</div>
                                  </div>
                               </div>

                               <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                  <div className="space-y-8">
                                     <Section title="FACTION_INTEL">
                                        <div className="text-zinc-400 text-sm font-['Share_Tech_Mono'] leading-relaxed tracking-wide">
                                           {team.bio}
                                        </div>
                                     </Section>

                                     <Section title="ALLIANCE_MAP">
                                        <div className="grid grid-cols-2 gap-4">
                                           <div>
                                              <div className="text-[9px] text-green-500 font-black tracking-widest uppercase mb-2">FRIENDLY_NODES</div>
                                              <div className="flex flex-col gap-1">
                                                 {team.allies.map(a => <div key={a} className="text-[10px] text-zinc-300 font-bold uppercase">{a}</div>)}
                                              </div>
                                           </div>
                                           <div>
                                              <div className="text-[9px] text-red-500 font-black tracking-widest uppercase mb-2">HOSTILE_NODES</div>
                                              <div className="flex flex-col gap-1">
                                                 {team.rivals.map(r => <div key={r} className="text-[10px] text-zinc-300 font-bold uppercase">{r}</div>)}
                                              </div>
                                           </div>
                                        </div>
                                     </Section>
                                  </div>

                                  <div className="space-y-8">
                                     <Section title="MEMBER_ROSTER">
                                        <div className="flex flex-col gap-4">
                                           {team.members.map(memberName => {
                                              const char = displayRoster.find(r => r.name === memberName);
                                              return (
                                                 <div key={memberName} className="flex justify-between items-center bg-zinc-900/40 p-3 border border-zinc-800">
                                                    <div>
                                                       <div className="text-xs font-black text-white italic tracking-tighter uppercase">{memberName}</div>
                                                       <div className="text-[7px] text-zinc-600 font-bold uppercase tracking-widest">{char?.archetype || 'UNKNOWN'}</div>
                                                    </div>
                                                    <button 
                                                      onClick={() => {
                                                         const idx = displayRoster.findIndex(r => r.name === memberName);
                                                         if (idx !== -1) setSelectedCharId(idx);
                                                      }}
                                                      className="text-[8px] font-black text-red-600 hover:text-white transition-colors uppercase tracking-widest"
                                                    >
                                                       VIEW_BIO
                                                    </button>
                                                 </div>
                                              );
                                           })}
                                        </div>
                                     </Section>
                                  </div>
                               </div>
                            </>
                         );
                      })()}
                   </motion.div>
                ) : (
                   <div className="h-full flex flex-col items-center justify-center opacity-20">
                      <Book size={64} className="mb-4 text-zinc-700" />
                      <div className="text-[10px] font-black tracking-[8px] text-zinc-600 uppercase">SELECT_NODE_FOR_INTEL</div>
                   </div>
                )}
            </div>
        </div>

        <div className="pt-8 self-start w-full">
            <button onClick={onCancel} className="text-[10px] font-black tracking-[4px] text-zinc-500 hover:text-white flex items-center gap-2 uppercase">
                <ChevronLeft size={14} /> RETURN_TO_BASE
            </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 bg-[#0a0a0c] flex flex-col items-center p-6 lg:p-12 overflow-hidden z-[60]"
    >
      <div className="flex justify-between items-start w-full mb-8">
        <div className="font-['Orbitron'] text-3xl font-black italic text-white tracking-tighter uppercase transform -skew-x-[12deg]">
            SUPERSTAR CUSTOMIZER // <span className="text-red-600">EDITOR</span>
        </div>
        <button onClick={() => setView('roster')} className="text-[10px] font-black tracking-[4px] text-zinc-500 hover:text-white flex items-center gap-2 uppercase">
            <ChevronLeft size={14} /> BACK_TO_ROSTER
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 w-full h-[calc(100%-120px)] max-w-7xl">
        {showExitModal && (
            <div className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4">
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-[#0f0f11] border border-red-600 p-8 max-w-md w-full -skew-x-[6deg]"
                >
                    <div className="skew-x-[6deg] space-y-6">
                        <h2 className="text-2xl font-black italic text-white uppercase tracking-tighter">DISCARD_EVOLUTION?</h2>
                        <p className="text-zinc-400 text-sm font-bold uppercase tracking-widest">
                            Signal changes detected. Exiting will revert the subject to its original state.
                        </p>
                        <div className="flex flex-col gap-2">
                            <button 
                                onClick={() => {
                                    onSave(cd);
                                    setShowExitModal(false);
                                }}
                                className="w-full py-4 bg-white text-black font-black uppercase text-[10px] tracking-[4px] hover:bg-red-600 hover:text-white transition-all shadow-lg"
                            >
                                SAVE_AND_EXIT
                            </button>
                            <button 
                                onClick={() => {
                                    setCd(initialData);
                                    setShowExitModal(false);
                                    setView('roster');
                                }}
                                className="w-full py-4 border border-zinc-700 text-zinc-500 font-black uppercase text-[10px] tracking-[4px] hover:text-white transition-all"
                            >
                                REVERT_CHANGES
                            </button>
                            <button 
                                onClick={() => setShowExitModal(false)}
                                className="w-full py-4 text-zinc-300 font-black uppercase text-[10px] tracking-[4px] hover:scale-105 transition-all"
                            >
                                CANCEL
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        )}
        {/* Preview & Stats */}
        <div className="w-full lg:w-[340px] flex-shrink-0 flex flex-col gap-4">
          <div className="bg-[#0f0f11] border border-zinc-800 flex flex-col items-center justify-center p-4 relative group">
            <div className="absolute top-4 left-4 flex gap-1">
               <div className="w-6 h-1 bg-red-600" />
               <div className="w-2 h-1 bg-red-600/30" />
            </div>
            <div ref={previewContainerRef} className="w-[300px] h-[400px] max-w-full drop-shadow-[0_0_30px_rgba(255,0,0,0.1)] cursor-move" />
            <div className="absolute bottom-16 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={resetView} className="bg-black/80 border border-zinc-800 p-2 text-zinc-500 hover:text-white" title="Reset Camera">
                    <Sparkles size={14} />
                </button>
            </div>
            <div className="text-[10px] tracking-[4px] text-zinc-600 mt-4 uppercase font-bold">BIO-METRIC FEED // DRAG TO ROTATE</div>
          </div>

          <div className="bg-[#0f0f11] border border-zinc-800 p-6 flex flex-col gap-4">
             <div className="text-[10px] tracking-[4px] text-zinc-500 font-black italic mb-2 uppercase border-b border-zinc-800 pb-2">SUPERSTAR_STATS</div>
             <StatRow label="HP" value={100 + (cd.muscleMass * 50) + (cd.fatMass * 20)} max={180} />
             <StatRow label="ENERGY" value={100 + (cd.height / 2)} max={160} />
             <StatRow label="REGEN" value={0.1 + (cd.fatMass * 0.2)} max={0.5} />
             <StatRow label="STRENGTH" value={1 + cd.muscleMass} max={2.5} />
             
             <div className="mt-4 flex flex-col gap-1">
                <div className="text-[8px] text-zinc-600 tracking-widest uppercase">WEIGHT_CLASS</div>
                <div className="text-xl font-black italic tracking-tighter text-red-600 uppercase">
                    {cd.height > 95 ? 'SUPER_HEAVY' : cd.height > 85 ? 'HEAVYWEIGHT' : cd.height > 75 ? 'MIDDLEWEIGHT' : 'LIGHTWEIGHT'}
                </div>
             </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <div className="flex gap-2 mb-4 bg-zinc-900/20 p-1 border border-zinc-800/50">
            <TabBtn id="signal" icon={User} label="PROFILE" />
            <TabBtn id="physics" icon={Activity} label="PHYSICS" />
            <TabBtn id="cosmetics" icon={Palette} label="BODY" />
            <TabBtn id="wardrobe" icon={Layers} label="WARDROBE" />
            <TabBtn id="neural" icon={Zap} label="MOVESET" />
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-4 custom-scrollbar">
            {activeTab === 'signal' && (
               <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <Section title="IDENTITY MATRIX">
                    <div className="flex items-center gap-4">
                      <Label>SUPERSTAR_NAME</Label>
                      <input
                        type="text" value={cd.name}
                        onChange={e => update('name', e.target.value)}
                        className="bg-zinc-900 border border-zinc-800 text-white font-['Share_Tech_Mono'] text-sm p-3 w-full max-w-[240px] tracking-[2px] uppercase focus:outline-none focus:border-red-600 transition-colors"
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <Label>NODE_TYPE</Label>
                      <div className="flex gap-2">
                        {(['male', 'female'] as Gender[]).map(g => (
                          <OptionBtn key={g} active={cd.gender === g} onClick={() => update('gender', g)}>
                            {g}
                          </OptionBtn>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Label>ARCHETYPE</Label>
                      <div className="flex flex-wrap gap-2">
                        {(['brawler', 'grappler', 'high_flyer', 'powerhouse', 'technician'] as Archetype[]).map(a => (
                          <OptionBtn key={a} active={cd.archetype === a} onClick={() => update('archetype', a)}>
                            {a.replace('_', ' ')}
                          </OptionBtn>
                        ))}
                      </div>
                    </div>
                  </Section>

                  <Section title="ENTRANCE_PROTOCOL">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-4">
                          <Label>THEME</Label>
                          <select 
                            className="bg-zinc-900 border border-zinc-800 text-white text-[10px] p-2 flex-1 outline-none"
                            value={cd.entrance?.music || 'THEME_DEFAULT'}
                            onChange={(e) => {
                                const entrance = { ...cd.entrance, music: e.target.value, lighting: cd.entrance?.lighting || 'WHITE', taunt: cd.entrance?.taunt || 'DEFAULT' };
                                setCd(prev => ({ ...prev, entrance }));
                            }}
                          >
                            <option value="THEME_DEFAULT">THEME_DEFAULT</option>
                            <option value="THEME_METAL">THEME_METAL</option>
                            <option value="THEME_ELECTRONIC">THEME_ELECTRONIC</option>
                          </select>
                        </div>
                    </div>
                  </Section>

                  <Section title="FINISHER_INFO">
                    <div className="flex flex-col gap-2">
                      <Label>SIGIL_FREQ</Label>
                      <div className="flex flex-wrap gap-2">
                        {['#ff2244','#4488ff','#22cc88','#cc44ff','#ff8800','#00ccff','#ffffff','#ffff00'].map(c => (
                          <ColorSwatch key={c} color={c} active={cd.sigil === c} onClick={() => update('sigil', c)} />
                        ))}
                      </div>
                    </div>
                  </Section>
               </motion.div>
            )}

            {activeTab === 'physics' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Section title="MORPHOLOGY (BODY TYPE)">
                    <div className="flex flex-col gap-6">
                      <div className="flex items-center gap-4 group">
                        <Label>HEIGHT (FEET)</Label>
                        <input type="range" min="60" max="110" value={cd.height} onChange={e => update('height', +e.target.value)} className="flex-1 accent-red-600 h-1 bg-zinc-800" />
                        <span className="text-[10px] text-red-600 font-black min-w-[30px]">{Math.floor(cd.height / 100 * 7)}'{Math.floor((cd.height / 100 * 7 % 1) * 12)}"</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <Label>MUSCLE MASS</Label>
                        <input type="range" min="0" max="100" value={cd.muscleMass * 100} onChange={e => update('muscleMass', +e.target.value / 100)} className="flex-1 accent-red-600 h-1 bg-zinc-800" />
                        <span className="text-[10px] text-zinc-500 font-black">{Math.round(cd.muscleMass * 100)}%</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <Label>BODY FAT</Label>
                        <input type="range" min="0" max="100" value={cd.fatMass * 100} onChange={e => update('fatMass', +e.target.value / 100)} className="flex-1 accent-red-600 h-1 bg-zinc-800" />
                        <span className="text-[10px] text-zinc-500 font-black">{Math.round(cd.fatMass * 100)}%</span>
                      </div>
                    </div>
                  </Section>

                  <div className="bg-zinc-950/40 p-4 border border-zinc-900 flex flex-col justify-center">
                    <div className="text-[8px] text-zinc-600 font-black tracking-widest uppercase mb-4">SPEC_SUMMARY</div>
                    <div className="space-y-2">
                       <div className="flex justify-between border-b border-zinc-900 pb-1">
                          <span className="text-[9px] text-zinc-500">MOMENTUM_SPEC</span>
                          <span className="text-[10px] font-bold text-red-700">{(1.5 - cd.fatMass - (cd.height/200)).toFixed(2)}m/s²</span>
                       </div>
                       <div className="flex justify-between border-b border-zinc-900 pb-1">
                          <span className="text-[9px] text-zinc-500">DURABILITY_COEFF</span>
                          <span className="text-[10px] font-bold text-red-700">{(1 + cd.muscleMass * 0.4 + cd.fatMass * 0.2).toFixed(1)}x</span>
                       </div>
                       <div className="flex justify-between">
                          <span className="text-[9px] text-zinc-500">WEIGHT_CLASS</span>
                          <span className="text-[10px] font-bold text-white uppercase">{cd.height < 82 ? 'Cruiser' : (cd.height > 100 || cd.bodyType === 'heavy' ? 'Super_Heavy' : 'Heavyweight')}</span>
                       </div>
                    </div>
                  </div>
                </div>
                
                <Section title="ANATOMICAL_CALIBRATION">
                   <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-6">
                     {['headSize','neckLength','shoulderWidth','chestSize','torsoLength','waistWidth','hipWidth','armLength','armThickness','handSize','legLength','legThickness','footSize'].map(p => (
                        <div key={p} className="flex flex-col gap-1">
                          <div className="flex justify-between items-center group">
                            <Label className="text-[8px] opacity-70 group-hover:opacity-100 transition-opacity">{p.replace(/([A-Z])/g, '_$1').toUpperCase()}</Label>
                            <span className="text-[8px] text-red-600 font-bold">{Math.round(((cd.proportions as any)?.[p] || 1) * 100)}</span>
                          </div>
                          <input 
                             type="range" min="50" max="150" value={((cd.proportions as any)?.[p] || 1) * 100} 
                             onChange={e => update(`proportions.${p}`, +e.target.value / 100)} 
                             className="w-full accent-red-600 h-1 bg-zinc-800" 
                          />
                        </div>
                     ))}
                   </div>
                   
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-8 border-t border-zinc-900 pt-6">
                      <div className="flex flex-col gap-2">
                        <Label>BREAST_VOLUME</Label>
                        <input type="range" min="0" max="200" value={cd.breastSize * 100} onChange={e => update('breastSize', +e.target.value / 100)} className="w-full accent-red-600 h-1 bg-zinc-800" />
                        <span className="text-[9px] text-zinc-500 font-bold uppercase">{Math.round(cd.breastSize * 100)}% DISPLACEMENT</span>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label>GLUTE_MASS</Label>
                        <input type="range" min="0" max="200" value={cd.gluteSize * 100} onChange={e => update('gluteSize', +e.target.value / 100)} className="w-full accent-red-600 h-1 bg-zinc-800" />
                        <span className="text-[9px] text-zinc-500 font-bold uppercase">{Math.round(cd.gluteSize * 100)}% TRACTION</span>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label>FEMININE_CURVE</Label>
                        <input type="range" min="0" max="100" value={cd.feminineCurve * 100} onChange={e => update('feminineCurve', +e.target.value / 100)} className="w-full accent-red-600 h-1 bg-zinc-800" />
                      </div>
                   </div>
                </Section>
              </motion.div>
            )}

            {activeTab === 'cosmetics' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <Section title="SURFACE_DATA">
                    <div className="flex flex-col gap-2">
                      <Label>SKIN_PIGMENT</Label>
                      <div className="flex flex-wrap gap-2">
                        {SKIN_COLORS.map(c => (
                          <ColorSwatch key={c} color={c} active={cd.skinColor === c} onClick={() => update('skinColor', c)} />
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label>EYE_COLOR</Label>
                      <div className="flex flex-wrap gap-2">
                        {EYE_COLORS.map(c => (
                          <ColorSwatch key={c} color={c} active={cd.eyeColor === c} onClick={() => update('eyeColor', c)} />
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label>DENTAL_FINISH</Label>
                        <div className="flex flex-wrap gap-2">
                            {['#ffffff', '#fff7e0', '#e0e0e0', '#ffd700', '#c0c0c0', '#000000'].map(c => (
                                <ColorSwatch key={c} color={c} active={cd.teethColor === c} onClick={() => update('teethColor', c)} />
                            ))}
                        </div>
                    </div>
                </Section>

                <Section title="CROWN_CONFIG">
                  <div className="flex items-center gap-4">
                    <Label>HAIR_STYLE</Label>
                    <div className="flex flex-wrap gap-2">
                      {HAIR_STYLES.map(h => (
                        <OptionBtn key={h} active={cd.hairStyle === h} onClick={() => update('hairStyle', h)}>
                          {h.replace('_', ' ')}
                        </OptionBtn>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Label>FACIAL_HAIR</Label>
                    <div className="flex flex-wrap gap-2">
                      {['none', 'beard', 'stubble', 'mustache', 'goatee'].map(h => (
                        <OptionBtn key={h} active={cd.facialHairStyle === h} onClick={() => update('facialHairStyle', h)}>
                          {h}
                        </OptionBtn>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>HUE_PRIMARY</Label>
                    <div className="flex flex-wrap gap-2">
                      {HAIR_COLORS.map(c => (
                        <ColorSwatch key={c} color={c} active={cd.hairColor === c} onClick={() => update('hairColor', c)} />
                      ))}
                    </div>
                  </div>
                </Section>
                
                <Section title="CIAROSCURO & MARKS">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-4">
                            <Label>FACEPAINT</Label>
                            <div className="flex flex-wrap gap-2">
                                {CLOTHING_OPTIONS.facepaints.map(t => (
                                <OptionBtn key={t} active={cd.clothing.facepaint === t} onClick={() => update('clothing.facepaint', t)}>
                                    {t}
                                </OptionBtn>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Label>SIGIL_SCARS</Label>
                            <div className="flex flex-wrap gap-2">
                                {['none', 'eye_slash', 'cheek_cross', 'forehead_stitch'].map(s => (
                                <OptionBtn key={s} active={cd.scars?.includes(s)} onClick={() => update('scars', cd.scars?.includes(s) ? cd.scars.filter(x => x !== s) : [...(cd.scars || []), s])}>
                                    {s}
                                </OptionBtn>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Label>KARMIC_TATTOOS</Label>
                            <div className="flex flex-wrap gap-2">
                                {['none', 'arm_sleeve', 'chest_piece', 'back_dragon'].map(t => (
                                <OptionBtn key={t} active={cd.tattoos?.includes(t)} onClick={() => update('tattoos', cd.tattoos?.includes(t) ? cd.tattoos.filter(x => x !== t) : [...(cd.tattoos || []), t])}>
                                    {t}
                                </OptionBtn>
                                ))}
                            </div>
                        </div>
                    </div>
                </Section>
              </motion.div>
            )}

            {activeTab === 'wardrobe' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <Section title="ATTIRE_SELECTION">
                   <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-4">
                        <Label>DATA_SLOT</Label>
                        <div className="flex gap-2">
                          {[0, 1, 2, 3].map(slot => (
                            <button
                                key={slot}
                                onClick={() => update('attireSlot', slot + 1)}
                                className={`w-12 h-12 flex items-center justify-center font-['Orbitron'] text-xs font-black border transition-all ${((cd.attireSlot || 1) === slot + 1) ? 'bg-red-600 border-red-600 text-white shadow-[0_0_20px_rgba(255,0,0,0.3)]' : 'bg-transparent border-zinc-800 text-zinc-600 hover:border-zinc-500'}`}
                            >
                                {slot + 1}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="text-[8px] text-zinc-600 italic uppercase">
                         ATTIRE_SLOT: SLOT_{cd.attireSlot || 1}
                      </div>
                   </div>
                </Section>

                <Section title="INTEGRITY_SHROUD">
                    <div className="flex items-center gap-4">
                    <Label>TOP_DECK</Label>
                    <div className="flex flex-wrap gap-2">
                        {CLOTHING_OPTIONS.tops.map(t => (
                        <OptionBtn key={t} active={cd.clothing.top === t} onClick={() => update('clothing.top', t)}>
                            {t}
                        </OptionBtn>
                        ))}
                    </div>
                    </div>
                    <div className="flex items-center gap-4">
                    <Label>LOWER_SYS</Label>
                    <div className="flex flex-wrap gap-2">
                        {CLOTHING_OPTIONS.bottoms.map(t => (
                        <OptionBtn key={t} active={cd.clothing.bottom === t} onClick={() => update('clothing.bottom', t)}>
                            {t}
                        </OptionBtn>
                        ))}
                    </div>
                    </div>
                </Section>

                <Section title="ARMAMENT_LAYER">
                    {['elbowPadL','elbowPadR','kneePadL','kneePadR','wristbandL','wristbandR','gloveL', 'gloveR', 'boots', 'kickpads'].map(item => (
                        <div key={item} className="flex items-center gap-4">
                            <Label>{item.replace(/([A-Z])/g, '_$1').toUpperCase()}</Label>
                            <div className="flex flex-wrap gap-2">
                                {['none', 'regular'].map(opt => (
                                    <OptionBtn key={opt} active={(cd.clothing as any)?.[item] === opt} onClick={() => update(`clothing.${item}`, opt)}>
                                        {opt}
                                    </OptionBtn>
                                ))}
                            </div>
                        </div>
                    ))}
                </Section>

                <Section title="COLOR_VAL">
                    <div className="flex flex-col gap-2">
                        <Label>PRIMARY</Label>
                        <div className="flex flex-wrap gap-2">
                            {CLOTH_COLORS.map(c => (
                                <ColorSwatch key={c} color={c} active={cd.topColor === c} onClick={() => update('topColor', c)} />
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label>SECONDARY</Label>
                        <div className="flex flex-wrap gap-2">
                            {CLOTH_COLORS.map(c => (
                                <ColorSwatch key={c} color={c} active={cd.bottomColor === c} onClick={() => update('bottomColor', c)} />
                            ))}
                        </div>
                    </div>
                </Section>
              </motion.div>
            )}

            {activeTab === 'neural' && (
               <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  {(() => {
                    const gematria = calculateGematria(cd.name);
                    const numerology = calculateNumerology(cd.name);
                    
                    return (
                      <>
                        <Section title="VIBRATIONAL_SCAN (GEMATRIA)">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-black/40 p-4 border border-zinc-900">
                              <div className="text-[8px] text-zinc-600 font-black tracking-widest uppercase mb-1">SIMPLE_CIPHER</div>
                              <div className="text-2xl font-black text-white">{gematria.simple}</div>
                            </div>
                            <div className="bg-black/40 p-4 border border-zinc-900">
                              <div className="text-[8px] text-zinc-600 font-black tracking-widest uppercase mb-1">ENGLISH_CIPHER</div>
                              <div className="text-2xl font-black text-red-600">{gematria.english}</div>
                            </div>
                          </div>
                        </Section>

                        <Section title="SOVEREIGN_BLUEPRINT (NUMEROLOGY)">
                          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                            <StatBox label="LIFE_PATH" val={numerology.lifePath} desc="The Terrain of Mission" />
                            <StatBox label="EXPRESSION" val={numerology.expression} desc="The Talent Vehicle" />
                            <StatBox label="SOUL_URGE" val={numerology.soulUrge} desc="The Internal Fuel" />
                            <StatBox label="PERSONALITY" val={numerology.personality} desc="The Mask/Armor" />
                            <StatBox label="MATURITY" val={numerology.maturity} desc="The End Game Legacy" />
                          </div>
                          
                          <div className="mt-6 p-6 border border-zinc-800 bg-red-600/5 relative overflow-hidden">
                             <div className="absolute top-0 right-0 p-2 opacity-10"><Swords size={40}/></div>
                             <div className="text-[10px] text-red-600 font-black tracking-[4px] uppercase mb-4">TACTICAL_SITUATION_REPORT</div>
                             
                             <div className="space-y-4">
                                <div>
                                   <div className="text-[9px] text-zinc-500 font-bold uppercase mb-1">THE_ENEMY (SLAVE_CONTRACT)</div>
                                   <div className="text-xs text-zinc-300 font-['Share_Tech_Mono']">
                                      {numerology.lifePath === 8 ? "Debt-bonded to material gain. The simulation forces resource exhaustion." : 
                                       numerology.soulUrge === 5 ? "Hostage to chaotic impulses and sensory distraction." :
                                       "Survival mode induced by standard societal conditioning."}
                                   </div>
                                </div>
                                
                                <div>
                                   <div className="text-[9px] text-zinc-500 font-bold uppercase mb-1">THE_WEAPON (MARS_PROTOCOL)</div>
                                   <div className="text-xs text-zinc-300 font-['Share_Tech_Mono']">
                                      {cd.archetype === 'brawler' ? "Unleash primal kinetic energy. Direct force override." : 
                                       cd.archetype === 'technician' ? "Execute forensic strikes. Precision code break." :
                                       "Deploy high-velocity maneuverability to bypass defense."}
                                   </div>
                                </div>

                                <div>
                                   <div className="text-[9px] text-zinc-500 font-bold uppercase mb-1">THE_BREACH (ESCAPE_ROUTE)</div>
                                   <div className="text-xs font-black text-red-500 uppercase tracking-tighter italic border-l-2 border-red-600 pl-2">
                                      ACTIVATE MATURITY {numerology.maturity} FREQUENCY. MASTER THE RESTRICTION TO UNLOCK THE CORE.
                                   </div>
                                </div>
                             </div>
                          </div>
                        </Section>
                      </>
                    );
                  })()}

                <Section title="AI_BEHAVIOR">
                    <Label>ABILITIES</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {['armor', 'vampire', 'rage', 'shield', 'speed_boost', 'lifesteal', 'poison', 'burn'].map(ability => (
                            <OptionBtn 
                                key={ability} 
                                active={cd.abilities.includes(ability as any)} 
                                onClick={() => {
                                    const newAbil = cd.abilities.includes(ability as any) 
                                        ? cd.abilities.filter(a => a !== ability)
                                        : [...cd.abilities, ability as any];
                                    update('abilities', newAbil);
                                }}
                            >
                                {ability.replace('_', ' ')}
                            </OptionBtn>
                        ))}
                    </div>
                </Section>

                <Section title="MOVESET_PREVIEW">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <Label>FINISHER</Label>
                            <select 
                            className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-[10px] p-2 focus:border-red-600 outline-none w-full"
                            value={Object.entries(MoveLibrary).find(([k,v]) => (v as any).name === cd.moveset?.finishers[0]?.name)?.[0] || ''}
                            onChange={(e) => {
                                const move = MoveLibrary[e.target.value];
                                if (move) {
                                const newMoveset = { ...cd.moveset };
                                newMoveset.finishers = [move];
                                setCd(prev => ({ ...prev, moveset: newMoveset }));
                                }
                            }}
                            >
                            <option value="">SELECT MANEUVER</option>
                            {Object.entries(MoveLibrary).filter(([k,v]) => (v as any).animation === 'ultra').map(([id, move]) => (
                                <option key={id} value={id}>{(move as any).name}</option>
                            ))}
                            </select>
                        </div>
                    </div>
                </Section>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-6 mt-8 w-full max-w-7xl">
        <button
          onClick={() => onSave(cd)}
          className="flex-1 py-4 font-['Orbitron'] text-[11px] font-black tracking-[6px] uppercase bg-white text-black hover:bg-red-600 hover:text-white transition-all shadow-[0_10px_30px_rgba(255,255,255,0.1)]"
        >
          SAVE SUPERSTAR
        </button>
        <button
          onClick={onCancel}
          className="px-12 py-4 font-['Orbitron'] text-[11px] font-black tracking-[4px] uppercase border border-zinc-800 text-zinc-500 hover:border-zinc-400 hover:text-white transition-all"
        >
          BACK
        </button>
      </div>
    </motion.div>
  );
};
