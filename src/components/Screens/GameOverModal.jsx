import React, { useEffect, useState } from 'react';
import { RotateCcw, Trophy, Home, Sparkles, Flame, Grid, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../utils/audioSystem';

export function GameOverModal({
  isOpen,
  score,
  bestScore,
  isNewHighScore,
  linesCleared,
  highestCombo,
  blocksPlaced,
  mode,
  rank = 1,
  onPlayAgain,
  onLeaderboard,
  onHome,
}) {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    if (!isOpen) return;

    // Confetti effect if new high score
    if (isNewHighScore) {
      soundManager.playHighScore();
      try {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#6366f1', '#a855f7', '#38bdf8', '#fbbf24', '#ec4899'],
        });
      } catch (e) {
        console.log('Confetti triggered', e);
      }
    } else {
      soundManager.playGameOver();
    }

    // Animated score count-up
    let start = 0;
    const duration = 1200; // ms
    const startTime = performance.now();

    const animateCount = (currTime) => {
      const elapsed = currTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out expo
      const easeOut = 1 - Math.pow(2, -10 * progress);
      const current = Math.floor(easeOut * score);
      setDisplayScore(current);

      if (progress < 1) {
        requestAnimationFrame(animateCount);
      } else {
        setDisplayScore(score);
      }
    };

    requestAnimationFrame(animateCount);
  }, [isOpen, score, isNewHighScore]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop-overlay">
      <div
        className="modal-glass-container"
        style={{
          width: '100%',
          maxWidth: '440px',
          background: 'linear-gradient(145deg, rgba(20, 26, 46, 0.98) 0%, rgba(10, 14, 28, 0.99) 100%)',
          borderRadius: '26px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.85), 0 0 40px rgba(99, 102, 241, 0.3)',
          padding: '28px',
          color: '#ffffff',
          textAlign: 'center',
          animation: 'scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {/* Banner Tag */}
        {isNewHighScore ? (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              background: 'linear-gradient(90deg, rgba(251, 191, 36, 0.25), rgba(245, 158, 11, 0.35))',
              border: '1px solid #fbbf24',
              borderRadius: '99px',
              color: '#fbbf24',
              fontSize: '0.82rem',
              fontWeight: '800',
              letterSpacing: '0.08em',
              marginBottom: '14px',
              boxShadow: '0 0 15px rgba(251, 191, 36, 0.4)',
              animation: 'pulseGlow 1.5s infinite alternate',
            }}
          >
            <Trophy size={15} /> NEW HIGH SCORE!
          </div>
        ) : (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 12px',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '99px',
              color: '#f87171',
              fontSize: '0.8rem',
              fontWeight: '700',
              letterSpacing: '0.08em',
              marginBottom: '14px',
            }}
          >
            NO MORE MOVES
          </div>
        )}

        <h2
          style={{
            fontSize: '2rem',
            fontWeight: '900',
            letterSpacing: '-0.02em',
            margin: '0 0 8px 0',
            background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          GAME OVER
        </h2>

        {/* Score Display */}
        <div style={{ margin: '18px 0 22px 0' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#94a3b8', letterSpacing: '0.1em' }}>
            FINAL SCORE
          </div>
          <div
            style={{
              fontSize: '3.2rem',
              fontWeight: '900',
              fontFamily: '"Space Grotesk", sans-serif',
              lineHeight: 1.1,
              background: 'linear-gradient(135deg, #ffffff 0%, #38bdf8 50%, #6366f1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 4px 15px rgba(56, 189, 248, 0.4))',
            }}
          >
            {displayScore.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.85rem', color: '#fbbf24', fontWeight: '700', marginTop: '4px' }}>
            Personal Best: {bestScore.toLocaleString()} pts
          </div>
        </div>

        {/* Stats Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '10px',
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', color: '#38bdf8', fontSize: '0.78rem', fontWeight: '700' }}>
              <Sparkles size={14} /> LINES CLEARED
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', marginTop: '4px', fontFamily: '"Space Grotesk", sans-serif' }}>
              {linesCleared}
            </div>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', color: '#f59e0b', fontSize: '0.78rem', fontWeight: '700' }}>
              <Flame size={14} /> HIGHEST COMBO
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', marginTop: '4px', fontFamily: '"Space Grotesk", sans-serif' }}>
              {highestCombo > 1 ? `×${highestCombo}` : 'None'}
            </div>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', color: '#a855f7', fontSize: '0.78rem', fontWeight: '700' }}>
              <Grid size={14} /> BLOCKS PLACED
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', marginTop: '4px', fontFamily: '"Space Grotesk", sans-serif' }}>
              {blocksPlaced}
            </div>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', color: '#10b981', fontSize: '0.78rem', fontWeight: '700' }}>
              <Award size={14} /> ARCADE RANK
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', marginTop: '4px', color: '#10b981', fontFamily: '"Space Grotesk", sans-serif' }}>
              #{rank || 1}
            </div>
          </div>
        </div>

        {/* Primary & Secondary Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            onClick={() => {
              soundManager.playClick();
              onPlayAgain();
            }}
            className="btn-primary-glow"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              width: '100%',
              padding: '14px',
              fontSize: '1.1rem',
              fontWeight: '800',
              color: '#ffffff',
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
              border: 'none',
              borderRadius: '16px',
              cursor: 'pointer',
              boxShadow: '0 8px 25px rgba(99, 102, 241, 0.5)',
            }}
          >
            <RotateCcw size={20} /> PLAY AGAIN
          </button>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            <button
              onClick={() => {
                soundManager.playClick();
                onLeaderboard();
              }}
              className="btn-glass-action"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px',
                fontSize: '0.92rem',
                fontWeight: '700',
                color: '#e2e8f0',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '14px',
                cursor: 'pointer',
              }}
            >
              <Trophy size={16} color="#fbbf24" /> Leaderboard
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                onHome();
              }}
              className="btn-glass-action"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px',
                fontSize: '0.92rem',
                fontWeight: '700',
                color: '#94a3b8',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '14px',
                cursor: 'pointer',
              }}
            >
              <Home size={16} /> Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameOverModal;
