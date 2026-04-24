import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sword, Trophy, Users, BookOpen, UserCog, Settings, Star } from 'lucide-react';
import { GameOptions } from '../types';
import { MatchSelection } from './MatchSelection';

interface MainMenuProps {
  onStartExhibition: (category: string, type: string) => void;
  onOpenCreationSuite: () => void;
  onStartTournament: () => void;
  onEnterMode: (mode: 'career' | 'gm' | 'universe' | 'faction') => void;
  gameOptions: GameOptions;
  setGameOptions: (options: GameOptions) => void;
  superstars: any[];
}

const TABS = ['PLAY', 'INTELLIGENCE', 'OPTIONS'];

export const MainMenu: React.FC<MainMenuProps> = ({ 
  onStartExhibition, 
  onOpenCreationSuite, 
  onStartTournament,
  onEnterMode,
  gameOptions, 
  setGameOptions,
  superstars
}) => {
  const [activeTabIdx, setActiveTabIdx] = useState(0);
  const [menuFocusIdx, setMenuFocusIdx] = useState(0);
  const [showMatchSettings, setShowMatchSettings] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === 'u' || key === 'tab') {
        setActiveTabIdx(prev => (prev + 1) % TABS.length);
        setMenuFocusIdx(0);
      }
      
      // Directional Navigation
      if (activeTabIdx === 0 && !showMatchSettings) { // Play Tab
        if (key === 'd' || key === 'arrowright') {
            if (menuFocusIdx < 3) setMenuFocusIdx(prev => prev + 1);
            else if (menuFocusIdx >= 4 && menuFocusIdx < 6) setMenuFocusIdx(prev => prev + 1);
        }
        if (key === 'a' || key === 'arrowleft') {
            if (menuFocusIdx > 0 && menuFocusIdx <= 3) setMenuFocusIdx(prev => prev - 1);
            else if (menuFocusIdx > 4) setMenuFocusIdx(prev => prev - 1);
        }
        if (key === 's' || key === 'arrowdown') {
            if (menuFocusIdx <= 3) {
                // Determine which bottom item to focus
                if (menuFocusIdx === 0) setMenuFocusIdx(4);
                else if (menuFocusIdx <= 2) setMenuFocusIdx(5);
                else setMenuFocusIdx(6);
            }
        }
        if (key === 'w' || key === 'arrowup') {
            if (menuFocusIdx >= 4) {
                if (menuFocusIdx === 4) setMenuFocusIdx(0);
                else if (menuFocusIdx === 5) setMenuFocusIdx(1);
                else setMenuFocusIdx(3);
            }
        }
        if (key === 'enter' || key === 'e' || key === 'f') {
            const playActions = [
                () => setShowMatchSettings(true),
                onStartTournament,
                () => {}, // Online (locked)
                () => onEnterMode('career'),
                () => onEnterMode('gm'),
                () => onEnterMode('universe'),
                () => onEnterMode('faction')
            ];
            if (playActions[menuFocusIdx]) playActions[menuFocusIdx]();
        }
      }

      if (showMatchSettings) {
        return; 
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTabIdx, menuFocusIdx, onStartExhibition, onStartTournament]);

  const renderPlayTab = () => (
    <div className="flex flex-col w-full h-full">
      <div className="grid grid-cols-6 grid-rows-3 gap-6 w-full flex-1 min-h-[500px] mt-4">
        {/* Exhibition - Mega Row */}
        <div className="col-span-4 row-span-2">
            <MenuCard 
              icon={<Sword size={48} />} 
              title="EXHIBITION" 
              desc="Standard Audit of Sovereignty. Define the Parameters of Conflict."
              onClick={() => setShowMatchSettings(true)}
              active={menuFocusIdx === 0}
              className="h-full"
            />
        </div>
        
        {/* Tournament - Vertical High */}
        <div className="col-span-2 row-span-2">
            <MenuCard 
              icon={<Trophy size={48} />} 
              title="TOURNAMENT" 
              desc="Climb the bracket system. Secure the Apex Throne."
              onClick={onStartTournament}
              active={menuFocusIdx === 1}
              className="h-full"
            />
        </div>

        {/* Small Buttons Row */}
        <div className="col-span-2">
            <MenuCard title="AUDIT GM" desc="Run the Core." icon={<Users size={20}/>} onClick={() => onEnterMode('gm')} active={menuFocusIdx === 4} small className="h-full" />
        </div>
        <div className="col-span-2">
            <MenuCard title="UNIVERSE" desc="Continuous sandbox." icon={<Settings size={20}/>} onClick={() => onEnterMode('universe')} active={menuFocusIdx === 5} small className="h-full" />
        </div>
        <div className="col-span-2">
            <MenuCard title="FACTION" desc="Build your unit." icon={<Star size={20}/>} onClick={() => onEnterMode('faction')} active={menuFocusIdx === 6} small locked className="h-full" />
        </div>
      </div>
    </div>
  );

  const renderCustomizeTab = () => (
    <div className="flex flex-col items-start gap-8 h-full pt-8">
      <motion.div 
        whileHover={{ scale: 1.01 }}
        className="relative group cursor-pointer w-full max-w-5xl"
        onClick={onOpenCreationSuite}
      >
        <div className="absolute inset-0 bg-red-600/5 blur-3xl group-hover:bg-red-600/10 transition-all" />
        <div className="relative bg-zinc-950 border border-zinc-900 overflow-hidden group">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-red-600/5 -skew-x-12 translate-x-32" />
          
          <div className="flex p-16 gap-12 items-center">
            <div className="p-10 bg-zinc-900 border border-zinc-800 group-hover:border-red-600 transition-all -skew-x-12">
               <UserCog size={64} className="text-red-600 skew-x-12" />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                 <div className="w-2 h-2 bg-red-600 animate-ping" />
                 <span className="text-[10px] font-black text-zinc-500 tracking-[8px] uppercase">CREATION_PROTOCOL_V2</span>
              </div>
              <h2 className="text-7xl font-black italic tracking-tighter uppercase leading-none">INTELLIGENCE <span className="text-red-600">HUB</span></h2>
              <p className="text-sm font-bold text-zinc-400 max-w-xl leading-relaxed">
                 Access the Architect's Sanctum. Re-code reality. Synthesize superstars, carve arenas from raw geometry, and forge championships.
              </p>
              
              <div className="pt-8 flex gap-8">
                 {[
                   { label: 'SUPERSTARS', count: superstars.length },
                   { label: 'ARENAS', count: '04' },
                   { label: 'TITLES', count: '12' }
                 ].map(stat => (
                   <div key={stat.label} className="border-l border-zinc-800 pl-6">
                      <span className="text-[10px] font-black text-zinc-600 tracking-[3px] uppercase block">{stat.label}</span>
                      <span className="text-2xl font-black italic text-white uppercase">{stat.count}</span>
                   </div>
                 ))}
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-4 right-12 text-[9px] font-black text-zinc-800 tracking-[10px] uppercase">
             INITIALIZE_CORE_SYNC
          </div>
        </div>
      </motion.div>
    </div>
  );

  const renderOptionsTab = () => (
    <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
        <OptionGroup title="SIMULATION_PARAMETERS">
            <OptionRow label="DIFFICULTY_THROTTLE">
                <div className="flex gap-2">
                    {['easy', 'normal', 'hard', 'legend'].map(d => (
                        <button 
                            key={d}
                            onClick={() => setGameOptions({ ...gameOptions, difficulty: d as any })}
                            className={`px-4 py-1 text-[9px] font-black uppercase border transition-all ${gameOptions.difficulty === d ? 'bg-red-600 border-red-600 text-white' : 'border-zinc-800 text-zinc-600 hover:border-zinc-500'}`}
                        >
                            {d}
                        </button>
                    ))}
                </div>
            </OptionRow>
            <Slider label="AGRESSION_SLIDER" value={gameOptions.aiSliders.aggression} onChange={(v: number) => setGameOptions({...gameOptions, aiSliders: {...gameOptions.aiSliders, aggression: v}})} />
            <Slider label="REVERSAL_FREQUENCY" value={gameOptions.aiSliders.reversalRate} onChange={(v: number) => setGameOptions({...gameOptions, aiSliders: {...gameOptions.aiSliders, reversalRate: v}})} />
        </OptionGroup>

        <OptionGroup title="VISUAL_OVERLAYS">
            <Toggle label="BIOLOGICAL_FLUIDS" active={gameOptions.bloodEnabled} onToggle={() => setGameOptions({...gameOptions, bloodEnabled: !gameOptions.bloodEnabled})} />
            <OptionRow label="UI_OPACITY">
                <div className="w-full h-1 bg-zinc-800 rounded-full" />
            </OptionRow>
        </OptionGroup>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black text-white selection:bg-red-600 font-['Orbitron'] overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,40,0.1),transparent_70%)] animate-pulse" />
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-600/50 to-transparent" />
      </div>

      {/* Side HUD Decor */}
      <div className="absolute left-10 top-0 bottom-0 w-[1px] bg-zinc-900 flex flex-col justify-center items-center gap-32">
        <div className="w-1 h-32 bg-red-600 shadow-[0_0_20px_rgba(255,0,0,0.5)]" />
        <div className="rotate-90 text-[10px] text-zinc-700 tracking-[10px] whitespace-nowrap uppercase">SOVEREIGN_SYSTEM_READY</div>
      </div>

      <div className="relative z-10 h-full flex flex-col p-8 lg:p-12 lg:pl-32 overflow-y-auto custom-scrollbar">
        <header className="mb-8 lg:mb-16">
          <div className="flex items-center gap-4 text-red-600 mb-2">
            <Sword size={16} className="animate-pulse" />
            <span className="text-[10px] font-black tracking-[4px]">AUDIT_SEQ: 0924_REMIX</span>
          </div>
          <h1 className="text-6xl lg:text-8xl font-black italic tracking-tighter leading-none">
            SOVEREIGN<span className="text-red-600">STRIKE</span>
          </h1>
          <div className="text-[10px] text-zinc-600 tracking-[10px] uppercase mt-2">THE_CORE_UNLOCKED</div>
        </header>

        <nav className="flex gap-16 mb-12 border-b border-zinc-900 pb-4">
          {TABS.map((tab, idx) => (
            <button
              key={tab}
              onClick={() => setActiveTabIdx(idx)}
              className={`relative px-4 py-2 text-sm font-black transition-all group ${activeTabIdx === idx ? 'text-white' : 'text-zinc-600 hover:text-zinc-400'}`}
            >
              {activeTabIdx === idx && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute inset-0 border-b-2 border-red-600"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="tracking-[4px]">{tab}</span>
            </button>
          ))}
        </nav>

        <main className="flex-1 min-h-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTabIdx}
              initial={{ opacity: 0, x: 50, filter: 'blur(20px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: -50, filter: 'blur(20px)' }}
              transition={{ duration: 0.5, ease: 'circOut' }}
            >
              {activeTabIdx === 0 && renderPlayTab()}
              {activeTabIdx === 1 && renderCustomizeTab()}
              {activeTabIdx === 2 && renderOptionsTab()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <AnimatePresence>
        {showMatchSettings && (
            <MatchSelection 
              onBack={() => setShowMatchSettings(false)}
              onSelect={(cat, type) => {
                setShowMatchSettings(false);
                onStartExhibition(cat, type);
              }}
            />
        )}
      </AnimatePresence>

      <div className="fixed bottom-10 right-10 flex gap-12 text-[9px] font-black text-zinc-700 tracking-[3px] uppercase">
        <div className="flex flex-col items-end">
            <span>AUDIT_STABILITY: 98.4%</span>
            <span>MEMORY_CACHE: OPTIMIZED</span>
        </div>
        <div className="w-12 h-12 border border-zinc-900 flex items-center justify-center">
            <div className="w-4 h-4 bg-red-600/30 animate-ping" />
        </div>
      </div>
    </div>
  );
};

const MenuCard = ({ icon, title, desc, onClick, locked = false, featured = false, active = false, small = false, className = '' }: any) => (
    <motion.div
      whileHover={locked ? {} : { scale: 1.02, filter: 'brightness(1.1)' }}
      animate={active ? { borderColor: 'rgba(220,38,38,1)', scale: 1.02 } : {}}
      whileTap={locked ? {} : { scale: 0.98 }}
      onClick={locked ? undefined : onClick}
      className={`
        relative overflow-hidden transition-all cursor-pointer flex flex-col justify-between
        ${small ? 'p-6 border-zinc-800 bg-zinc-900/30' : 'p-10'}
        ${locked ? 'opacity-30 grayscale cursor-not-allowed border-zinc-900' : 'hover:border-red-600/50'}
        ${featured || active ? 'border-red-600 shadow-[0_0_50px_rgba(220,38,38,0.15)] bg-gradient-to-br from-red-600/10 to-zinc-950' : 'border-zinc-800 bg-zinc-900/40'}
        -skew-x-2 border ${className}
      `}
    >
        <div className="skew-x-6 h-full flex flex-col">
            <div className={`mb-6 p-4 border border-current flex items-center justify-center ${small ? 'w-10 h-10' : 'w-16 h-16'} ${locked ? 'text-zinc-700' : (active ? 'text-white bg-red-600' : 'text-red-600')}`}>{icon}</div>
            <div>
                <h3 className={`${small ? 'text-sm' : 'text-2xl'} font-black italic uppercase tracking-tighter mb-1`}>{title}</h3>
                <p className={`${small ? 'text-[7px]' : 'text-[9px]'} text-zinc-500 font-bold tracking-widest leading-loose uppercase`}>{desc}</p>
            </div>
            
            {(featured || active) && (
                <div className="absolute top-4 right-4 flex items-center gap-2">
                    <span className="text-[8px] font-black text-red-600 tracking-widest">{active ? 'SELECTED' : 'LIVE_CORE'}</span>
                    <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
                </div>
            )}
        </div>
    </motion.div>
);

const OptionGroup = ({ title, children }: any) => (
    <div className="flex flex-col gap-6 bg-zinc-900/20 p-8 border border-zinc-900">
        <h4 className="text-[10px] font-black tracking-[5px] text-red-600 uppercase border-b border-zinc-800 pb-2">{title}</h4>
        <div className="flex flex-col gap-4">
            {children}
        </div>
    </div>
);

const OptionRow = ({ label, children }: any) => (
    <div className="flex flex-col gap-2">
        <span className="text-[10px] font-black tracking-widest text-zinc-500 uppercase">{label}</span>
        {children}
    </div>
);

const Slider = ({ label, value, onChange }: any) => (
    <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
            <span className="text-[9px] font-bold tracking-[3px] text-zinc-600 uppercase">{label}</span>
            <span className="text-[10px] font-mono text-red-600">{value}%</span>
        </div>
        <input 
            type="range" min="0" max="100" value={value} 
            onChange={(e) => onChange(parseInt(e.target.value))}
            className="w-full h-1 bg-zinc-800 appearance-none cursor-pointer accent-red-600"
        />
    </div>
);

const Toggle = ({ label, active, onToggle }: any) => (
    <div 
        onClick={onToggle}
        className="flex items-center justify-between group cursor-pointer"
    >
        <span className="text-[10px] font-bold tracking-[3px] text-zinc-600 uppercase group-hover:text-zinc-400 transition-colors">{label}</span>
        <div className={`w-12 h-6 flex items-center p-1 border transition-all ${active ? 'bg-red-600/20 border-red-600' : 'bg-transparent border-zinc-800'}`}>
            <motion.div 
                animate={{ x: active ? 24 : 0 }}
                className={`w-4 h-4 ${active ? 'bg-white shadow-[0_0_10px_white]' : 'bg-zinc-800'}`}
            />
        </div>
    </div>
);
