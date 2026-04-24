import React from 'react';
import { motion } from 'motion/react';

interface TouchUIProps {
  onInput: (key: string, active: boolean) => void;
}

export const TouchUI: React.FC<TouchUIProps> = ({ onInput }) => {
  const Button = ({ label, k, color }: { label: string; k: string; color: string }) => (
    <motion.button
      whileTap={{ scale: 0.8 }}
      onPointerDown={() => onInput(k, true)}
      onPointerUp={() => onInput(k, false)}
      onPointerLeave={() => onInput(k, false)}
      className={`w-16 h-16 rounded-full border-2 ${color} flex items-center justify-center text-[10px] font-black uppercase tracking-tighter backdrop-blur-md bg-white/5 active:bg-white/20 touch-none`}
    >
      {label}
    </motion.button>
  );

  return (
    <div className="absolute inset-0 z-[100] pointer-events-none select-none">
      {/* Joystick / D-PAD Area */}
      <div className="absolute bottom-12 left-12 grid grid-cols-3 gap-2 pointer-events-auto">
        <div />
        <Button label="UP" k="w" color="border-zinc-500" />
        <div />
        <Button label="LT" k="a" color="border-zinc-500" />
        <div />
        <Button label="RT" k="d" color="border-zinc-500" />
        <div />
        <Button label="DN" k="s" color="border-zinc-500" />
        <div />
      </div>

      {/* Action Buttons */}
      <div className="absolute bottom-12 right-12 flex flex-col gap-4 items-end pointer-events-auto">
        <div className="flex gap-4">
           <Button label="GRB" k="l" color="border-cyan-500" />
           <Button label="HVY" k="k" color="border-orange-500" />
        </div>
        <div className="flex gap-4 mr-12">
           <Button label="REV" k="v" color="border-green-500" />
           <Button label="LIT" k="j" color="border-red-500" />
        </div>
      </div>

      {/* Helper text */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[8px] tracking-[4px] text-zinc-600 font-black uppercase">
        VIRTUAL COMMAND INTERFACE // ACTIVE
      </div>
    </div>
  );
};
