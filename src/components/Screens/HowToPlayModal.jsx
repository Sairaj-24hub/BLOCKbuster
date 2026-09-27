import React from 'react';
import { X, MousePointerClick, Grid, Sparkles, Flame, CheckCircle, Trophy } from 'lucide-react';
import { soundManager } from '../../utils/audioSystem';

export function HowToPlayModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const steps = [
    {
      icon: MousePointerClick,
      color: '#38bdf8',
      title: '1. Drag & Place Blocks',
      desc: 'Pick up any of the 3 available polyomino blocks at the bottom and drag them onto the 10×10 grid.',
    },
    {
      icon: Grid,
      color: '#a855f7',
      title: '2. Fill Complete Lines',
      desc: 'Form complete horizontal rows or vertical columns across the grid. No gaps allowed!',
    },
    {
      icon: Sparkles,
      color: '#10b981',
      title: '3. Clear & Burst Cubes',
      desc: 'Completed lines shatter into 3D cube particles, freeing up board space and awarding points.',
    },
    {
      icon: Flame,
      color: '#f43f5e',
      title: '4. Chain Combos & Streaks',
      desc: 'Clear multiple lines simultaneously or on consecutive turns to multiply your score up to 5×!',
    },
    {
      icon: Trophy,
      color: '#fbbf24',
      title: '5. Endless Strategy',
      desc: 'Plan ahead! The match ends when none of the 3 available blocks can legally fit anywhere on the board.',
    },
  ];

  return (
    <div className="modal-backdrop-overlay">
      <div
        className="modal-glass-container"
        style={{
          width: '100%',
          maxWidth: '480px',
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
            marginBottom: '18px',
          }}
        >
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '900', margin: 0 }}>HOW TO PLAY</h2>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
              Master the art of block placement
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

        {/* Tutorial Cards List */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            paddingRight: '4px',
            marginBottom: '18px',
          }}
        >
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px',
                  padding: '14px',
                  borderRadius: '16px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                }}
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '12px',
                    background: `${step.color}20`,
                    border: `1px solid ${step.color}50`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: step.color,
                    flexShrink: 0,
                  }}
                >
                  <Icon size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.98rem', fontWeight: '800', color: '#ffffff' }}>
                    {step.title}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '3px', lineHeight: 1.4 }}>
                    {step.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => {
            soundManager.playClick();
            onClose();
          }}
          className="btn-primary-glow"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            width: '100%',
            padding: '13px',
            fontSize: '1rem',
            fontWeight: '800',
            color: '#ffffff',
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            border: 'none',
            borderRadius: '14px',
            cursor: 'pointer',
          }}
        >
          <CheckCircle size={18} /> GOT IT, LET'S PLAY!
        </button>
      </div>
    </div>
  );
}

export default HowToPlayModal;
