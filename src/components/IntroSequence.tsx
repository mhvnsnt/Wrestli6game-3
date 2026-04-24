import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface IntroSequenceProps {
  onComplete: () => void;
}

export const IntroSequence: React.FC<IntroSequenceProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'credits' | 'movie'>('credits');

  useEffect(() => {
    const handleKeyPress = () => onComplete();
    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('mousedown', handleKeyPress);

    const timer = setTimeout(() => {
      if (phase === 'credits') {
        setPhase('movie');
      } else {
        onComplete();
      }
    }, phase === 'credits' ? 3000 : 8000);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('mousedown', handleKeyPress);
      clearTimeout(timer);
    };
  }, [phase, onComplete]);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden z-[1000]">
      <AnimatePresence mode="wait">
        {phase === 'credits' && (
          <motion.div
            key="credits"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="text-center"
          >
            <h2 className="text-gray-500 tracking-widest text-sm uppercase mb-2">Developed by</h2>
            <h1 className="text-5xl font-bold text-white tracking-tighter italic">
              M HEAVEN$ENT <span className="text-red-600">STUDIOS</span>
            </h1>
            <p className="text-gray-600 text-xs mt-4 uppercase">CORE UNLOCKED ENGINE v2.0</p>
          </motion.div>
        )}

        {phase === 'movie' && (
          <motion.div
            key="movie"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative w-full h-full flex items-center justify-center bg-zinc-900"
          >
            {/* Concept: AI Generated Kinetic Typography and Action Frames */}
            <div className="relative w-full h-full max-w-4xl flex items-center justify-center">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="absolute inset-0 flex flex-col items-center justify-center p-8"
                >
                    <div className="grid grid-cols-2 gap-4 w-full">
                        <motion.div 
                            animate={{ scale: [1, 1.05, 1] }} 
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="h-48 bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-600 text-4xl italic font-black"
                        >
                            POWER
                        </motion.div>
                        <motion.div 
                             animate={{ scale: [1, 1.05, 1] }} 
                             transition={{ repeat: Infinity, duration: 2.1 }}
                            className="h-48 bg-zinc-800 rounded-lg flex items-center justify-center text-red-900 text-4xl italic font-black"
                        >
                            PAIN
                        </motion.div>
                        <motion.div 
                             animate={{ scale: [1, 1.05, 1] }} 
                             transition={{ repeat: Infinity, duration: 1.9 }}
                            className="h-48 bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-600 text-4xl italic font-black"
                        >
                            GLORY
                        </motion.div>
                        <motion.div 
                             animate={{ scale: [1, 1.05, 1] }} 
                             transition={{ repeat: Infinity, duration: 2.2 }}
                            className="h-48 bg-zinc-800 rounded-lg flex items-center justify-center text-red-900 text-4xl italic font-black"
                        >
                            CORE
                        </motion.div>
                    </div>
                </motion.div>
                
                <div className="absolute bottom-12 right-12 text-white/50 text-xs italic tracking-widest">
                    SKIP: [ANY KEY]
                </div>
            </div>

            {/* Cinematic Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] pointer-events-none" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
