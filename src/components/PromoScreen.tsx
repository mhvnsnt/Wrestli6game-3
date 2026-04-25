import React, { useEffect } from 'react';
import { motion } from 'motion/react';

interface PromoScreenProps {
  char1: { name: string; sigil: string };
  char2?: { name: string; sigil: string };
  text: string;
  onComplete: () => void;
  isPaused: boolean;
}

export const PromoScreen: React.FC<PromoScreenProps> = ({ char1, char2, text, onComplete, isPaused }) => {
  useEffect(() => {
    if (isPaused) return;
    const skip = (e: any) => {
        // Only skip if not a menu key
        if (e.key === 'p' || e.key === 'Escape') return;
        onComplete();
    };
    window.addEventListener('keydown', skip);
    window.addEventListener('pointerdown', skip);
    return () => {
      window.removeEventListener('keydown', skip);
      window.removeEventListener('pointerdown', skip);
    };
  }, [onComplete, isPaused]);

  return (
    <div className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center z-[1500] p-12">
      <div className="flex w-full max-w-6xl justify-between items-end mb-12">
        <motion.div 
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex flex-col items-start"
        >
            <div className="w-48 h-72 bg-zinc-800 border-l-8 border-red-600 mb-4 overflow-hidden relative">
                 <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                 <div className="absolute bottom-4 left-4 text-3xl font-black italic text-white uppercase leading-none">
                     {char1.name.split(' ').map((n, i) => <span key={i} className="block">{n}</span>)}
                 </div>
            </div>
        </motion.div>

        {char2 && (
            <motion.div 
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="flex flex-col items-end"
            >
                <div className="w-48 h-72 bg-zinc-800 border-r-8 border-cyan-600 mb-4 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                    <div className="absolute bottom-4 right-4 text-right text-3xl font-black italic text-white uppercase leading-none">
                        {char2.name.split(' ').map((n, i) => <span key={i} className="block">{n}</span>)}
                    </div>
                </div>
            </motion.div>
        )}
      </div>

      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="w-full max-w-4xl bg-white p-8 relative"
      >
          <div className="absolute -top-6 left-12 bg-red-600 text-white px-6 py-2 font-black italic uppercase tracking-widest">
              Live Promo
          </div>
          <p className="text-zinc-900 text-3xl font-serif italic leading-snug">
              "{text}"
          </p>
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        onClick={onComplete}
        className="mt-12 text-zinc-500 uppercase tracking-widest text-xs hover:text-white transition-colors"
      >
        Press Enter to Continue / Skip Promo
      </motion.button>
    </div>
  );
};
