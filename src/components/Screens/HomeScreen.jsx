import React from 'react';
import { Play, Grid, Trophy, HelpCircle, Settings, User } from 'lucide-react';
import { soundManager } from '../../utils/audioSystem';

export function HomeScreen({
  profile,
  onStartGame,
  onOpenModes,
  onOpenLeaderboard,
  onOpenHowToPlay,
  onOpenSettings,
  onOpenProfile,
  bestScores,
}) {
  const highestOverall = Math.max(
    bestScores.CLASSIC || 0,
    bestScores.TIME_ATTACK || 0,
    bestScores.ENDLESS || 0
  );

  return (
    <div
      className="home-screen-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '85vh',
        width: '100%',
        maxWidth: '480px',
        margin: '0 auto',
        padding: '20px',
        textAlign: 'center',
        position: 'relative',
        zIndex: 10,
      }}
    >
      {/* User profile pill */}
      <button
        onClick={() => {
          soundManager.playClick();
          onOpenProfile();
        }}
        className="profile-pill-btn"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          background: 'rgba(255, 255, 255, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '99px',
          color: '#ffffff',
          fontSize: '0.85rem',
          fontWeight: '600',
          cursor: 'pointer',
          marginBottom: '24px',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.2s ease',
        }}
      >
        <span style={{ fontSize: '1.1rem' }}>{profile?.avatar || '👾'}</span>
        <span>{profile?.username || 'Player 1'}</span>
        <User size={14} color="#94a3b8" />
      </button>

      {/* Hero 3D Logo */}
      <div style={{ marginBottom: '10px', position: 'relative' }}>
        <div
          className="hero-logo-badge"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 12px',
            background: 'linear-gradient(90deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2))',
            borderRadius: '99px',
            border: '1px solid rgba(168, 85, 247, 0.4)',
            color: '#c084fc',
            fontSize: '0.75rem',
            fontWeight: '800',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: '12px',
          }}
        >
          ARCADE 3D PUZZLE
        </div>

        <h1
          className="hero-game-title"
          style={{
            fontSize: 'clamp(2.8rem, 8vw, 3.8rem)',
            fontWeight: '900',
            letterSpacing: '-0.03em',
            lineHeight: 1,
            margin: '0 0 10px 0',
            background: 'linear-gradient(135deg, #ffffff 0%, #38bdf8 35%, #a855f7 70%, #ec4899 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 10px 25px rgba(99, 102, 241, 0.4))',
          }}
        >
          BLOCKBUSTERS
        </h1>

        <p
          style={{
            fontSize: '0.95rem',
            fontWeight: '600',
            letterSpacing: '0.2em',
            color: '#94a3b8',
            margin: '0 0 24px 0',
            textTransform: 'uppercase',
          }}
        >
          BUILD • CLEAR • DOMINATE
        </p>
      </div>

      {/* Floating 3D Cubes Visual Preview */}
      <div
        className="hero-cube-visual"
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          marginBottom: '32px',
        }}
      >
        {['#06b6d4', '#10b981', '#a855f7', '#ec4899', '#f97316'].map((col, i) => (
          <div
            key={i}
            className="floating-hero-cube"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: `linear-gradient(135deg, #ffffff 0%, ${col} 50%, #000000 100%)`,
              boxShadow: `0 8px 16px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.7)`,
              border: '1px solid rgba(255,255,255,0.2)',
              animation: `floatCube 2.8s ease-in-out infinite alternate ${i * 0.35}s`,
            }}
          />
        ))}
      </div>

      {/* Best Score Banner */}
      {highestOverall > 0 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 18px',
            background: 'rgba(251, 191, 36, 0.1)',
            border: '1px solid rgba(251, 191, 36, 0.3)',
            borderRadius: '16px',
            color: '#fbbf24',
            fontSize: '0.9rem',
            fontWeight: '700',
            marginBottom: '24px',
          }}
        >
          <Trophy size={16} /> Best Record: {highestOverall.toLocaleString()} pts
        </div>
      )}

      {/* Primary Action Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
        {/* Play Button */}
        <button
          onClick={() => {
            soundManager.playClick();
            onStartGame();
          }}
          className="btn-primary-glow"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            width: '100%',
            padding: '16px 24px',
            fontSize: '1.2rem',
            fontWeight: '800',
            color: '#ffffff',
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
            border: 'none',
            borderRadius: '18px',
            cursor: 'pointer',
            boxShadow: '0 10px 25px rgba(99, 102, 241, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.4)',
            transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          <Play size={22} fill="#ffffff" /> PLAY NOW
        </button>

        {/* Secondary Buttons Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenModes();
            }}
            className="btn-glass-action"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '13px',
              fontSize: '0.95rem',
              fontWeight: '700',
              color: '#e2e8f0',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '14px',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.2s ease',
            }}
          >
            <Grid size={18} color="#38bdf8" /> Game Modes
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onOpenLeaderboard();
            }}
            className="btn-glass-action"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '13px',
              fontSize: '0.95rem',
              fontWeight: '700',
              color: '#e2e8f0',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '14px',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.2s ease',
            }}
          >
            <Trophy size={18} color="#fbbf24" /> Leaderboard
          </button>
        </div>

        {/* Bottom utility row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenHowToPlay();
            }}
            className="btn-glass-action"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '11px',
              fontSize: '0.88rem',
              fontWeight: '600',
              color: '#94a3b8',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <HelpCircle size={16} /> How to Play
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onOpenSettings();
            }}
            className="btn-glass-action"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '11px',
              fontSize: '0.88rem',
              fontWeight: '600',
              color: '#94a3b8',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <Settings size={16} /> Settings
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomeScreen;
