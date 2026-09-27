import React, { useState, useEffect } from 'react';
import { X, Trophy, Flame, Infinity as InfinityIcon, Calendar, Globe } from 'lucide-react';
import { getLeaderboard } from '../../utils/storage';
import { soundManager } from '../../utils/audioSystem';

export function LeaderboardModal({ isOpen, onClose, currentMode = 'CLASSIC', currentUsername = '' }) {
  const [activeMode, setActiveMode] = useState(currentMode || 'CLASSIC');
  const [timeFilter, setTimeFilter] = useState('ALL_TIME'); // 'TODAY' | 'ALL_TIME'
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    if (isOpen) {
      const data = getLeaderboard(activeMode, timeFilter);
      setEntries(data);
    }
  }, [isOpen, activeMode, timeFilter]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop-overlay">
      <div
        className="modal-glass-container"
        style={{
          width: '100%',
          maxWidth: '520px',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(145deg, rgba(20, 26, 46, 0.98) 0%, rgba(10, 14, 28, 0.99) 100%)',
          borderRadius: '26px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.85), 0 0 35px rgba(99, 102, 241, 0.25)',
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
            marginBottom: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'rgba(251, 191, 36, 0.15)',
                border: '1px solid rgba(251, 191, 36, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fbbf24',
              }}
            >
              <Trophy size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: '900', margin: 0 }}>LEADERBOARD</h2>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
                Global & Arcade Rankings
              </p>
            </div>
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

        {/* Mode Selector Tabs */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px',
            marginBottom: '14px',
          }}
        >
          {[
            { id: 'CLASSIC', label: 'Classic', icon: Trophy, color: '#6366f1' },
            { id: 'TIME_ATTACK', label: 'Time Attack', icon: Flame, color: '#f43f5e' },
            { id: 'ENDLESS', label: 'Endless', icon: InfinityIcon, color: '#10b981' },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeMode === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => {
                  soundManager.playClick();
                  setActiveMode(tab.id);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '9px 6px',
                  borderRadius: '12px',
                  fontSize: '0.82rem',
                  fontWeight: '700',
                  color: isActive ? '#ffffff' : '#94a3b8',
                  background: isActive ? `${tab.color}35` : 'rgba(255, 255, 255, 0.04)',
                  border: isActive ? `1px solid ${tab.color}` : '1px solid rgba(255, 255, 255, 0.06)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <Icon size={14} color={isActive ? tab.color : '#94a3b8'} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Time Filters: Today | All Time */}
        <div
          style={{
            display: 'flex',
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '10px',
            padding: '3px',
            marginBottom: '16px',
          }}
        >
          <button
            onClick={() => {
              soundManager.playClick();
              setTimeFilter('ALL_TIME');
            }}
            style={{
              flex: 1,
              padding: '6px',
              borderRadius: '8px',
              fontSize: '0.78rem',
              fontWeight: '700',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              background: timeFilter === 'ALL_TIME' ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
              color: timeFilter === 'ALL_TIME' ? '#ffffff' : '#94a3b8',
            }}
          >
            <Globe size={13} /> ALL TIME
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              setTimeFilter('TODAY');
            }}
            style={{
              flex: 1,
              padding: '6px',
              borderRadius: '8px',
              fontSize: '0.78rem',
              fontWeight: '700',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              background: timeFilter === 'TODAY' ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
              color: timeFilter === 'TODAY' ? '#ffffff' : '#94a3b8',
            }}
          >
            <Calendar size={13} /> TODAY
          </button>
        </div>

        {/* Scrollable Leaderboard List */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            paddingRight: '4px',
          }}
        >
          {entries.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 10px', color: '#64748b' }}>
              No scores recorded yet for this filter. Be the first to set a record!
            </div>
          ) : (
            entries.map(entry => {
              const isCurrentPlayer = entry.isLocalPlayer && entry.username === currentUsername;

              // Rank Badges
              let rankBadge = `#${entry.rank}`;
              let rankColor = '#94a3b8';
              let rankBg = 'rgba(255, 255, 255, 0.05)';

              if (entry.rank === 1) {
                rankBadge = '🥇';
                rankColor = '#fbbf24';
                rankBg = 'rgba(251, 191, 36, 0.2)';
              } else if (entry.rank === 2) {
                rankBadge = '🥈';
                rankColor = '#e2e8f0';
                rankBg = 'rgba(226, 232, 240, 0.2)';
              } else if (entry.rank === 3) {
                rankBadge = '🥉';
                rankColor = '#f97316';
                rankBg = 'rgba(249, 115, 22, 0.2)';
              }

              return (
                <div
                  key={entry.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '14px',
                    background: isCurrentPlayer
                      ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(168, 85, 247, 0.2) 100%)'
                      : 'rgba(255, 255, 255, 0.03)',
                    border: isCurrentPlayer
                      ? '1px solid rgba(99, 102, 241, 0.6)'
                      : '1px solid rgba(255, 255, 255, 0.05)',
                    boxShadow: isCurrentPlayer ? '0 0 12px rgba(99, 102, 241, 0.2)' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '10px',
                        background: rankBg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: entry.rank <= 3 ? '1.1rem' : '0.85rem',
                        fontWeight: '800',
                        color: rankColor,
                      }}
                    >
                      {rankBadge}
                    </div>

                    <div>
                      <div
                        style={{
                          fontSize: '0.92rem',
                          fontWeight: isCurrentPlayer ? '800' : '700',
                          color: isCurrentPlayer ? '#38bdf8' : '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        {entry.username}
                        {isCurrentPlayer && (
                          <span
                            style={{
                              fontSize: '0.65rem',
                              padding: '1px 5px',
                              background: '#6366f1',
                              borderRadius: '4px',
                              color: '#fff',
                            }}
                          >
                            YOU
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '1px' }}>
                        {entry.lines} lines • {entry.date}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div
                      style={{
                        fontSize: '1.05rem',
                        fontWeight: '900',
                        fontFamily: '"Space Grotesk", sans-serif',
                        color: entry.rank === 1 ? '#fbbf24' : '#ffffff',
                      }}
                    >
                      {entry.score.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#f59e0b', fontWeight: '700' }}>
                      {entry.combo > 1 ? `×${entry.combo} Combo` : ''}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default LeaderboardModal;
