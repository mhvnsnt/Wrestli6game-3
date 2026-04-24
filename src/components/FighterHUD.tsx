import React from 'react';
import { motion } from 'motion/react';
import { BodyDamage } from '../types';

interface FighterHUDProps {
  side: 'left' | 'right';
  hp: number;
  energy: number;
  sigMeter: number;
  finMeter: number;
  sigStocks: number;
  finStocks: number;
  combo: number;
  data: any;
  bodyDamage: BodyDamage;
}

export const FighterHUD: React.FC<FighterHUDProps> = ({ side, hp, energy, sigMeter, finMeter, sigStocks, finStocks, combo, data, bodyDamage }) => {
  const isLeft = side === 'left';
  
  const getSigColor = (val: number) => {
    return '#48f'; // Cyan-Blue for Signature
  };

  const getFinColor = (val: number) => {
    return '#f24'; // Red for Finisher
  };

  const getDamageColor = (val: number) => {
    if (val > 80) return '#f24';
    if (val > 50) return '#f80';
    if (val > 20) return '#fb0';
    return '#444';
  };

  return (
    <div className={`fixed top-6 ${isLeft ? 'left-6' : 'right-6'} w-80 flex flex-col ${isLeft ? 'items-start' : 'items-end'} font-sans`}>
      {/* Name and Archetype */}
      <div className={`flex flex-col ${isLeft ? 'items-start' : 'items-end'} mb-2`}>
        <div className="flex items-center gap-2">
           {isLeft && <div className="w-1 h-4 bg-red-600 animate-pulse" />}
           <div className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none shadow-black drop-shadow-md">
             {data.name}
           </div>
           {!isLeft && <div className="w-1 h-4 bg-cyan-600 animate-pulse" />}
        </div>
        <div className="text-[10px] font-bold text-white/50 tracking-[0.2em] uppercase flex items-center gap-2">
          <span>{data.archetype}</span>
          <span className="text-zinc-800">//</span>
          <span className="text-red-900/50">STABILITY_{Math.ceil(hp * 0.9 + 10)}%</span>
        </div>
      </div>

      {/* HP Bar */}
      <div className="w-full h-4 bg-black/60 border border-white/20 relative overflow-hidden mb-1">
        <motion.div 
          initial={{ width: '100%' }}
          animate={{ width: `${hp}%` }}
          className="h-full bg-gradient-to-r from-red-600 to-red-400"
        />
        {/* HP Percentage */}
        <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white mix-blend-difference italic">
            {Math.ceil(hp)} / 100
        </div>
      </div>

      {/* Energy Bar */}
      <div className="w-3/4 h-1.5 bg-black/40 border border-white/10 relative overflow-hidden mb-3">
        <motion.div 
          initial={{ width: '60%' }}
          animate={{ width: `${energy}%` }}
          className="h-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]"
        />
      </div>

      {/* MOMENTUM SYSTEMS */}
      <div className={`flex flex-col gap-1 w-full ${isLeft ? 'items-start' : 'items-end'} mb-4`}>
          {/* Signature Bar (Blue) */}
          <div className="flex items-center gap-2">
            <div className={`flex gap-0.5 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
                {[...Array(6)].map((_, i) => (
                    <div key={i} className={`w-3 h-3 rounded-sm border border-white/10 ${i < sigStocks ? 'bg-blue-500 shadow-[0_0_8px_blue]' : 'bg-black/40'}`} />
                ))}
            </div>
            <div className="w-24 h-2 bg-black/40 rounded-full overflow-hidden border border-white/10">
                <motion.div 
                    animate={{ width: `${sigMeter}%` }}
                    className="h-full bg-blue-500 shadow-[0_0_10px_#3b82f6]"
                />
            </div>
            <div className="text-[9px] font-black text-blue-400 italic uppercase">SIG</div>
          </div>

          {/* Finisher Bar (Red) */}
          <div className="flex items-center gap-2">
            <div className={`flex gap-0.5 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
                {[...Array(6)].map((_, i) => (
                    <div key={i} className={`w-3 h-3 rounded-full border border-white/10 ${i < finStocks ? 'bg-red-500 shadow-[0_0_8px_red]' : 'bg-black/40'}`} />
                ))}
            </div>
            <div className="w-24 h-2 bg-black/40 rounded-full overflow-hidden border border-white/10">
                <motion.div 
                    animate={{ width: `${finMeter}%` }}
                    className="h-full bg-red-500 shadow-[0_0_10px_#ef4444]"
                />
            </div>
            <div className="text-[9px] font-black text-red-400 italic uppercase">FIN</div>
          </div>
      </div>

      {/* Combo Counter (Tekken Style) */}
      {combo > 1 && (
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1.2, opacity: 1 }}
          key={combo}
          className="text-4xl font-black italic text-yellow-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mb-4"
        >
          {combo} <span className="text-xl">HITS</span>
        </motion.div>
      )}

      {/* Body Part Damage (SmackDown Style) */}
      <div className={`grid grid-cols-2 gap-2 opacity-80 ${isLeft ? 'text-left' : 'text-right'}`}>
        <div className="flex flex-col gap-1">
            <DamageNode label="HEAD" color={getDamageColor(bodyDamage.head)} />
            <DamageNode label="BODY" color={getDamageColor(bodyDamage.body)} />
        </div>
        <div className="flex flex-col gap-1">
            <DamageNode label="ARMS" color={getDamageColor(bodyDamage.arms)} />
            <DamageNode label="LEGS" color={getDamageColor(bodyDamage.legs)} />
        </div>
      </div>
    </div>
  );
};

const DamageNode = ({ label, color }: { label: string, color: string }) => (
    <div className="flex items-center gap-1.5">
        <div className="w-2 h-2 rounded-full shadow-inner" style={{ backgroundColor: color }} />
        <span className="text-[9px] font-bold text-white/40 tracking-wider italic">{label}</span>
    </div>
);
