import React, { useState } from 'react';
import { User, Sparkles, Check } from 'lucide-react';
import { soundManager } from '../../utils/audioSystem';

const AVATARS = ['👾', '🚀', '💎', '⚡', '👑', '🔥', '🎮', '🧩', '🎯', '🌟'];

export function UsernameModal({ isOpen, initialName = '', onSave, canClose = false, onClose = () => {} }) {
  const [name, setName] = useState(initialName || '');
  const [selectedAvatar, setSelectedAvatar] = useState('👾');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = e => {
    e.preventDefault();
    const clean = name.trim();
    if (clean.length < 2) {
      setError('Username must be at least 2 characters long.');
      soundManager.playInvalid();
      return;
    }
    if (clean.length > 16) {
      setError('Username cannot exceed 16 characters.');
      soundManager.playInvalid();
      return;
    }

    soundManager.playClick();
    onSave(clean, selectedAvatar);
  };

  return (
    <div className="modal-backdrop-overlay">
      <div
        className="modal-glass-container"
        style={{
          width: '100%',
          maxWidth: '420px',
          background: 'linear-gradient(145deg, rgba(20, 26, 46, 0.98) 0%, rgba(10, 14, 28, 0.99) 100%)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(99, 102, 241, 0.25)',
          padding: '28px',
          color: '#ffffff',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.8rem',
            margin: '0 auto 16px auto',
            boxShadow: '0 8px 20px rgba(99, 102, 241, 0.4)',
          }}
        >
          {selectedAvatar}
        </div>

        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: '0 0 6px 0' }}>
          Welcome to BLOCKBUSTERS
        </h2>
        <p style={{ fontSize: '0.88rem', color: '#94a3b8', margin: '0 0 20px 0' }}>
          Choose your player profile and enter the arcade
        </p>

        {/* Avatar selector */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', marginBottom: '8px' }}>
            SELECT AVATAR
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '8px',
            }}
          >
            {AVATARS.map(avatar => (
              <button
                key={avatar}
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setSelectedAvatar(avatar);
                }}
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '12px',
                  fontSize: '1.2rem',
                  background: selectedAvatar === avatar ? 'rgba(99, 102, 241, 0.4)' : 'rgba(255, 255, 255, 0.05)',
                  border:
                    selectedAvatar === avatar
                      ? '2px solid #6366f1'
                      : '1px solid rgba(255, 255, 255, 0.1)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s ease',
                  transform: selectedAvatar === avatar ? 'scale(1.15)' : 'scale(1)',
                }}
              >
                {avatar}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '18px', textAlign: 'left' }}>
            <label
              htmlFor="username-input"
              style={{
                display: 'block',
                fontSize: '0.75rem',
                fontWeight: '700',
                color: '#94a3b8',
                marginBottom: '6px',
                letterSpacing: '0.05em',
              }}
            >
              PLAYER USERNAME
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="username-input"
                type="text"
                value={name}
                onChange={e => {
                  setName(e.target.value);
                  setError('');
                }}
                placeholder="Enter your name (e.g. Sairaj)"
                maxLength={16}
                autoFocus
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 40px',
                  borderRadius: '14px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: error ? '1px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#ffffff',
                  fontSize: '1rem',
                  fontWeight: '600',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              <User
                size={18}
                color="#94a3b8"
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>
            {error && (
              <div style={{ color: '#f87171', fontSize: '0.78rem', marginTop: '6px', fontWeight: '500' }}>
                {error}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="btn-primary-glow"
            style={{
              width: '100%',
              padding: '14px',
              fontSize: '1.05rem',
              fontWeight: '800',
              color: '#ffffff',
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
              border: 'none',
              borderRadius: '16px',
              cursor: 'pointer',
              boxShadow: '0 8px 20px rgba(99, 102, 241, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <Check size={20} /> START PLAYING
          </button>
        </form>
      </div>
    </div>
  );
}

export default UsernameModal;
