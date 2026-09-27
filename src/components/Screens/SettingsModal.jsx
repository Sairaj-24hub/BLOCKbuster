import React, { useState } from 'react';
import { X, Volume2, VolumeX, Music, Eye, User, Trash2, AlertTriangle, Sparkles, Film, Grid } from 'lucide-react';
import { soundManager } from '../../utils/audioSystem';

export function SettingsModal({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  profile,
  onEditUsername,
  onResetAllData,
}) {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop-overlay">
      <div
        className="modal-glass-container"
        style={{
          width: '100%',
          maxWidth: '460px',
          maxHeight: '90vh',
          overflowY: 'auto',
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
            marginBottom: '18px',
          }}
        >
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '900', margin: 0 }}>SETTINGS</h2>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
              Customization, visuals & audio controls
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

        {/* Settings List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
          {/* Player Profile Edit */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.3rem' }}>{profile?.avatar || '👾'}</span>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: '700' }}>{profile?.username || 'Player 1'}</div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Player Profile</div>
              </div>
            </div>
            <button
              onClick={() => {
                soundManager.playClick();
                onEditUsername();
              }}
              style={{
                padding: '5px 12px',
                borderRadius: '10px',
                background: 'rgba(99, 102, 241, 0.2)',
                border: '1px solid rgba(99, 102, 241, 0.4)',
                color: '#a5b4fc',
                fontSize: '0.78rem',
                fontWeight: '700',
                cursor: 'pointer',
              }}
            >
              Change
            </button>
          </div>

          {/* Starter Obstacle Density Selector */}
          <div
            style={{
              padding: '12px 14px',
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Grid size={18} color="#f59e0b" />
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: '700' }}>Starter Obstacles & Difficulty</div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Pre-placed blocks at match start</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
              {[
                { id: 'NONE', label: 'Empty' },
                { id: 'LIGHT', label: 'Light' },
                { id: 'MEDIUM', label: 'Medium' },
                { id: 'HARDCORE', label: 'Hardcore' },
              ].map(opt => {
                const isSelected = (settings.starterObstacles || 'MEDIUM') === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => {
                      soundManager.playClick();
                      onUpdateSettings({ ...settings, starterObstacles: opt.id });
                    }}
                    style={{
                      padding: '7px 4px',
                      borderRadius: '10px',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      border: isSelected ? '1px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.08)',
                      background: isSelected ? 'rgba(245, 158, 11, 0.25)' : 'rgba(255, 255, 255, 0.03)',
                      color: isSelected ? '#fbbf24' : '#94a3b8',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cursor Trail Effect Toggle */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sparkles size={18} color={settings.enableCursorTrail !== false ? '#ec4899' : '#64748b'} />
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: '700' }}>Arcade Cursor Trail</div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Glowing spark particles</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.enableCursorTrail !== false}
              onChange={e => {
                soundManager.playClick();
                onUpdateSettings({ ...settings, enableCursorTrail: e.target.checked });
              }}
              className="toggle-switch"
            />
          </div>

          {/* Background Video Toggle */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Film size={18} color={settings.enableBgVideo !== false ? '#38bdf8' : '#64748b'} />
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: '700' }}>Background Video Loop</div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Cinematic falling visual backdrop</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.enableBgVideo !== false}
              onChange={e => {
                soundManager.playClick();
                onUpdateSettings({ ...settings, enableBgVideo: e.target.checked });
              }}
              className="toggle-switch"
            />
          </div>

          {/* Sound Effects Toggle */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {settings.sfxEnabled ? <Volume2 size={18} color="#38bdf8" /> : <VolumeX size={18} color="#64748b" />}
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: '700' }}>Sound Effects</div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Block drops, clears, combos</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.sfxEnabled}
              onChange={e => {
                soundManager.playClick();
                onUpdateSettings({ ...settings, sfxEnabled: e.target.checked });
              }}
              className="toggle-switch"
            />
          </div>

          {/* Music Toggle */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Music size={18} color={settings.bgmEnabled ? '#a855f7' : '#64748b'} />
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: '700' }}>Ambient Music</div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Procedural synth harmony</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.bgmEnabled}
              onChange={e => {
                soundManager.playClick();
                onUpdateSettings({ ...settings, bgmEnabled: e.target.checked });
              }}
              className="toggle-switch"
            />
          </div>

          {/* 3D Perspective Tilt Toggle */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Eye size={18} color={settings.perspective3D ? '#10b981' : '#64748b'} />
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: '700' }}>3D Board Perspective</div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Isometric angle & depth</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.perspective3D}
              onChange={e => {
                soundManager.playClick();
                onUpdateSettings({ ...settings, perspective3D: e.target.checked });
              }}
              className="toggle-switch"
            />
          </div>
        </div>

        {/* Reset Local Data Section */}
        {!showResetConfirm ? (
          <button
            onClick={() => {
              soundManager.playClick();
              setShowResetConfirm(true);
            }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '10px',
              borderRadius: '12px',
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              color: '#f87171',
              fontSize: '0.82rem',
              fontWeight: '700',
              cursor: 'pointer',
            }}
          >
            <Trash2 size={15} /> Reset Local High Scores & Profile
          </button>
        ) : (
          <div
            style={{
              padding: '14px',
              borderRadius: '14px',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                color: '#ef4444',
                fontWeight: '700',
                fontSize: '0.88rem',
                marginBottom: '6px',
              }}
            >
              <AlertTriangle size={16} /> Are you sure?
            </div>
            <p style={{ fontSize: '0.75rem', color: '#fca5a5', margin: '0 0 10px 0' }}>
              This will permanently delete your personal best records and local stats.
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => {
                  soundManager.playClick();
                  onResetAllData();
                  setShowResetConfirm(false);
                }}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '10px',
                  background: '#ef4444',
                  border: 'none',
                  color: '#fff',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                Yes, Reset Everything
              </button>
              <button
                onClick={() => {
                  soundManager.playClick();
                  setShowResetConfirm(false);
                }}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  color: '#fff',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SettingsModal;
