import React, { useEffect, useRef, useState } from 'react';

/**
 * Immersive Background Effect with Video Loop & Falling 3D Arcade Blocks
 */
export function BackgroundEffect({ showVideo = true, showFallingParticles = true }) {
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const fallingCubesRef = useRef([]);
  const [videoError, setVideoError] = useState(false);

  // Colors for falling polyomino blocks
  const colors = [
    { base: '#06b6d4', top: '#67e8f9', front: '#0891b2' },
    { base: '#10b981', top: '#6ee7b7', front: '#059669' },
    { base: '#84cc16', top: '#bef264', front: '#65a30d' },
    { base: '#eab308', top: '#fde047', front: '#ca8a04' },
    { base: '#f97316', top: '#fdba74', front: '#ea580c' },
    { base: '#3b82f6', top: '#93c5fd', front: '#2563eb' },
    { base: '#a855f7', top: '#d8b4fe', front: '#9333ea' },
    { base: '#ec4899', top: '#f472b6', front: '#db2777' },
  ];

  // Initialize falling cubes
  useEffect(() => {
    if (!showFallingParticles) return;
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

    // Seed 25 falling polyomino shapes / cubes
    const count = 25;
    fallingCubesRef.current = [];
    for (let i = 0; i < count; i++) {
      const colorScheme = colors[Math.floor(Math.random() * colors.length)];
      const size = 12 + Math.random() * 20;
      fallingCubesRef.current.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vy: 0.6 + Math.random() * 1.6,
        vx: (Math.random() - 0.5) * 0.4,
        size,
        color: colorScheme,
        rot: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 1.5,
        alpha: 0.15 + Math.random() * 0.25,
        shapeType: Math.floor(Math.random() * 3), // 0: single, 1: double, 2: L-shape
      });
    }

    const render = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      ctx.clearRect(0, 0, width, height);

      const cubes = fallingCubesRef.current;
      for (let i = 0; i < cubes.length; i++) {
        const c = cubes[i];
        c.y += c.vy;
        c.x += c.vx;
        c.rot += c.vRot;

        // Wrap around bottom
        if (c.y > height + 50) {
          c.y = -50;
          c.x = Math.random() * width;
        }
        if (c.x < -50) c.x = width + 50;
        if (c.x > width + 50) c.x = -50;

        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate((c.rot * Math.PI) / 180);
        ctx.globalAlpha = c.alpha;

        const s = c.size;

        if (c.shapeType === 0) {
          // Single 3D Cube
          draw3DCube(ctx, 0, 0, s, c.color);
        } else if (c.shapeType === 1) {
          // 2-Bar
          draw3DCube(ctx, -s * 0.55, 0, s, c.color);
          draw3DCube(ctx, s * 0.55, 0, s, c.color);
        } else {
          // Corner / L-mini
          draw3DCube(ctx, -s * 0.5, -s * 0.5, s, c.color);
          draw3DCube(ctx, -s * 0.5, s * 0.5, s, c.color);
          draw3DCube(ctx, s * 0.5, s * 0.5, s, c.color);
        }

        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [showFallingParticles]);

  // Helper to render 3D-styled mini cube
  const draw3DCube = (ctx, x, y, size, color) => {
    ctx.save();
    ctx.translate(x, y);

    // Main Face
    ctx.fillStyle = color.base;
    ctx.beginPath();
    ctx.roundRect(-size / 2, -size / 2, size, size, Math.max(2, size * 0.18));
    ctx.fill();

    // Top Highlight Face
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.beginPath();
    ctx.roundRect(-size / 2, -size / 2, size, size * 0.32, Math.max(1, size * 0.12));
    ctx.fill();

    ctx.restore();
  };

  return (
    <div
      className="background-effect-layer"
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      {/* Background Video */}
      {showVideo && !videoError && (
        <video
          autoPlay
          loop
          muted
          playsInline
          onError={() => setVideoError(true)}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: 'translate(-50%, -50%)',
            opacity: 0.35,
            filter: 'saturate(1.4) brightness(0.7) contrast(1.1)',
            transition: 'opacity 1s ease',
          }}
        >
          <source src="/background-video.mp4" type="video/mp4" />
        </video>
      )}

      {/* Dark Ambient Gradient Overlay for high-contrast gameplay visibility */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 50% 30%, rgba(12, 16, 36, 0.7) 0%, rgba(7, 9, 19, 0.92) 65%, #050711 100%)',
        }}
      />

      {/* Falling 3D Polyomino Cubes Canvas */}
      {showFallingParticles && (
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
          }}
        />
      )}
    </div>
  );
}

export default BackgroundEffect;
