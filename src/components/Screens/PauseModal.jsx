import React from 'react';
import { Play, RotateCcw, Grid, Home, Volume2, VolumeX, Music } from 'lucide-react';
import { soundManager } from '../../utils/audioSystem';

export function PauseModal({
  isOpen,
  onResume,
  onRestart,
  onOpenModes,
  onHome,
  sfxEnabled,
  bgmEnabled,
  onToggleSfx,
  onToggleBgm,
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop-overlay">
      <div
        className="modal-glass-container"
        style={{
          width: '100%',
          maxWidth: '380px',
          background: 'linear-gradient(145deg, rgba(20, 26, 46, 0.96) 0%, rgba(10, 14, 28, 0.98) 100%)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(99, 102, 241, 0.25)',
          padding: '28px',
          color: '#ffffff',
          textAlign: 'center',
        }}
      >
        <h2
          style={{
            fontSize: '1.8rem',
            fontWeight: '900',
            letterSpacing: '0.08em',
            margin: '0 0 6px 0',
            background: 'linear-gradient(135deg, #ffffff, #a5b4fc)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          GAME PAUSED
        </h2>
        <p style={{ fontSize: '0.88rem', color: '#94a3b8', margin: '0 0 24px 0' }}>
          Take a breath and plan your next move
        </p>

        {/* Audio Quick Toggles */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '24px',
          }}
        >
          <button
            onClick={() => {
              soundManager.playClick();
              onToggleSfx();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: sfxEnabled ? '#38bdf8' : '#64748b',
              fontSize: '0.82rem',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            {sfxEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            SFX {sfxEnabled ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onToggleBgm();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: bgmEnabled ? '#a855f7' : '#64748b',
              fontSize: '0.82rem',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            <Music size={16} />
            Music {bgmEnabled ? 'ON' : 'OFF'}
          </button>
        </div>

        {/* Navigation Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            onClick={() => {
              soundManager.playClick();
              onResume();
            }}
            className="btn-primary-glow"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              width: '100%',
              padding: '14px',
              fontSize: '1.05rem',
              fontWeight: '800',
              color: '#ffffff',
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
              border: 'none',
              borderRadius: '16px',
              cursor: 'pointer',
              boxShadow: '0 8px 20px rgba(99, 102, 241, 0.4)',
            }}
          >
            <Play size={20} fill="#ffffff" /> RESUME GAME
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onRestart();
            }}
            className="btn-glass-action"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px',
              fontSize: '0.95rem',
              fontWeight: '700',
              color: '#e2e8f0',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '14px',
              cursor: 'pointer',
            }}
          >
            <RotateCcw size={18} /> Restart Match
          </button>

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
              padding: '12px',
              fontSize: '0.95rem',
              fontWeight: '700',
              color: '#e2e8f0',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '14px',
              cursor: 'pointer',
            }}
          >
            <Grid size={18} /> Switch Mode
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
              fontSize: '0.95rem',
              fontWeight: '700',
              color: '#94a3b8',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '14px',
              cursor: 'pointer',
            }}
          >
            <Home size={18} /> Exit to Main Menu
          </button>
        </div>
      </div>
    </div>
  );
}

export default PauseModal;
