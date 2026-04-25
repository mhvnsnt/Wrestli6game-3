import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface IntroSequenceProps {
  onComplete: () => void;
}

export const IntroSequence: React.FC<IntroSequenceProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'credits' | 'movie'>('credits');
  const [canSkip, setCanSkip] = useState(false);

  useEffect(() => {
    // Grace period to prevent accidental skips from previous screens
    const t = setTimeout(() => setCanSkip(true), 1000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const handleInput = (e: any) => {
      if (!canSkip) return;
      e.preventDefault();
      e.stopPropagation();
      onComplete();
    };

    window.addEventListener('keydown', handleInput);
    window.addEventListener('pointerdown', handleInput);

    const timer = setTimeout(() => {
      if (phase === 'credits') {
        setPhase('movie');
      } else {
        onComplete();
      }
    }, phase === 'credits' ? 4000 : 12000);

    return () => {
      window.removeEventListener('keydown', handleInput);
      window.removeEventListener('pointerdown', handleInput);
      clearTimeout(timer);
    };
  }, [phase, onComplete, canSkip]);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden z-[1000] cursor-none">
      <AnimatePresence mode="wait">
        {phase === 'credits' && (
          <motion.div
            key="credits"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="text-center"
          >
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ delay: 0.5 }}
              className="text-white tracking-[12px] text-[8px] uppercase mb-4"
            >
              The Sovereign Group Presents
            </motion.p>
            <h1 className="text-5xl font-black text-white tracking-tighter italic flex items-center gap-4">
              M HEAVEN$ENT <span className="text-red-600 bg-red-600/10 px-4">STUDIOS</span>
            </h1>
            <div className="h-px w-full bg-gradient-to-r from-transparent via-red-600 to-transparent mt-4 opacity-50" />
            <p className="text-zinc-600 text-[10px] mt-6 uppercase tracking-[8px] font-bold">CORE_UNLOCKED // SYSTEM_ACTIVE</p>
          </motion.div>
        )}

        {phase === 'movie' && (
          <motion.div
            key="movie"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative w-full h-full flex items-center justify-center bg-black"
          >
            {/* Extended Cinematic Movie */}
            <div className="absolute inset-0 z-0">
               <div className="absolute inset-0 bg-red-950/10 mix-blend-overlay" />
               <motion.div 
                 animate={{ opacity: [0.1, 0.3, 0.1] }}
                 transition={{ repeat: Infinity, duration: 4 }}
                 className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.1)_0%,transparent_100%)]" 
               />
            </div>

            <div className="relative z-10 w-full max-w-5xl flex flex-col items-center">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 w-full p-12">
                    {[
                      { t: 'AUDIT', c: 'text-zinc-500', d: 0 },
                      { t: 'PURGE', c: 'text-red-600', d: 0.2 },
                      { t: 'CONTROL', c: 'text-zinc-500', d: 0.4 },
                      { t: 'SOVEREIGN', c: 'text-red-900', d: 0.6 },
                      { t: 'BREACH', c: 'text-white', d: 0.8 },
                      { t: 'BATTLE', c: 'text-zinc-700', d: 1.0 },
                      { t: 'DESTINY', c: 'text-red-500', d: 1.2 },
                      { t: 'CORE', c: 'text-white shadow-[0_0_20px_white]', d: 1.5 }
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 1.5, rotateY: 90 }}
                        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                        transition={{ delay: item.d, duration: 0.8 }}
                        className="h-40 lg:h-56 border border-zinc-900 bg-zinc-950/50 flex items-center justify-center relative overflow-hidden"
                      >
                         <motion.div 
                           animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
                           transition={{ repeat: Infinity, duration: 2 }}
                           className="absolute inset-0 bg-red-600/5" 
                         />
                         <span className={`text-2xl lg:text-3xl font-black italic tracking-tighter z-10 ${item.c}`}>{item.t}</span>
                      </motion.div>
                    ))}
                </div>

                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 10, ease: "linear" }}
                  className="h-[2px] bg-red-600 shadow-[0_0_10px_red] w-full max-w-xl mt-8"
                />
            </div>

            <div className="absolute bottom-12 text-white/20 text-[10px] font-black tracking-[10px] uppercase animate-pulse">
                Breaching_The_Core...
            </div>
            
            <div className="absolute bottom-12 right-12 text-zinc-800 text-[10px] font-bold">
                PRESS_ANY_KEY_TO_BYPASS
            </div>

            {/* Scanning Lines */}
            <div className="absolute inset-0 pointer-events-none opacity-5" style={{ background: 'repeating-linear-gradient(0deg, #fff, #fff 1px, transparent 1px, transparent 3px)' }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
