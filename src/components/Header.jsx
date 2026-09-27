import React from 'react';
import { Trophy, Volume2, VolumeX, Music, Pause, Flame, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/audioSystem';

/**
 * Top Header and HUD for BLOCKBUSTERS
 */
export function Header({
  mode,
  score,
  bestScore,
  combo,
  linesCleared,
  timeLeft = null, // for Time Attack
  initialTime = 90,
  onPause,
  onOpenSettings,
  sfxEnabled,
  bgmEnabled,
  onToggleSfx,
  onToggleBgm,
}) {
  const isTimeAttack = mode?.id === 'TIME_ATTACK';
  const timeProgress = isTimeAttack && timeLeft !== null ? (timeLeft / initialTime) * 100 : 100;
  const isTimeUrgent = isTimeAttack && timeLeft !== null && timeLeft <= 15;

  return (
    <header className="game-hud-header" style={{ width: '100%', marginBottom: '12px' }}>
      {/* Top Bar: Title, Mode & Action Controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          marginBottom: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h1
            style={{
              fontSize: '1.4rem',
              fontWeight: '900',
              letterSpacing: '-0.02em',
              background: 'linear-gradient(135deg, #ffffff 0%, #a5b4fc 50%, #6366f1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: 0,
            }}
          >
            BLOCKBUSTERS
          </h1>
          {mode && (
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: '700',
                padding: '3px 8px',
                borderRadius: '8px',
                backgroundColor: `${mode.badgeColor || '#6366f1'}25`,
                color: mode.badgeColor || '#6366f1',
                border: `1px solid ${mode.badgeColor || '#6366f1'}50`,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {mode.title}
            </span>
          )}
        </div>

        {/* Audio & Pause Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={() => {
              soundManager.playClick();
              onToggleSfx();
            }}
            title={sfxEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects'}
            className="hud-icon-btn"
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              padding: '7px',
              color: sfxEnabled ? '#38bdf8' : '#64748b',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {sfxEnabled ? <Volume2 size={17} /> : <VolumeX size={17} />}
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onToggleBgm();
            }}
            title={bgmEnabled ? 'Mute Music' : 'Enable Music'}
            className="hud-icon-btn"
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              padding: '7px',
              color: bgmEnabled ? '#a855f7' : '#64748b',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Music size={17} />
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onPause();
            }}
            title="Pause Game"
            className="hud-icon-btn"
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              padding: '7px',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Pause size={17} />
          </button>
        </div>
      </div>

      {/* Time Attack Countdown Bar (if active) */}
      {isTimeAttack && timeLeft !== null && (
        <div
          style={{
            marginBottom: '10px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            padding: '8px 12px',
            border: `1px solid ${isTimeUrgent ? '#ef4444' : 'rgba(255, 255, 255, 0.1)'}`,
            boxShadow: isTimeUrgent ? '0 0 15px rgba(239, 68, 68, 0.4)' : 'none',
            animation: isTimeUrgent ? 'urgentPulse 0.8s infinite alternate' : 'none',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '5px',
            }}
          >
            <span
              style={{
                fontSize: '0.78rem',
                fontWeight: '700',
                color: isTimeUrgent ? '#f87171' : '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Flame size={14} color={isTimeUrgent ? '#ef4444' : '#f59e0b'} /> TIME REMAINING
            </span>
            <span
              style={{
                fontSize: '1rem',
                fontWeight: '900',
                fontFamily: '"Space Grotesk", sans-serif',
                color: isTimeUrgent ? '#ef4444' : '#ffffff',
              }}
            >
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </span>
          </div>
          <div
            style={{
              width: '100%',
              height: '6px',
              background: 'rgba(0, 0, 0, 0.5)',
              borderRadius: '99px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${Math.max(0, Math.min(100, timeProgress))}%`,
                height: '100%',
                background: isTimeUrgent
                  ? 'linear-gradient(90deg, #ef4444, #f43f5e)'
                  : 'linear-gradient(90deg, #38bdf8, #6366f1)',
                transition: 'width 0.2s linear',
              }}
            />
          </div>
        </div>
      )}

      {/* Stats Cards (Score, Best, Combo, Lines) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '8px',
        }}
      >
        {/* Score */}
        <div
          className="hud-stat-card"
          style={{
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.8) 100%)',
            padding: '8px 10px',
            borderRadius: '14px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '0.68rem', fontWeight: '700', color: '#94a3b8', letterSpacing: '0.05em' }}>
            SCORE
          </div>
          <div
            style={{
              fontSize: '1.25rem',
              fontWeight: '900',
              fontFamily: '"Space Grotesk", sans-serif',
              color: '#ffffff',
              textShadow: '0 0 12px rgba(99, 102, 241, 0.5)',
            }}
          >
            {score.toLocaleString()}
          </div>
        </div>

        {/* Best Score */}
        <div
          className="hud-stat-card"
          style={{
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.8) 100%)',
            padding: '8px 10px',
            borderRadius: '14px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: '0.68rem',
              fontWeight: '700',
              color: '#fbbf24',
              letterSpacing: '0.05em',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '3px',
            }}
          >
            <Trophy size={11} /> BEST
          </div>
          <div
            style={{
              fontSize: '1.25rem',
              fontWeight: '900',
              fontFamily: '"Space Grotesk", sans-serif',
              color: '#fbbf24',
            }}
          >
            {bestScore.toLocaleString()}
          </div>
        </div>

        {/* Combo Multiplier */}
        <div
          className="hud-stat-card"
          style={{
            background:
              combo > 1
                ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.3) 0%, rgba(245, 158, 11, 0.3) 100%)'
                : 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.8) 100%)',
            padding: '8px 10px',
            borderRadius: '14px',
            border: combo > 1 ? '1px solid rgba(239, 68, 68, 0.5)' : '1px solid rgba(255, 255, 255, 0.08)',
            textAlign: 'center',
            boxShadow: combo > 1 ? '0 0 12px rgba(245, 158, 11, 0.3)' : 'none',
          }}
        >
          <div
            style={{
              fontSize: '0.68rem',
              fontWeight: '700',
              color: combo > 1 ? '#f87171' : '#94a3b8',
              letterSpacing: '0.05em',
            }}
          >
            COMBO
          </div>
          <div
            style={{
              fontSize: '1.25rem',
              fontWeight: '900',
              fontFamily: '"Space Grotesk", sans-serif',
              color: combo > 1 ? '#f59e0b' : '#64748b',
            }}
          >
            {combo > 1 ? `×${combo}` : '-'}
          </div>
        </div>

        {/* Lines Cleared */}
        <div
          className="hud-stat-card"
          style={{
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.8) 100%)',
            padding: '8px 10px',
            borderRadius: '14px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: '0.68rem',
              fontWeight: '700',
              color: '#38bdf8',
              letterSpacing: '0.05em',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '3px',
            }}
          >
            <Sparkles size={11} /> LINES
          </div>
          <div
            style={{
              fontSize: '1.25rem',
              fontWeight: '900',
              fontFamily: '"Space Grotesk", sans-serif',
              color: '#38bdf8',
            }}
          >
            {linesCleared}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
