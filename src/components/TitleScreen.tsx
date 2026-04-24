import React, { useEffect } from 'react';
import { motion } from 'motion/react';

interface TitleScreenProps {
  onStart: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({ onStart }) => {
  useEffect(() => {
    const handleKeyPress = () => onStart();
    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('mousedown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('mousedown', handleKeyPress);
    };
  }, [onStart]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-[#050507] flex flex-col items-center justify-center z-[900] overflow-hidden cursor-pointer"
      onClick={onStart}
    >
      {/* Cinematic Aura/Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ repeat: Infinity, duration: 8 }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.3)_0%,transparent_70%)]"
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-200 contrast-150 mix-blend-overlay" />
      </div>

      {/* Main Branding */}
      <div className="relative z-10 flex flex-col items-center">
        <motion.div
           initial={{ scale: 0.9, opacity: 0, y: 40 }}
           animate={{ scale: 1, opacity: 1, y: 0 }}
           transition={{ duration: 1, ease: "easeOut" }}
           className="text-center"
        >
          <div className="flex items-center justify-center gap-6 mb-8">
             <div className="h-px w-24 bg-red-600 shadow-[0_0_10px_red]" />
             <span className="text-[10px] sm:text-xs font-black text-white tracking-[20px] uppercase ml-[20px]">SOVEREIGN</span>
             <div className="h-px w-24 bg-red-600 shadow-[0_0_10px_red]" />
          </div>
          
          <div className="relative inline-block">
             <h1 className="text-[100px] sm:text-[160px] font-black italic tracking-tighter text-white uppercase leading-none drop-shadow-[0_0_50px_rgba(220,38,38,0.5)]">
               CORE<span className="text-red-600">STRIKE</span>
             </h1>
             <div className="absolute -top-4 -right-12 bg-red-600 text-white px-4 py-1 text-[10px] uppercase font-black transform skew-x-[-12deg] shadow-lg">
                <span className="inline-block skew-x-[12deg]">ULTRA_VISCERAL</span>
             </div>
          </div>
          
          <div className="mt-12 flex flex-col items-center gap-2">
             <p className="text-[12px] sm:text-[14px] text-zinc-500 font-bold tracking-[15px] uppercase ml-[15px]">THE_AUDIT_HAS_BEGUN</p>
             <div className="h-16 w-[1px] bg-red-600/50 mt-12 animate-bounce" />
          </div>
        </motion.div>
      </div>

      {/* Press Start Prompt */}
      <motion.div 
        animate={{ opacity: [0.2, 1, 0.2] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className="absolute bottom-24 z-10"
      >
        <span className="text-white font-black italic text-xl tracking-[12px] uppercase">
          [ PRESS ANY KEY TO START ]
        </span>
      </motion.div>

      {/* Corporate Metadata */}
      <div className="absolute bottom-12 left-12 flex flex-col gap-1 text-[8px] font-black text-zinc-800 tracking-[8px] uppercase">
         <span>LICENSED_TO: SOVEREIGN_GROUP_INTL</span>
         <span>AUTH: M HEAVEN$ENT // 2026_CORE_V2</span>
      </div>

      <div className="absolute top-12 left-12 right-12 flex justify-between items-center text-[8px] font-black text-zinc-800 tracking-[8px] uppercase">
         <div className="flex gap-12">
            <span>STABILITY: NOMINAL</span>
            <span className="text-red-900">LATENCY: 0.1ms</span>
         </div>
         <span>BUILD_2558_4B</span>
      </div>
    </motion.div>
  );
};
