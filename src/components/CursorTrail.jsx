import React, { useEffect, useRef } from 'react';

/**
 * Modern Arcade Glow Cursor Trail & Sparkle Particle Engine
 * Creates luminous glowing trails and click sparkles following the mouse pointer.
 */
export function CursorTrail() {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: -100, y: -100, isMoving: false, lastSpawn: 0 });
  const animFrameRef = useRef(null);

  const colors = ['#38bdf8', '#818cf8', '#c084fc', '#f472b6', '#34d399', '#fbbf24'];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e) => {
      const now = performance.now();
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.isMoving = true;

      // Spawn particles on cursor movement (rate-limited for smooth performance)
      if (now - mouseRef.current.lastSpawn > 16) {
        mouseRef.current.lastSpawn = now;
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        particlesRef.current.push({
          x: e.clientX + (Math.random() - 0.5) * 8,
          y: e.clientY + (Math.random() - 0.5) * 8,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5 - 0.5,
          size: 4 + Math.random() * 4.5,
          color,
          alpha: 0.9,
          life: 0,
          maxLife: 28 + Math.random() * 15,
          isCube: Math.random() > 0.4,
          rot: Math.random() * 360,
          vRot: (Math.random() - 0.5) * 8,
        });
      }
    };

    const handlePointerDown = (e) => {
      // Burst of sparkles on click/tap
      for (let i = 0; i < 12; i++) {
        const angle = (Math.PI * 2 * i) / 12 + (Math.random() - 0.5) * 0.5;
        const speed = 2 + Math.random() * 4;
        const color = colors[Math.floor(Math.random() * colors.length)];

        particlesRef.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 5 + Math.random() * 4,
          color,
          alpha: 1,
          life: 0,
          maxLife: 32 + Math.random() * 10,
          isCube: true,
          rot: Math.random() * 360,
          vRot: (Math.random() - 0.5) * 14,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('pointerdown', handlePointerDown);

    // Animation Loop
    const render = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.04; // subtle gravity
        p.rot += p.vRot;
        p.alpha = Math.max(0, 1 - p.life / p.maxLife);

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;

        if (p.isCube) {
          // Mini glowing 3D-like block
          const s = p.size * (1 - p.life / p.maxLife * 0.3);
          ctx.beginPath();
          ctx.roundRect(-s / 2, -s / 2, s, s, 2);
          ctx.fill();

          // Highlight
          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.fillRect(-s / 2 + 1, -s / 2 + 1, s - 2, s * 0.35);
        } else {
          // Sparkle circle
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.6, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();

        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9990,
      }}
    />
  );
}

export default CursorTrail;
