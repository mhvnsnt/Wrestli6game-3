import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  MapPin, 
  Trophy, 
  Tv, 
  ChevronLeft, 
  Sparkles,
  Plus,
  Settings,
  Palette,
  Layout,
  Crown
} from 'lucide-react';
import { CharacterData } from '../types';
import { Customizer } from './Customizer';
import { ROSTER } from '../data/roster';

interface CreationSuiteProps {
  superstars: CharacterData[];
  onBack: () => void;
  onSaveCharacter: (data: CharacterData) => void;
  onSaveArena: (arena: any) => void;
  onSaveTitle: (title: any) => void;
}

type SuiteMode = 'hub' | 'superstar' | 'arena' | 'championship' | 'show';

export const CreationSuite: React.FC<CreationSuiteProps> = ({ superstars, onBack, onSaveCharacter, onSaveArena, onSaveTitle }) => {
  const [mode, setMode] = useState<SuiteMode>('hub');

  React.useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (mode === 'hub' && (key === 'b' || key === 'escape')) {
        onBack();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [mode, onBack]);

  const HubCard = ({ title, icon: Icon, desc, onClick, color = 'red' }: any) => (
    <motion.button
      whileHover={{ scale: 1.02, x: 10 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative group flex gap-6 p-8 bg-zinc-900 border border-zinc-800 hover:border-${color}-600 text-left transition-all overflow-hidden -skew-x-12`}
    >
      <div className={`absolute top-0 right-0 w-32 h-32 bg-${color}-600/5 -rotate-45 translate-x-16 -translate-y-16 group-hover:bg-${color}-600/10 transition-all`} />
      
      <div className="skew-x-12 flex-shrink-0">
        <div className={`p-4 bg-zinc-950 border border-zinc-800 group-hover:border-${color}-600 transition-all`}>
          <Icon size={32} className={`text-${color}-600`} />
        </div>
      </div>
      
      <div className="skew-x-12 flex flex-col justify-center">
        <h3 className="text-2xl font-black italic tracking-tighter uppercase leading-none mb-2">{title}</h3>
        <p className="text-[10px] font-bold text-zinc-500 tracking-[4px] uppercase">{desc}</p>
      </div>
      
      <div className={`absolute bottom-4 right-8 text-[8px] font-black text-zinc-800 tracking-[8px] uppercase group-hover:text-${color}-600 transition-all`}>
        INITIALIZE_PROTOCOL_0{color === 'blue' ? 2 : color === 'green' ? 3 : 1}
      </div>
    </motion.button>
  );

  return (
    <div className="fixed inset-0 z-[100] bg-[#050505] overflow-hidden flex flex-col">
      <AnimatePresence mode="wait">
        {mode === 'hub' ? (
          <motion.div 
            key="hub"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col p-12 lg:p-20"
          >
            {/* Header */}
            <header className="flex justify-between items-end mb-16 border-b border-zinc-900 pb-8">
              <div>
                <h1 className="text-8xl font-black italic tracking-tighter uppercase leading-none">
                  CREATION <span className="text-red-600">SUITE</span>
                </h1>
                <p className="text-zinc-500 font-bold tracking-[10px] uppercase mt-4 italic">
                  INTELLIGENCE_HUB // ARCHITECT_OVERRIDE
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-black text-zinc-700 tracking-[8px] uppercase block mb-1">UNITS_CREATED</span>
                <span className="text-4xl font-black text-white italic">0042</span>
              </div>
            </header>

            {/* Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 flex-1">
              <div className="flex flex-col gap-8">
                <HubCard 
                  title="CREATE_WRESTLER" 
                  desc="MODIFY_BIO_AND_STATS" 
                  icon={Users} 
                  color="red"
                  onClick={() => setMode('superstar')}
                />
                <HubCard 
                  title="CREATE_ARENA" 
                  desc="DESIGN_ENVIRONMENT" 
                  icon={MapPin} 
                  color="blue"
                  onClick={() => setMode('arena')}
                />
                <HubCard 
                  title="CREATE_TITLE" 
                  desc="CHAMPIONSHIP_BELT_EDITOR" 
                  icon={Trophy} 
                  color="green"
                  onClick={() => setMode('championship')}
                />
                <HubCard 
                  title="CREATE_SHOW" 
                  desc="BROADCAST_GRAPHICS" 
                  icon={Tv} 
                  color="yellow"
                  onClick={() => setMode('show')}
                />
                
                <div className="mt-8 flex gap-4">
                  <button onClick={onBack} className="px-12 py-4 border border-zinc-800 text-zinc-500 font-black uppercase text-[10px] tracking-[6px] hover:text-white hover:border-white transition-all flex items-center gap-4">
                    <ChevronLeft size={16} /> RETURN_TO_BASE
                  </button>
                </div>
              </div>

              {/* Preview / Teaser Panel */}
              <div className="hidden xl:flex flex-col bg-zinc-950 border border-zinc-900 p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[400px] h-full bg-red-600/5 -skew-x-[20deg] translate-x-32" />
                <div className="relative z-10 space-y-12">
                   <div>
                      <h4 className="text-sm font-black italic text-zinc-400 tracking-[4px] uppercase mb-4">LATEST_ASSET</h4>
                      <div className="aspect-video bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                         <Sparkles size={48} className="text-zinc-800 animate-pulse" />
                      </div>
                   </div>
                   
                   <div className="space-y-6">
                      <h4 className="text-sm font-black italic text-zinc-400 tracking-[4px] uppercase border-b border-zinc-900 pb-2">SUITE_STATUS</h4>
                      <div className="space-y-4">
                         {[
                           { label: "NEURAL_SYNTH", status: "LIVE", freq: "44.1kHz" },
                           { label: "CLOTH_PHYSICS", status: "STABLE", freq: "120Hz" },
                           { label: "PARTICLE_GEN", status: "ACTIVE", freq: "9.2M/S" }
                         ].map(s => (
                           <div key={s.label} className="flex justify-between items-center bg-zinc-900/40 p-4 border border-zinc-800">
                             <span className="text-[10px] font-black text-zinc-500 tracking-[3px] uppercase">{s.label}</span>
                             <div className="flex gap-4 items-center">
                               <span className="text-[8px] font-bold text-zinc-700">{s.freq}</span>
                               <span className="text-[9px] font-black text-red-600 italic">[{s.status}]</span>
                             </div>
                           </div>
                         ))}
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : mode === 'superstar' ? (
          <motion.div 
            key="superstar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1"
          >
            <Customizer 
              initialData={superstars[0] || ROSTER[0]} 
              availableCharacters={superstars}
              onSave={(data) => {
                onSaveCharacter(data);
                setMode('hub');
              }}
              onCancel={() => setMode('hub')}
            />
          </motion.div>
        ) : mode === 'arena' ? (
           <ArenaCreator 
            onSave={onSaveArena}
            onCancel={() => setMode('hub')} 
           />
        ) : mode === 'championship' ? (
           <ChampionshipCreator 
            onSave={onSaveTitle}
            onCancel={() => setMode('hub')} 
           />
        ) : (
           <ShowCreator onCancel={() => setMode('hub')} />
        )}
      </AnimatePresence>
    </div>
  );
};

const ArenaCreator = ({ onCancel, onSave }: any) => {
  const [name, setName] = useState('CUSTOM_ARENA_' + Math.floor(Math.random() * 1000));
  const [type, setType] = useState<'stadium' | 'gym' | 'backstage' | 'backyard'>('stadium');
  const [lighting, setLighting] = useState('#ff0000');
  const [matColor, setMatColor] = useState('#111111');
  
  const handleFinalize = () => {
    onSave({
      id: 'arena_' + Date.now(),
      name,
      lighting,
      ringColor: '#0a0a0a',
      apronColor: lighting,
      matColor,
      floorColor: '#050505',
      barricadeColor: '#222',
      showBackstage: type === 'backstage',
      type
    });
  };

  return (
  <motion.div 
    initial={{ opacity: 0, x: 100 }}
    animate={{ opacity: 1, x: 0 }}
    className="flex-1 flex flex-col p-12 lg:p-20 overflow-y-auto"
  >
     <header className="flex justify-between items-end mb-16 border-b border-zinc-900 pb-8">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <MapPin size={16} className="text-blue-600" />
              <span className="text-[10px] font-black text-zinc-500 tracking-[8px] uppercase">PROJECT: GEOMETRY_S</span>
           </div>
           <h1 className="text-7xl font-black italic tracking-tighter uppercase leading-none">ARENA <span className="text-blue-600">FORGE</span></h1>
        </div>
        <button onClick={onCancel} className="px-12 py-4 bg-zinc-900 text-zinc-500 hover:text-white font-black uppercase text-[10px] tracking-[4px] border border-zinc-800">CANCEL_BUILD</button>
     </header>

     <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
           <div className="aspect-video bg-zinc-950 border border-zinc-900 flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_black_90%)]" />
              <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
              <Layout size={64} className="text-zinc-800" />
              <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                 <div className="flex-1 mr-4">
                    <p className="text-[10px] font-black text-blue-600 tracking-[4px] uppercase mb-1">CURRENT_RENDER</p>
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value.toUpperCase())}
                      className="w-full bg-transparent border-b border-zinc-800 text-2xl font-black text-white italic uppercase tracking-tighter outline-none focus:border-blue-600"
                    />
                 </div>
                 <div className="flex gap-4">
                    <button className="p-3 bg-zinc-900 border border-zinc-800 text-blue-600 hover:bg-blue-600 hover:text-white transition-all"><Settings size={16}/></button>
                    <button className="p-3 bg-zinc-900 border border-zinc-800 text-blue-600 hover:bg-blue-600 hover:text-white transition-all"><Palette size={16}/></button>
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-2 gap-8">
              <div className="bg-zinc-900/40 border border-zinc-800 p-8 space-y-6">
                 <h4 className="text-[10px] font-black text-zinc-500 tracking-[4px] uppercase border-b border-zinc-800 pb-4">RIGGING_CONFIG</h4>
                 <div className="space-y-4">
                    {[
                      { label: 'STAGE_SIZE', val: 75 },
                      { label: 'CROWD_DENSITY', val: 85 },
                      { label: 'LIGHTING_PULSE', val: 60 },
                      { label: 'REVERB_SCALE', val: 90 }
                    ].map(s => (
                       <div key={s.label} className="space-y-1">
                          <div className="flex justify-between text-[9px] font-black text-zinc-600 uppercase">
                             <span>{s.label}</span>
                             <span className="text-blue-600">{s.val}%</span>
                          </div>
                          <div className="h-1 bg-zinc-950"><div className="h-full bg-blue-600" style={{ width: `${s.val}%` }} /></div>
                       </div>
                    ))}
                 </div>
              </div>
              <div className="bg-zinc-900/40 border border-zinc-800 p-8 space-y-6">
                 <h4 className="text-[10px] font-black text-zinc-500 tracking-[4px] uppercase border-b border-zinc-800 pb-4">LIGHTING_COLORS</h4>
                 <div className="grid grid-cols-4 gap-2">
                    {['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffffff', '#333333'].map(c => (
                       <div 
                        key={c} 
                        onClick={() => setLighting(c)}
                        className={`aspect-square border-2 cursor-pointer transition-all ${lighting === c ? 'border-white scale-110 z-10' : 'border-zinc-800 hover:border-blue-600'}`} 
                        style={{ background: c }}
                       />
                    ))}
                 </div>
                 <h4 className="text-[10px] font-black text-zinc-500 tracking-[4px] uppercase border-b border-zinc-800 pb-4 mt-4">MAT_COLORS</h4>
                 <div className="grid grid-cols-4 gap-2">
                    {['#111111', '#222222', '#330000', '#000033', '#003300', '#333300', '#330033', '#003333'].map(c => (
                       <div 
                        key={c} 
                        onClick={() => setMatColor(c)}
                        className={`aspect-square border-2 cursor-pointer transition-all ${matColor === c ? 'border-white scale-110 z-10' : 'border-zinc-800 hover:border-blue-600'}`} 
                        style={{ background: c }}
                       />
                    ))}
                 </div>
              </div>
           </div>
        </div>

        <div className="space-y-6">
           <div className="p-8 bg-zinc-950 border border-zinc-900">
              <h3 className="text-xl font-black italic text-white uppercase tracking-tighter mb-8 border-b border-zinc-900 pb-4">TEMPLATE_LIBRARY</h3>
              <div className="space-y-4">
                 {[
                   { id: 'stadium', label: 'STADIUM_ALPHA' },
                   { id: 'gym', label: 'WAREHOUSE_BETA' },
                   { id: 'backstage', label: 'FESTIVAL_GAMMA' },
                   { id: 'backyard', label: 'UNDERGROUND_DELTA' }
                 ].map(t => (
                    <button 
                      key={t.id} 
                      onClick={() => setType(t.id as any)}
                      className={`w-full p-4 border text-left transition-all group ${type === t.id ? 'border-blue-600 bg-blue-600/10' : 'bg-zinc-900 border-zinc-800 hover:border-blue-600'}`}
                    >
                       <span className={`text-[10px] font-black uppercase tracking-[4px] ${type === t.id ? 'text-blue-500' : 'text-zinc-600 group-hover:text-blue-600'}`}>{t.label}</span>
                    </button>
                 ))}
              </div>
           </div>
           
           <button 
            onClick={handleFinalize}
            className="w-full py-6 bg-blue-600 text-white font-black uppercase text-[10px] tracking-[8px] hover:bg-white hover:text-blue-600 transition-all shadow-2xl active:scale-95"
           >
              FINALIZE_GEOMETRY
           </button>
        </div>
     </div>
  </motion.div>
)};

const ChampionshipCreator = ({ onCancel, onSave }: any) => {
  const [name, setName] = useState('SOVEREIGN_UNIFIED_BELT');
  const [color, setColor] = useState('#22c55e');
  const [plate, setPlate] = useState(1);

  const handleMint = () => {
    onSave({
      id: 'title_' + Date.now(),
      name,
      color,
      plate
    });
  };

  return (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex-1 flex flex-col p-12 lg:p-20 items-center justify-center overflow-y-auto"
  >
     <div className="max-w-4xl w-full">
        <header className="flex justify-between items-end mb-16 border-b border-zinc-900 pb-8">
           <div>
              <div className="flex items-center gap-3 mb-2">
                 <Crown size={16} className="text-green-600" />
                 <span className="text-[10px] font-black text-zinc-500 tracking-[8px] uppercase">PROJECT: LEGACY_V</span>
              </div>
              <h1 className="text-7xl font-black italic tracking-tighter uppercase leading-none">TITLE <span className="text-green-600">STUDIO</span></h1>
           </div>
           <button onClick={onCancel} className="px-12 py-4 bg-zinc-900 text-zinc-500 hover:text-white font-black uppercase text-[10px] tracking-[4px] border border-zinc-800">DISCARD_DESIGN</button>
        </header>

        <div className="flex flex-col lg:flex-row gap-12">
            <div className="flex-1 bg-zinc-950 border border-zinc-900 aspect-[4/3] flex flex-col items-center justify-center p-12 relative overflow-hidden">
               <div className="absolute inset-0 bg-green-600/5 animate-pulse" />
               <div className="relative z-10 text-center">
                  <Trophy size={160} className="text-zinc-900 fill-zinc-900 opacity-20" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <Crown size={120} style={{ color }} className="drop-shadow-[0_0_40px_rgba(34,197,94,0.4)]" />
                  </div>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value.toUpperCase())}
                    className="w-full bg-transparent text-center border-b border-zinc-900 text-3xl font-black italic text-zinc-300 uppercase tracking-tighter mt-8 outline-none focus:border-green-600"
                  />
               </div>
            </div>

            <div className="w-full lg:w-[340px] space-y-8">
               <Section title="PLATE_DESIGN">
                  <div className="grid grid-cols-3 gap-2">
                     {[1, 2, 3, 4, 5, 6].map(i => (
                        <div 
                          key={i} 
                          onClick={() => setPlate(i)}
                          className={`aspect-square border cursor-pointer transition-all ${plate === i ? 'border-green-600 bg-green-600/10' : 'bg-zinc-900 border-zinc-800'}`} 
                        />
                     ))}
                  </div>
               </Section>
               <Section title="STRAP_MATERIAL">
                  <div className="flex gap-2">
                     {['#000', '#222', '#113', '#311', '#22c55e', '#ef4444', '#3b82f6'].map(c => (
                        <div 
                          key={c} 
                          onClick={() => setColor(c)}
                          className={`w-8 h-8 rounded-full border cursor-pointer transition-all ${color === c ? 'scale-125 border-white ring-2 ring-green-600' : 'border-zinc-800 hover:border-zinc-500'}`} 
                          style={{ background: c }} 
                        />
                     ))}
                  </div>
               </Section>
               <button 
                onClick={handleMint}
                className="w-full py-6 bg-green-600 text-white font-black uppercase text-[10px] tracking-[8px] hover:bg-white hover:text-green-600 transition-all shadow-2xl active:scale-95"
               >
                  MINT_CHAMPIONSHIP
               </button>
            </div>
        </div>
     </div>
  </motion.div>
)};

const ShowCreator = ({ onCancel }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex-1 flex flex-col p-12 lg:p-20"
  >
     <header className="flex justify-between items-end mb-16 border-b border-zinc-900 pb-8">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <Tv size={16} className="text-yellow-600" />
              <span className="text-[10px] font-black text-zinc-500 tracking-[8px] uppercase">PROJECT: BROADCAST_X</span>
           </div>
           <h1 className="text-7xl font-black italic tracking-tighter uppercase leading-none">SHOW <span className="text-yellow-600">PACK</span></h1>
        </div>
        <button onClick={onCancel} className="px-12 py-4 bg-zinc-900 text-zinc-500 hover:text-white font-black uppercase text-[10px] tracking-[4px] border border-zinc-800">EXIT_BUILDER</button>
     </header>

     <div className="grid grid-cols-1 xl:grid-cols-4 gap-12">
        <div className="xl:col-span-1 space-y-6">
           <Section title="BRANDING">
              <div className="space-y-4">
                 <input type="text" placeholder="SHOW_NAME" className="w-full bg-zinc-950 border border-zinc-900 p-4 text-[10px] font-black tracking-widest text-white outline-none focus:border-yellow-600" />
                 <div className="flex flex-wrap gap-2">
                    {['#ffff00', '#ff0000', '#0000ff', '#00ff00', '#ff00ff'].map(c => (
                       <div key={c} className="w-6 h-6 border border-zinc-800" style={{ background: c }} />
                    ))}
                 </div>
              </div>
           </Section>
           <Section title="ASSET_UPLOAD">
              <div className="aspect-square border-2 border-dashed border-zinc-900 flex flex-col items-center justify-center p-8 text-center text-zinc-700 hover:text-yellow-600 hover:border-yellow-600 transition-all cursor-pointer">
                 <Plus size={32} className="mb-4" />
                 <span className="text-[8px] font-black uppercase tracking-[4px]">UPLOAD_BRAND_LOGO</span>
              </div>
           </Section>
        </div>

        <div className="xl:col-span-3 bg-zinc-950 border border-zinc-900 p-12">
           <h3 className="text-2xl font-black italic text-zinc-500 uppercase tracking-tighter mb-12 flex items-center gap-4">
              <Sparkles size={24} className="text-yellow-600" />
              BROADCAST_VISUALS_PREVIEW
           </h3>
           <div className="grid grid-cols-2 gap-12">
              <div className="space-y-4">
                 <p className="text-[10px] font-black text-zinc-700 tracking-[6px] uppercase">LOWER_THIRD_A</p>
                 <div className="bg-gradient-to-r from-yellow-600/80 to-transparent p-6 border-l-4 border-yellow-600">
                    <p className="text-2xl font-black text-white italic tracking-tighter uppercase">MAIN_EVENT_MATCH</p>
                    <p className="text-[10px] text-zinc-900 font-black tracking-widest uppercase">COMING_UP_NEXT</p>
                 </div>
              </div>
              <div className="space-y-4">
                 <p className="text-[10px] font-black text-zinc-700 tracking-[6px] uppercase">TRANSITION_FX</p>
                 <div className="aspect-video bg-zinc-900 flex items-center justify-center border border-zinc-800 overflow-hidden relative">
                    <div className="absolute inset-0 bg-yellow-600 skew-x-[30deg] -translate-x-[150%] animate-[shimmer_2s_infinite]" style={{ width: '40%' }} />
                    <Tv size={48} className="text-zinc-800" />
                 </div>
              </div>
           </div>
        </div>
     </div>
  </motion.div>
);

const Section = ({ title, children }: any) => (
  <div className="space-y-4">
    <h4 className="text-[10px] font-black text-zinc-500 tracking-[4px] uppercase border-b border-zinc-900 pb-2">{title}</h4>
    {children}
  </div>
);
