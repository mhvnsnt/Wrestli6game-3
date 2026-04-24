import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CharacterData } from '../types';

interface CutsceneProps {
  type: 'rivalry' | 'team' | 'backstage_brawl' | 'interruption' | 'promo';
  char1: CharacterData;
  char2: CharacterData;
  onComplete: () => void;
}

export const Cutscene: React.FC<CutsceneProps> = ({ type, char1, char2, onComplete }) => {
  const [phase, setPhase] = useState(0);
  
  const scenarios = {
    rivalry: [
      { text: `${char1.name} stares down ${char2.name} from the top of the ramp.`, duration: 3000 },
      { text: "The tension is palpable. The Sovereign Audit has identified a major conflict.", duration: 3000 },
      { text: "Security is struggling to keep them apart!", duration: 2000 }
    ],
    team: [
      { text: `${char1.name} and ${char2.name} have formed a strategic alliance.`, duration: 3000 },
      { text: "A new faction emerges in the Core.", duration: 3000 }
    ],
    backstage_brawl: [
      { text: "CCTV Footages: BACKSTAGE SECTOR 7", duration: 2000 },
      { text: `${char1.name} ambushes ${char2.name} near the production truck!`, duration: 3000 },
      { text: "Officials are rushing to the scene!", duration: 2000 }
    ],
    interruption: [
      { text: "Lights go out...", duration: 2000 },
      { text: `${char1.name} has entered the arena unexpectedly!`, duration: 3000 },
      { text: `Target acquired: ${char2.name}.`, duration: 2000 }
    ],
    promo: [
      { text: `${char1.name} takes the microphone.`, duration: 2000 },
      { text: `"I am the Architect of your downfall. Your contract is being audited."`, duration: 3000 }
    ]
  };

  const currentScenario = scenarios[type] || scenarios.promo;

  useEffect(() => {
    const skip = () => onComplete();
    window.addEventListener('keydown', skip);
    window.addEventListener('mousedown', skip);

    const timer = setTimeout(() => {
      if (phase < currentScenario.length - 1) {
        setPhase(prev => prev + 1);
      } else {
        onComplete();
      }
    }, currentScenario[phase].duration);

    return () => {
      window.removeEventListener('keydown', skip);
      window.removeEventListener('mousedown', skip);
      clearTimeout(timer);
    };
  }, [phase, type, onComplete]);

  return (
    <div className="fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center p-12 overflow-hidden">
      {/* Cinematic Bars */}
      <div className="absolute top-0 inset-x-0 h-24 bg-black z-10" />
      <div className="absolute bottom-0 inset-x-0 h-24 bg-black z-10" />

      <AnimatePresence mode="wait">
        <motion.div
          key={`${type}-${phase}`}
          initial={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
          className="relative z-20 text-center max-w-4xl"
        >
          <div className="text-red-600 font-black text-[10px] tracking-[10px] uppercase mb-4 animate-pulse">
            CINEMATIC_EVENT: {type.toUpperCase()}
          </div>
          
          <h2 className="text-white text-3xl lg:text-5xl font-black italic uppercase tracking-tighter leading-tight drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
            {currentScenario[phase].text}
          </h2>

          <div className="mt-12 flex items-center justify-center gap-12">
             <div className="flex flex-col items-center gap-4">
                <div className="w-24 h-24 rounded-full border-2 border-zinc-800 p-1">
                   <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${char1.name}`} alt="" className="w-full h-full rounded-full" />
                </div>
                <span className="text-zinc-500 font-bold text-[10px] tracking-widest">{char1.name}</span>
             </div>
             <div className="text-red-600 font-black italic">VS</div>
             <div className="flex flex-col items-center gap-4">
                <div className="w-24 h-24 rounded-full border-2 border-zinc-800 p-1">
                   <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${char2.name}`} alt="" className="w-full h-full rounded-full" />
                </div>
                <span className="text-zinc-500 font-bold text-[10px] tracking-widest">{char2.name}</span>
             </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-32 text-zinc-800 text-[8px] font-black tracking-[10px] uppercase">
         CORE_SYNC_IN_PROGRESS // SKIP:[ANY]
      </div>
    </div>
  );
};
