/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { WinScreen } from './components/UIOverlay';
import { Customizer } from './components/Customizer';
import { GameCanvas } from './components/GameCanvas';
import { SelectionScreen } from './components/SelectionScreen';
import { FighterHUD } from './components/FighterHUD';
import { MainMenu } from './components/MainMenu';
import { MatchReport } from './components/MatchReport';
import { TournamentMode } from './components/TournamentMode';
import { GameModes } from './components/GameModes';
import { CharacterData, GameState, GameOptions, getDefaultCharData } from './types';
import { ControllerUI } from './components/ControllerUI';
import { ROSTER } from './data/roster';
import { motion, AnimatePresence } from 'motion/react';
import { UserCog, Play, Gamepad2 } from 'lucide-react';

import { ArenaSelection, ARENAS } from './components/ArenaSelection';
import { CreationSuite } from './components/CreationSuite';
import { IntroSequence } from './components/IntroSequence';
import { TitleScreen } from './components/TitleScreen';
import { LoadingScreen } from './components/LoadingScreen';
import { PromoScreen } from './components/PromoScreen';
import { Cutscene } from './components/Cutscene';

export default function App() {
  const [superstars, setSuperstars] = useState<CharacterData[]>(ROSTER);
  const [uiVisible, setUiVisible] = useState(true);
  const [controllerEnabled, setControllerEnabled] = useState(true);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [selectedCustomIndex, setSelectedCustomIndex] = useState<number | null>(null);

  const [gameOptions, setGameOptions] = useState<GameOptions>({
    difficulty: 'normal',
    aiSliders: {
      aggression: 50,
      reversalRate: 35,
      strikePower: 50,
      grapplePower: 50
    },
    bloodEnabled: true,
    entrancesEnabled: true,
    replaysEnabled: true,
    interference: 'low'
  });

  const [fightState, setFightState] = useState<GameState>({
    p1: superstars[0],
    p2: superstars[1],
    p1CPU: false,
    p2CPU: true,
    championship: undefined,
    arena: ARENAS[0],
    p1Damage: { head: 0, body: 0, arms: 0, legs: 0 },
    p2Damage: { head: 0, body: 0, arms: 0, legs: 0 },
    pinProgress: 0,
    subProgress: 0,
    matchMode: 'exhibition',
    matchPhase: 'intro',
    matchType: 'one_on_one',
    currentScreen: 'intro',
    isGameOver: false,
    winnerName: null,
    timer: 99,
    stats: {
      p1: { strikes: 0, momentum: 0, hp: 100 },
      p2: { strikes: 0, momentum: 0, hp: 100 }
    }
  });

  const [promoText, setPromoText] = useState<string | null>(null);
  const [activeCutscene, setActiveCutscene] = useState<{ type: any; char1: any; char2: any } | null>(null);
  const [activeMode, setActiveMode] = useState<'exhibition' | 'career' | 'gm' | 'universe' | 'faction' | 'tournament' | null>(null);

  const navigateWithLoading = (screen: 'intro' | 'title' | 'menu' | 'selection' | 'arena' | 'loading' | 'fight' | 'creation_suite' | 'tournament' | 'career' | 'gm' | 'universe' | 'faction' | 'match_selection' | 'cutscene' | 'promo', delay: number = 1500) => {
      setFightState(prev => ({ ...prev, currentScreen: 'loading' }));
      setTimeout(() => {
          setFightState(prev => ({ ...prev, currentScreen: screen }));
      }, delay);
  };

  const [hudState, setHudState] = useState({
    p1: { hp: 100, energy: 60, sigMeter: 0, finMeter: 0, sigStocks: 0, finStocks: 0, data: superstars[0], combo: 0, bodyDamage: {head:0,body:0,arms:0,legs:0} },
    p2: { hp: 100, energy: 60, sigMeter: 0, finMeter: 0, sigStocks: 0, finStocks: 0, data: superstars[1], combo: 0, bodyDamage: {head:0,body:0,arms:0,legs:0} },
  });

  useEffect(() => {
    const handleActivity = () => {
      setLastActivity(Date.now());
      setUiVisible(true);
    };
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('touchstart', handleActivity);
    window.addEventListener('keydown', handleActivity);
    
    const interval = setInterval(() => {
      if (Date.now() - lastActivity > 4000) {
        setUiVisible(false);
      }
    }, 1000);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      clearInterval(interval);
    };
  }, [lastActivity]);

  useEffect(() => {
    let interval: number | undefined;
    if (fightState.currentScreen === 'fight' && fightState.matchPhase === 'fight' && !fightState.isGameOver && fightState.timer > 0) {
      interval = window.setInterval(() => {
        setFightState(prev => ({ ...prev, timer: Math.max(0, prev.timer - 1) }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [fightState.currentScreen, fightState.matchPhase, fightState.isGameOver, fightState.timer]);

  const handleUpdate = useCallback((p1: any, p2: any) => {
    setHudState({ p1, p2 });
  }, []);

  const handleGameOver = (winnerName: string | null) => {
    import('./engine/audio').then(m => {
        m.sounds.playCrowdReaction('cheer');
        const winner = superstars.find(s => s.name === winnerName);
        if (winner?.entrance?.music) m.sounds.playTheme(winner.entrance.music);
    });
    setFightState(prev => ({
      ...prev,
      isGameOver: true,
      matchPhase: 'victory',
      winnerName: winnerName || (hudState.p1.hp > hudState.p2.hp ? prev.p1.name : prev.p2.name),
      stats: {
        p1: { strikes: Math.floor(Math.random() * 50) + 10, momentum: Math.round(hudState.p1.sigMeter), hp: Math.round(hudState.p1.hp) },
        p2: { strikes: Math.floor(Math.random() * 50) + 10, momentum: Math.round(hudState.p2.sigMeter), hp: Math.round(hudState.p2.hp) }
      }
    }));
  };

  const startMatch = (p1: CharacterData, p1CPU: boolean, p2: CharacterData, p2CPU: boolean, championship?: string) => {
    setFightState(prev => ({ ...prev, currentScreen: 'loading', p1, p2, p1CPU, p2CPU, championship }));
    
    setTimeout(() => {
        import('./engine/audio').then(m => {
            m.sounds.stopSoundtrack();
            m.sounds.startSoundtrack();
            m.sounds.playImpact('ring_bell');
        });

        // Chance for pre-match events
        const roll = Math.random();
        if (roll > 0.85) {
            // Cutscene
            const cutsceneTypes: ('rivalry' | 'team' | 'backstage_brawl' | 'interruption' | 'promo')[] = ['rivalry', 'backstage_brawl', 'interruption', 'promo'];
            setActiveCutscene({
                type: cutsceneTypes[Math.floor(Math.random() * cutsceneTypes.length)],
                char1: p1,
                char2: p2
            });
            setFightState(prev => ({ ...prev, currentScreen: 'cutscene' }));
        } else if (roll > 0.7) {
            // Promo
             const promos = [
                 "The audit begins now. You are formatted for deletion.",
                 "I didn't come here to compete, I came here to clear your debt.",
                 "The 8th house has no mercy for those who lack discipline.",
                 "You are nothing but a bug in the Sovereign system.",
                 "Your soul is collateral for a loan you never signed for.",
                 "Welcome to the Core. Where your ego meets its end."
             ];
             setPromoText(promos[Math.floor(Math.random() * promos.length)]);
             setFightState(prev => ({ ...prev, currentScreen: 'promo', matchPhase: 'entrance' }));
        } else {
             setFightState(prev => ({
               ...prev,
               currentScreen: 'fight',
               matchPhase: 'entrance',
               timer: 99,
               isGameOver: false,
               winnerName: null
             }));
             if (p1.entrance?.music) import('./engine/audio').then(m => m.sounds.playTheme(p1.entrance!.music));
        }
    }, 2000);
  };

  const handleTouchInput = (key: string, active: boolean) => {
    const type = active ? 'keydown' : 'keyup';
    window.dispatchEvent(new KeyboardEvent(type, { key }));
  };

  return (
    <div className="w-full h-screen bg-[#0a0a0c] text-white font-['Share_Tech_Mono'] overflow-hidden flex flex-col items-center justify-center relative landscape-container">
      <AnimatePresence mode="wait">
        {fightState.currentScreen === 'intro' && (
            <IntroSequence onComplete={() => setFightState(prev => ({ ...prev, currentScreen: 'title' }))} />
        )}

        {fightState.currentScreen === 'title' && (
            <TitleScreen onStart={() => setFightState(prev => ({ ...prev, currentScreen: 'menu' }))} />
        )}

        {fightState.currentScreen === 'loading' && (
            <LoadingScreen isVisible={true} />
        )}

        {fightState.currentScreen === 'promo' && (
            <PromoScreen 
               char1={fightState.p1}
               char2={fightState.p2}
               text={promoText || "The audit is imminent."}
               onComplete={() => {
                   setFightState(prev => ({ ...prev, currentScreen: 'fight', matchPhase: 'entrance' }));
                   if (fightState.p1.entrance?.music) import('./engine/audio').then(m => m.sounds.playTheme(fightState.p1.entrance!.music));
               }}
            />
        )}

        {fightState.currentScreen === 'cutscene' && activeCutscene && (
            <Cutscene 
              type={activeCutscene.type}
              char1={activeCutscene.char1}
              char2={activeCutscene.char2}
              onComplete={() => {
                  setFightState(prev => ({ ...prev, currentScreen: 'fight', matchPhase: 'entrance' }));
                  if (fightState.p1.entrance?.music) import('./engine/audio').then(m => m.sounds.playTheme(fightState.p1.entrance!.music));
              }}
            />
        )}

        {fightState.currentScreen === 'menu' && (
           <motion.div
             key="menu"
             initial={{ opacity: 0, x: -50 }}
             animate={{ opacity: 1, x: 0 }}
             exit={{ opacity: 0, x: 50 }}
             className="w-full h-full z-10 flex flex-col items-center justify-center"
           >
            <MainMenu 
                onStartExhibition={(category, type) => {
                    setFightState(prev => ({...prev, matchCategory: category, matchType: type}));
                    navigateWithLoading('arena');
                }}
                onOpenCreationSuite={() => navigateWithLoading('creation' as any)}
                onStartTournament={() => navigateWithLoading('tournament')}
                onEnterMode={(mode) => navigateWithLoading(mode as any)}
                gameOptions={gameOptions}
                setGameOptions={setGameOptions}
                superstars={superstars}
            />
           </motion.div>
         )}

        {fightState.currentScreen === 'arena' && (
            <ArenaSelection 
              onBack={() => setFightState(prev => ({ ...prev, currentScreen: 'menu' }))}
              onConfirm={(arena) => setFightState(prev => ({ ...prev, currentScreen: 'select', arena }))}
            />
        )}

        {(['career', 'gm', 'universe', 'faction'] as const).includes(fightState.currentScreen) && (
            <GameModes 
                mode={fightState.currentScreen as any}
                playerChar={fightState.p1}
                onBack={() => setFightState(prev => ({ ...prev, currentScreen: 'menu' }))}
            />
        )}

        {fightState.currentScreen === 'tournament' && (
            <TournamentMode 
                playerChar={fightState.p1}
                onBack={() => setFightState(prev => ({...prev, currentScreen: 'menu'}))}
                onStartMatch={(opp) => startMatch(fightState.p1, false, opp, true)}
            />
        )}

        {fightState.currentScreen === 'select' && (
           <SelectionScreen 
             availableSuperstars={superstars}
             onBack={() => setFightState(prev => ({...prev, currentScreen: 'arena'}))}
             onConfirm={startMatch}
           />
        )}

        {fightState.currentScreen === 'creation' && (
          <CreationSuite 
            superstars={superstars}
            onBack={() => setFightState(prev => ({ ...prev, currentScreen: 'menu' }))}
            onSaveCharacter={(data) => {
                setSuperstars(prev => {
                  const exists = prev.findIndex(s => s.name === data.name);
                  if (exists !== -1) {
                    const next = [...prev];
                    next[exists] = data;
                    return next;
                  }
                  return [data, ...prev];
                });
                setFightState(prev => ({ ...prev, p1: data, currentScreen: 'menu' }));
            }}
          />
        )}

        {fightState.currentScreen === 'fight' && (
          <motion.div
            key="fight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full"
          >
            <GameCanvas 
              p1Data={fightState.p1} 
              p2Data={fightState.p2} 
              p1CPU={fightState.p1CPU}
              p2CPU={fightState.p2CPU}
              championship={fightState.championship}
              gameOptions={gameOptions}
              matchCategory={fightState.matchCategory}
              matchType={fightState.matchType}
              matchPhase={fightState.matchPhase}
              onUpdate={handleUpdate}
              onPhaseChange={(phase) => setFightState(prev => ({ ...prev, matchPhase: phase }))}
              onGameOver={handleGameOver}
            />
            
            <FighterHUD 
               side="left" 
               hp={hudState.p1.hp} 
               energy={hudState.p1.energy} 
               sigMeter={hudState.p1.sigMeter}
               finMeter={hudState.p1.finMeter}
               sigStocks={hudState.p1.sigStocks}
               finStocks={hudState.p1.finStocks}
               combo={hudState.p1.combo} 
               data={hudState.p1.data}
               bodyDamage={hudState.p1.bodyDamage}
            />

            <FighterHUD 
               side="right" 
               hp={hudState.p2.hp} 
               energy={hudState.p2.energy} 
               sigMeter={hudState.p2.sigMeter}
               finMeter={hudState.p2.finMeter}
               sigStocks={hudState.p2.sigStocks}
               finStocks={hudState.p2.finStocks}
               combo={hudState.p2.combo} 
               data={hudState.p2.data}
               bodyDamage={hudState.p2.bodyDamage}
            />
            
            <AnimatePresence>
              {fightState.isGameOver && (
                <MatchReport 
                  winner={fightState.winnerName} 
                  p1={fightState.p1}
                  p2={fightState.p2}
                  p1Stats={fightState.stats.p1}
                  p2Stats={fightState.stats.p2}
                  onContinue={() => setFightState(prev => ({ ...prev, currentScreen: 'menu' }))} 
                />
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <ControllerUI onInput={handleTouchInput} isVisible={uiVisible && controllerEnabled} />

      <motion.button
        whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.2)' }}
        onClick={() => setControllerEnabled(!controllerEnabled)}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-[300] bg-black/40 border border-white/10 p-2 rounded-full text-zinc-500 hover:text-white transition-all backdrop-blur-md"
        title="Toggle Controller UI"
      >
        <Gamepad2 size={16} className={controllerEnabled ? 'text-red-500' : 'text-zinc-600'} />
      </motion.button>

      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-red-950/20 via-transparent to-cyan-950/20" />
      </div>
      <div className="absolute inset-0 pointer-events-none z-[100] opacity-[0.03] select-none" style={{ background: 'repeating-linear-gradient(0deg, #000, #000 1px, transparent 1px, transparent 2px)' }} />
    </div>
  );
}

const MenuButton = ({ icon, label, onClick, variant = 'secondary' }: { icon: any; label: string; onClick: () => void; variant?: 'primary' | 'secondary' }) => (
  <motion.button
    whileHover={{ scale: 1.05, x: 10 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`
      flex items-center gap-4 px-8 py-5 border font-bold tracking-[3px] transition-all group -skew-x-[12deg]
      ${variant === 'primary' 
        ? 'border-red-600 bg-red-600 text-white shadow-[0_0_25px_rgba(220,38,38,0.3)]' 
        : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-600 hover:text-white'}
    `}
  >
    <div className="skew-x-[12deg] flex items-center gap-4 w-full">
      <span className={variant === 'primary' ? 'text-white' : 'text-zinc-600 group-hover:text-cyan-500 transition-colors'}>{icon}</span>
      <span className="text-[11px] uppercase font-black tracking-[4px]">{label}</span>
    </div>
  </motion.button>
);
