import React from 'react';
import { X, Trophy, Flame, Infinity as InfinityIcon, ArrowRight } from 'lucide-react';
import { GAME_CONFIG } from '../../constants/gameConfig';
import { soundManager } from '../../utils/audioSystem';

export function ModeSelectModal({ isOpen, onClose, onSelectMode, bestScores }) {
  if (!isOpen) return null;

  const modes = [
    {
      ...GAME_CONFIG.MODES.CLASSIC,
      iconComponent: Trophy,
      color: '#6366f1',
      bgGlow: 'rgba(99, 102, 241, 0.25)',
      best: bestScores.CLASSIC || 0,
    },
    {
      ...GAME_CONFIG.MODES.TIME_ATTACK,
      iconComponent: Flame,
      color: '#f43f5e',
      bgGlow: 'rgba(244, 63, 94, 0.25)',
      best: bestScores.TIME_ATTACK || 0,
    },
    {
      ...GAME_CONFIG.MODES.ENDLESS,
      iconComponent: InfinityIcon,
      color: '#10b981',
      bgGlow: 'rgba(16, 185, 129, 0.25)',
      best: bestScores.ENDLESS || 0,
    },
  ];

  return (
    <div className="modal-backdrop-overlay">
      <div
        className="modal-glass-container"
        style={{
          width: '100%',
          maxWidth: '460px',
          background: 'linear-gradient(145deg, rgba(20, 26, 46, 0.96) 0%, rgba(10, 14, 28, 0.98) 100%)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(99, 102, 241, 0.2)',
          padding: '24px',
          color: '#ffffff',
          position: 'relative',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', margin: 0 }}>Select Game Mode</h2>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '4px 0 0 0' }}>
              Choose your puzzle challenge
            </p>
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="modal-close-btn"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#94a3b8',
              cursor: 'pointer',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Mode Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {modes.map(mode => {
            const Icon = mode.iconComponent;

            return (
              <div
                key={mode.id}
                onClick={() => {
                  soundManager.playClick();
                  onSelectMode(mode.id);
                }}
                className="mode-card-select"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  borderRadius: '18px',
                  background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%)',
                  border: `1px solid ${mode.color}40`,
                  boxShadow: `0 8px 20px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)`,
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '14px',
                      background: `linear-gradient(135deg, ${mode.color}30, ${mode.color}15)`,
                      border: `1px solid ${mode.color}60`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: mode.color,
                      boxShadow: `0 0 15px ${mode.bgGlow}`,
                    }}
                  >
                    <Icon size={24} />
                  </div>

                  <div>
                    <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#ffffff' }}>
                      {mode.title}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>
                      {mode.subtitle}
                    </div>
                    {mode.best > 0 && (
                      <div
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          color: '#fbbf24',
                          marginTop: '4px',
                        }}
                      >
                        Best: {mode.best.toLocaleString()} pts
                      </div>
                    )}
                  </div>
                </div>

                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: mode.color,
                  }}
                >
                  <ArrowRight size={16} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ModeSelectModal;
