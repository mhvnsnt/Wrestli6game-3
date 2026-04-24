import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface LoadingScreenProps {
  isVisible: boolean;
  onFinished?: () => void;
  gameTip?: string;
}

const TIPS = [
    "Aim for the head with the sledgehammer to maximize stun probability.",
    "Ropes have dynamic physics. Use them to rebound and gain momentum.",
    "Concrete floors deal significantly more damage than the padded mat.",
    "Steel steps are heavy. They slow you down but deal devastating impact.",
    "Gravity increases damage. High-flying moves are high-risk, high-reward.",
    "Watch the stamina meter. Exhausted fighters take more damage."
];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ isVisible, onFinished, gameTip }) => {
  const [tip] = useState(() => gameTip || TIPS[Math.floor(Math.random() * TIPS.length)]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isVisible) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            clearInterval(interval);
            setTimeout(() => onFinished?.(), 500);
            return 100;
          }
          return p + Math.random() * 20;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isVisible, onFinished]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-[#050507] flex flex-col items-center justify-center z-[2000] overflow-hidden"
        >
          {/* Background Alchemical Sigils/Grid */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.15)_0%,transparent_70%)]" />
             <div className="w-full h-full" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
          </div>

          <div className="w-full max-w-2xl px-12 relative z-10">
            <div className="flex justify-between items-end mb-4">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                >
                  <div className="text-[10px] font-black text-red-600 tracking-[10px] uppercase mb-1">CORE_CALIBRATION</div>
                  <h3 className="text-white font-black italic text-5xl tracking-tighter uppercase leading-none">SYNTHESIZING...</h3>
                </motion.div>
                <div className="text-right">
                   <div className="text-[10px] font-mono text-zinc-600 mb-1">{Math.floor(progress)}% COMPLETE</div>
                   <div className="text-white font-black italic text-xl tracking-tighter">PHASE_0x77</div>
                </div>
            </div>

            <div className="h-2 bg-zinc-900 w-full relative overflow-hidden border border-zinc-800">
              <motion.div 
                 className="absolute inset-y-0 left-0 bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.5)]"
                 animate={{ width: `${progress}%` }}
                 transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
              />
            </div>

            <div className="mt-16 flex gap-12 border-t border-zinc-900 pt-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <div className="flex-none">
                 <div className="w-16 h-16 border border-red-600/30 flex items-center justify-center -skew-x-12">
                    <div className="text-red-600 animate-pulse text-2xl font-black italic skew-x-12">!</div>
                 </div>
              </div>
              <div className="flex-1">
                <span className="text-zinc-600 uppercase text-[9px] font-black tracking-[5px] block mb-3">Sovereign_Intelligence_Feed</span>
                <p className="text-zinc-300 text-lg font-medium leading-relaxed italic border-l-2 border-red-600 pl-6 py-1">
                  "{tip}"
                </p>
              </div>
            </div>
          </div>

          {/* Footer Decor */}
          <div className="absolute bottom-12 left-12 right-12 flex justify-between items-center text-[8px] font-black text-zinc-800 tracking-[8px] uppercase">
             <span>AUDIT_STABILITY: MAX</span>
             <div className="flex gap-8">
                <span className="animate-pulse">PARSING_ROSTER...</span>
                <span className="animate-pulse">LOADING_ARENA_GEOMETRY...</span>
             </div>
             <span>2026 // CORE_SYNC</span>
          </div>

          {/* Corner Decors */}
          <div className="absolute top-10 left-10 w-20 h-20 border-t-2 border-l-2 border-zinc-900" />
          <div className="absolute bottom-10 right-10 w-20 h-20 border-b-2 border-r-2 border-zinc-900" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
