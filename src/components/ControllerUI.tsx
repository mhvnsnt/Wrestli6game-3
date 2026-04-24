/**
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Gamepad2, 
  Circle, 
  Square, 
  Triangle, 
  X, 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight,
  Zap,
  Shield,
  Crosshair,
  User
} from 'lucide-react';

interface ControllerUIProps {
  onInput: (key: string, active: boolean) => void;
  isVisible: boolean;
}

export const ControllerUI: React.FC<ControllerUIProps> = ({ onInput, isVisible }) => {
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());
  const [isInactive, setIsInactive] = useState(false);

  useEffect(() => {
    if (!isVisible) return;
    
    const timer = setTimeout(() => {
      if (activeKeys.size === 0) setIsInactive(true);
    }, 4000); // 4 seconds of inactivity

    return () => clearTimeout(timer);
  }, [isVisible, activeKeys]);

  const handlePress = useCallback((key: string) => {
    setIsInactive(false);
    setActiveKeys(prev => {
      const next = new Set(prev);
      next.add(key);
      return next;
    });
    onInput(key, true);
  }, [onInput]);

  const handleRelease = useCallback((key: string) => {
    setIsInactive(false);
    setActiveKeys(prev => {
      const next = new Set(prev);
      next.delete(key);
      return next;
    });
    onInput(key, false);
  }, [onInput]);

  const Button = ({ btnKey, icon: Icon, color, size = 'large' }: any) => {
    const isActive = activeKeys.has(btnKey);
    return (
      <div
        onPointerDown={(e) => { e.preventDefault(); handlePress(btnKey); }}
        onPointerUp={(e) => { e.preventDefault(); handleRelease(btnKey); }}
        onPointerLeave={(e) => { e.preventDefault(); if (activeKeys.has(btnKey)) handleRelease(btnKey); }}
        className={`
          select-none flex items-center justify-center rounded-full border-2 transition-all active:scale-90 touch-none
          ${size === 'large' ? 'w-16 h-16' : 'w-12 h-12'}
          ${isActive 
            ? `bg-${color}-500 border-white scale-95 shadow-[0_0_20px_rgba(255,255,255,0.5)]` 
            : `bg-black/40 border-${color}-500/50 text-${color}-400 shadow-lg`}
        `}
      >
        <Icon size={size === 'large' ? 28 : 20} />
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isInactive ? 0.15 : 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 pointer-events-none flex flex-col justify-end p-6 md:p-12 z-[200] overflow-hidden"
        >
          <div className="w-full flex justify-between items-end">
            {/* D-PAD (Left Side) */}
            <div className="pointer-events-auto flex flex-col items-center gap-2">
              <Button btnKey="w" icon={ArrowUp} color="zinc" />
              <div className="flex gap-2">
                <Button btnKey="a" icon={ArrowLeft} color="zinc" />
                <div className="w-16 h-16 flex items-center justify-center opacity-20">
                   <Gamepad2 size={32} />
                </div>
                <Button btnKey="d" icon={ArrowRight} color="zinc" />
              </div>
              <Button btnKey="s" icon={ArrowDown} color="zinc" />
            </div>

            {/* Special / Options (Center) */}
            <div className="pointer-events-auto flex gap-4 mb-4">
               <Button btnKey="i" icon={User} color="purple" size="small" /> {/* Taunt */}
               <Button btnKey="v" icon={Shield} color="orange" size="small" /> {/* Reverse */}
               <Button btnKey="space" icon={Zap} color="yellow" size="small" /> {/* Run */}
            </div>

            {/* Face Buttons (Right Side) */}
            <div className="pointer-events-auto flex flex-col items-center gap-2">
              <Button btnKey="u" icon={Triangle} color="green" /> {/* Ultra */}
              <div className="flex gap-2">
                <Button btnKey="j" icon={Square} color="blue" /> {/* Light */}
                <div className="w-16 h-16 flex items-center justify-center opacity-20">
                   <Crosshair size={32} />
                </div>
                <Button btnKey="k" icon={Circle} color="red" /> {/* Heavy */}
              </div>
              <Button btnKey="l" icon={Zap} color="zinc" /> {/* Special/Grapple */}
            </div>
          </div>
          
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[10px] text-zinc-600 uppercase tracking-widest opacity-50 bg-black/80 px-3 py-1 rounded-full border border-white/5">
             Sovereign Engine v2.0 // Neural Interface Active
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
