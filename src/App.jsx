import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GAME_CONFIG } from './constants/gameConfig';
import {
  createEmptyBoard,
  createSeededBoard,
  placeBlock,
  findCompletedLines,
  clearLines,
  canAnyBlockFit,
  calculateScoreBreakdown,
  countBlockCells,
} from './utils/boardLogic';
import { generateThreeBlocks } from './utils/blockGenerator';
import { soundManager } from './utils/audioSystem';
import {
  getProfile,
  saveProfile,
  getHighScores,
  recordGameResult,
  getSettings,
  saveSettings,
  resetAllData,
} from './utils/storage';

import Header from './components/Header';
import GameBoard from './components/GameBoard';
import BlockTray from './components/BlockTray';
import ParticleCanvas from './components/ParticleCanvas';
import CursorTrail from './components/CursorTrail';
import BackgroundEffect from './components/BackgroundEffect';

import HomeScreen from './components/Screens/HomeScreen';
import ModeSelectModal from './components/Screens/ModeSelectModal';
import UsernameModal from './components/Screens/UsernameModal';
import PauseModal from './components/Screens/PauseModal';
import GameOverModal from './components/Screens/GameOverModal';
import LeaderboardModal from './components/Screens/LeaderboardModal';
import HowToPlayModal from './components/Screens/HowToPlayModal';
import SettingsModal from './components/Screens/SettingsModal';

export default function App() {
  // Game UI state
  const [gameState, setGameState] = useState('HOME'); // 'HOME' | 'PLAYING' | 'PAUSED' | 'GAME_OVER'
  const [activeModal, setActiveModal] = useState(null); // 'MODES' | 'USERNAME' | 'LEADERBOARD' | 'HOW_TO_PLAY' | 'SETTINGS' | null

  // Player & Config
  const [profile, setProfile] = useState(null);
  const [currentMode, setCurrentMode] = useState(GAME_CONFIG.MODES.CLASSIC);
  const [bestScores, setBestScores] = useState({ CLASSIC: 0, TIME_ATTACK: 0, ENDLESS: 0 });
  const [settings, setSettings] = useState({
    sfxEnabled: true,
    bgmEnabled: true,
    perspective3D: true,
    starterObstacles: 'MEDIUM',
    enableCursorTrail: true,
    enableBgVideo: true,
    enableFallingParticles: true,
  });

  // Gameplay State
  const [board, setBoard] = useState(() => createSeededBoard('MEDIUM'));
  const [availableBlocks, setAvailableBlocks] = useState([null, null, null]);
  const [score, setScore] = useState(0);
  const [linesCleared, setLinesCleared] = useState(0);
  const [comboStreak, setComboStreak] = useState(0);
  const [highestCombo, setHighestCombo] = useState(0);
  const [blocksPlaced, setBlocksPlaced] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isNewHigh, setIsNewHigh] = useState(false);
  const [playerRank, setPlayerRank] = useState(1);

  // Time Attack State
  const [timeLeft, setTimeLeft] = useState(null);
  const timerIntervalRef = useRef(null);

  // Animation & Visual feedback state
  const [clearingRows, setClearingRows] = useState([]);
  const [clearingCols, setClearingCols] = useState([]);
  const [ghostPosition, setGhostPosition] = useState(null);
  const [isShaking, setIsShaking] = useState(false);
  const [boardCellSize, setBoardCellSize] = useState(38);
  const [boardGap, setBoardGap] = useState(5);

  const boardContainerRef = useRef(null);
  const particleCanvasRef = useRef(null);

  // 1. Initial Load & Storage bootstrap
  useEffect(() => {
    const loadedProfile = getProfile();
    if (loadedProfile) {
      setProfile(loadedProfile);
    } else {
      // First time onboarding
      setActiveModal('USERNAME');
    }

    const loadedScores = getHighScores();
    setBestScores(loadedScores);

    const loadedSettings = getSettings();
    setSettings(loadedSettings);
    soundManager.setSfxEnabled(loadedSettings.sfxEnabled);
    soundManager.setBgmEnabled(loadedSettings.bgmEnabled);
  }, []);

  // 2. Responsive Board Sizing
  useEffect(() => {
    const updateSize = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      // Fit 10 cells + gaps + padding comfortably inside available screen
      if (vw < 380) {
        setBoardCellSize(27);
        setBoardGap(3);
      } else if (vw < 480) {
        setBoardCellSize(30);
        setBoardGap(4);
      } else if (vw < 640) {
        setBoardCellSize(34);
        setBoardGap(4);
      } else if (vh < 750) {
        setBoardCellSize(32);
        setBoardGap(4);
      } else {
        setBoardCellSize(38);
        setBoardGap(5);
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // 3. Time Attack countdown timer
  useEffect(() => {
    if (gameState === 'PLAYING' && currentMode.id === 'TIME_ATTACK' && timeLeft !== null) {
      timerIntervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current);
            handleTimeAttackEnd();
            return 0;
          }
          if (prev <= 10) {
            soundManager.playCountdownTick();
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [gameState, currentMode, timeLeft]);

  // Handle Game Over
  const triggerGameOver = useCallback(
    (finalScore = score) => {
      setIsGameOver(true);
      setGameState('GAME_OVER');

      const result = recordGameResult({
        mode: currentMode.id,
        score: finalScore,
        linesCleared,
        highestCombo,
        blocksPlaced,
        username: profile?.username || 'Player 1',
      });

      setIsNewHigh(result.isNewHigh);
      setBestScores(getHighScores());

      // Estimate ranking
      const randRank = Math.max(1, Math.min(8, Math.floor(100000 / (finalScore + 1000))));
      setPlayerRank(randRank);
    },
    [currentMode, score, linesCleared, highestCombo, blocksPlaced, profile]
  );

  const handleTimeAttackEnd = () => {
    triggerGameOver(score);
  };

  // Start / Restart Game with Pre-Seeded Strategic Blocks
  const startNewGame = (modeId = currentMode.id) => {
    const selectedMode = GAME_CONFIG.MODES[modeId] || GAME_CONFIG.MODES.CLASSIC;
    setCurrentMode(selectedMode);

    // Generate seeded board based on user's obstacle preference
    const obstacleDensity = settings.starterObstacles || 'MEDIUM';
    const seededBoard = createSeededBoard(obstacleDensity);
    const newBlocks = generateThreeBlocks(seededBoard);

    setBoard(seededBoard);
    setAvailableBlocks(newBlocks);
    setScore(0);
    setLinesCleared(0);
    setComboStreak(0);
    setHighestCombo(0);
    setBlocksPlaced(0);
    setIsGameOver(false);
    setIsNewHigh(false);
    setClearingRows([]);
    setClearingCols([]);
    setGhostPosition(null);

    if (selectedMode.id === 'TIME_ATTACK') {
      setTimeLeft(selectedMode.initialDuration);
    } else {
      setTimeLeft(null);
    }

    setGameState('PLAYING');
    setActiveModal(null);
  };

  // Handle block placement & line clears
  const handleBlockPlaced = (trayIndex, block, startRow, startCol) => {
    // 1. Place the block into board
    const newBoard = placeBlock(board, block, startRow, startCol);
    const cellsCount = countBlockCells(block);

    // 2. Consume tray piece
    const updatedTray = [...availableBlocks];
    updatedTray[trayIndex] = null;

    // 3. Detect completed lines
    const { rows, cols, totalLines } = findCompletedLines(newBoard);

    const newPlacedTotal = blocksPlaced + 1;
    setBlocksPlaced(newPlacedTotal);

    if (totalLines > 0) {
      // Line Clear Sequence!
      const newStreak = comboStreak + 1;
      setComboStreak(newStreak);
      const newHighest = Math.max(highestCombo, newStreak);
      setHighestCombo(newHighest);

      // Score calculation
      const scoreData = calculateScoreBreakdown(cellsCount, totalLines, newStreak);
      const newTotalScore = score + scoreData.totalEarned;
      setScore(newTotalScore);
      setLinesCleared(prev => prev + totalLines);

      // Time attack bonus
      if (currentMode.id === 'TIME_ATTACK' && timeLeft !== null) {
        const bonus = currentMode.bonusPerLine[Math.min(totalLines, 4)] || 10;
        setTimeLeft(t => t + bonus);
      }

      // Audio & Multi-line fanfare
      soundManager.playLineClear(totalLines, newStreak);
      if (newStreak > 1) {
        soundManager.playCombo(newStreak);
      }

      // Screen shake on 2+ lines
      if (totalLines >= 2) {
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), GAME_CONFIG.ANIMATIONS.SCREEN_SHAKE_MS);
      }

      // Trigger line glow animation
      setClearingRows(rows);
      setClearingCols(cols);

      // Find pixel coordinates of cleared cells for 3D particle exploding cubes
      if (boardContainerRef.current && particleCanvasRef.current) {
        const boardRect = boardContainerRef.current.getBoundingClientRect();
        const padding = 14;
        const cellStep = boardCellSize + boardGap;

        const clearedPixels = [];
        rows.forEach(r => {
          for (let c = 0; c < GAME_CONFIG.BOARD_SIZE; c++) {
            clearedPixels.push({
              x: boardRect.left + padding + c * cellStep + boardCellSize / 2,
              y: boardRect.top + padding + r * cellStep + boardCellSize / 2,
              color: block.color,
            });
          }
        });
        cols.forEach(c => {
          for (let r = 0; r < GAME_CONFIG.BOARD_SIZE; r++) {
            clearedPixels.push({
              x: boardRect.left + padding + c * cellStep + boardCellSize / 2,
              y: boardRect.top + padding + r * cellStep + boardCellSize / 2,
              color: block.color,
            });
          }
        });

        particleCanvasRef.current.spawnLineParticles(clearedPixels, block.color);

        // Spawn floating score & combo text
        const midX = boardRect.left + boardRect.width / 2;
        const midY = boardRect.top + boardRect.height / 2;
        const comboText = newStreak > 1 ? `COMBO ×${scoreData.comboMultiplier}!` : null;
        particleCanvasRef.current.spawnScoreText(
          midX,
          midY,
          `+${scoreData.totalEarned.toLocaleString()}`,
          comboText,
          block.color
        );
      }

      // After clear animation timing, update board & tray
      setTimeout(() => {
        const cleanedBoard = clearLines(newBoard, rows, cols);
        setBoard(cleanedBoard);
        setClearingRows([]);
        setClearingCols([]);

        // Advance Tray
        finalizeTrayAndCheckGameOver(cleanedBoard, updatedTray);
      }, GAME_CONFIG.ANIMATIONS.LINE_HIGHLIGHT_MS);
    } else {
      // No lines cleared on this move - reset combo streak
      setComboStreak(0);
      const scoreData = calculateScoreBreakdown(cellsCount, 0, 0);
      setScore(prev => prev + scoreData.totalEarned);
      setBoard(newBoard);

      finalizeTrayAndCheckGameOver(newBoard, updatedTray);
    }
  };

  // Helper to refill tray if all 3 are empty, and check if any move is possible
  const finalizeTrayAndCheckGameOver = (currentBoard, tray) => {
    let nextTray = [...tray];
    const isTrayEmpty = nextTray.every(b => b === null);

    if (isTrayEmpty) {
      nextTray = generateThreeBlocks(currentBoard);
      setAvailableBlocks(nextTray);
    } else {
      setAvailableBlocks(nextTray);
    }

    // Check Game Over: Can ANY remaining block in nextTray fit ANYWHERE on currentBoard?
    const canMove = canAnyBlockFit(currentBoard, nextTray);
    if (!canMove) {
      setTimeout(() => {
        triggerGameOver();
      }, 350);
    }
  };

  // Profile Save
  const handleSaveProfile = (username, avatar) => {
    const saved = saveProfile(username, avatar);
    setProfile(saved);
    setActiveModal(null);
  };

  // Settings Save
  const handleUpdateSettings = newSettings => {
    setSettings(newSettings);
    saveSettings(newSettings);
    soundManager.setSfxEnabled(newSettings.sfxEnabled);
    soundManager.setBgmEnabled(newSettings.bgmEnabled);
  };

  // Reset Data
  const handleResetData = () => {
    resetAllData();
    setBestScores({ CLASSIC: 0, TIME_ATTACK: 0, ENDLESS: 0 });
    const freshProfile = saveProfile('Player 1', '👾');
    setProfile(freshProfile);
    setActiveModal(null);
  };

  const bestForMode = bestScores[currentMode.id] || 0;

  return (
    <div className="app-viewport-root">
      {/* Background Video and Falling 3D Blocks Effect Layer */}
      <BackgroundEffect
        showVideo={settings.enableBgVideo !== false}
        showFallingParticles={settings.enableFallingParticles !== false}
      />

      {/* Arcade Glowing Cursor Trail */}
      {settings.enableCursorTrail !== false && <CursorTrail />}

      {/* Dynamic 3D Particle & Score Canvas Overlay */}
      <ParticleCanvas ref={particleCanvasRef} />

      {/* Main Screen Switcher */}
      {gameState === 'HOME' && (
        <HomeScreen
          profile={profile}
          bestScores={bestScores}
          onStartGame={() => startNewGame('CLASSIC')}
          onOpenModes={() => setActiveModal('MODES')}
          onOpenLeaderboard={() => setActiveModal('LEADERBOARD')}
          onOpenHowToPlay={() => setActiveModal('HOW_TO_PLAY')}
          onOpenSettings={() => setActiveModal('SETTINGS')}
          onOpenProfile={() => setActiveModal('USERNAME')}
        />
      )}

      {(gameState === 'PLAYING' || gameState === 'PAUSED' || gameState === 'GAME_OVER') && (
        <main
          className="gameplay-container"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            maxWidth: '460px',
            margin: '0 auto',
            padding: '12px 14px',
            minHeight: '100vh',
            boxSizing: 'border-box',
            position: 'relative',
            zIndex: 10,
          }}
        >
          {/* Header & HUD */}
          <Header
            mode={currentMode}
            score={score}
            bestScore={bestForMode}
            combo={comboStreak}
            linesCleared={linesCleared}
            timeLeft={timeLeft}
            initialTime={currentMode.initialDuration || 90}
            onPause={() => setGameState('PAUSED')}
            onOpenSettings={() => setActiveModal('SETTINGS')}
            sfxEnabled={settings.sfxEnabled}
            bgmEnabled={settings.bgmEnabled}
            onToggleSfx={() =>
              handleUpdateSettings({ ...settings, sfxEnabled: !settings.sfxEnabled })
            }
            onToggleBgm={() =>
              handleUpdateSettings({ ...settings, bgmEnabled: !settings.bgmEnabled })
            }
          />

          {/* 10x10 Game Board */}
          <div style={{ margin: '8px 0 16px 0', width: '100%', display: 'flex', justifyContent: 'center' }}>
            <GameBoard
              ref={boardContainerRef}
              board={board}
              clearingRows={clearingRows}
              clearingCols={clearingCols}
              ghostPosition={ghostPosition}
              cellSize={boardCellSize}
              gap={boardGap}
              isShaking={isShaking}
              perspective3D={settings.perspective3D}
            />
          </div>

          {/* 3-Slot Block Tray */}
          <BlockTray
            availableBlocks={availableBlocks}
            board={board}
            boardRef={boardContainerRef}
            boardCellSize={boardCellSize}
            boardGap={boardGap}
            onBlockPlaced={handleBlockPlaced}
            disabled={gameState !== 'PLAYING' || clearingRows.length > 0 || clearingCols.length > 0}
            setGhostPosition={setGhostPosition}
          />
        </main>
      )}

      {/* MODALS */}
      {/* 1. Mode Select Modal */}
      <ModeSelectModal
        isOpen={activeModal === 'MODES'}
        onClose={() => setActiveModal(null)}
        bestScores={bestScores}
        onSelectMode={modeId => startNewGame(modeId)}
      />

      {/* 2. Username Onboarding Modal */}
      <UsernameModal
        isOpen={activeModal === 'USERNAME'}
        initialName={profile?.username || ''}
        onSave={handleSaveProfile}
        canClose={!!profile}
        onClose={() => setActiveModal(null)}
      />

      {/* 3. Pause Modal */}
      <PauseModal
        isOpen={gameState === 'PAUSED'}
        onResume={() => setGameState('PLAYING')}
        onRestart={() => startNewGame(currentMode.id)}
        onOpenModes={() => {
          setGameState('HOME');
          setActiveModal('MODES');
        }}
        onHome={() => setGameState('HOME')}
        sfxEnabled={settings.sfxEnabled}
        bgmEnabled={settings.bgmEnabled}
        onToggleSfx={() =>
          handleUpdateSettings({ ...settings, sfxEnabled: !settings.sfxEnabled })
        }
        onToggleBgm={() =>
          handleUpdateSettings({ ...settings, bgmEnabled: !settings.bgmEnabled })
        }
      />

      {/* 4. Game Over Modal */}
      <GameOverModal
        isOpen={gameState === 'GAME_OVER'}
        score={score}
        bestScore={bestForMode}
        isNewHighScore={isNewHigh}
        linesCleared={linesCleared}
        highestCombo={highestCombo}
        blocksPlaced={blocksPlaced}
        mode={currentMode}
        rank={playerRank}
        onPlayAgain={() => startNewGame(currentMode.id)}
        onLeaderboard={() => setActiveModal('LEADERBOARD')}
        onHome={() => setGameState('HOME')}
      />

      {/* 5. Leaderboard Modal */}
      <LeaderboardModal
        isOpen={activeModal === 'LEADERBOARD'}
        onClose={() => setActiveModal(null)}
        currentMode={currentMode.id}
        currentUsername={profile?.username || ''}
      />

      {/* 6. How To Play Tutorial Modal */}
      <HowToPlayModal
        isOpen={activeModal === 'HOW_TO_PLAY'}
        onClose={() => setActiveModal(null)}
      />

      {/* 7. Settings Modal */}
      <SettingsModal
        isOpen={activeModal === 'SETTINGS'}
        onClose={() => setActiveModal(null)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        profile={profile}
        onEditUsername={() => setActiveModal('USERNAME')}
        onResetAllData={handleResetData}
      />
    </div>
  );
}
