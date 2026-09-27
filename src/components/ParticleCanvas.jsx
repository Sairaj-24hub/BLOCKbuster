import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

/**
 * 3D Particle & Floating Score Canvas Engine
 * Renders high-fps flying 3D cubes, spark effects, and dynamic arcade score popups.
 */
const ParticleCanvas = forwardRef((props, ref) => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const textPopupsRef = useRef([]);
  const animFrameRef = useRef(null);

  useImperativeHandle(ref, () => ({
    // Spawn 3D cube particles at cell coordinates
    spawnLineParticles(clearedCells, color = '#38bdf8') {
      const canvas = canvasRef.current;
      if (!canvas) return;

      clearedCells.forEach(cell => {
        const count = 7; // particles per cleared cell
        for (let i = 0; i < count; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 2.5 + Math.random() * 6.5;
          const size = 5 + Math.random() * 8;

          particlesRef.current.push({
            x: cell.x,
            y: cell.y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - (2 + Math.random() * 4), // initial upward pop
            gravity: 0.28,
            size,
            rotX: Math.random() * 360,
            rotY: Math.random() * 360,
            vRotX: (Math.random() - 0.5) * 12,
            vRotY: (Math.random() - 0.5) * 12,
            color: cell.color || color,
            alpha: 1.0,
            life: 0,
            maxLife: 35 + Math.random() * 25,
          });
        }
      });
    },

    // Spawn floating score & combo text
    spawnScoreText(x, y, text, subtext = null, color = '#38bdf8') {
      textPopupsRef.current.push({
        x,
        y: y - 20,
        text,
        subtext,
        color,
        alpha: 1.0,
        scale: 0.6,
        targetScale: 1.25,
        vy: -2.2,
        life: 0,
        maxLife: 45,
      });
    },
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Main animation loop
    const render = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      // 1. Render 3D Cube Particles
      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.rotX += p.vRotX;
        p.rotY += p.vRotY;
        p.alpha = Math.max(0, 1 - p.life / p.maxLife);

        // Draw 3D-styled isometric mini cube
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.globalAlpha = p.alpha;

        const radX = (p.rotX * Math.PI) / 180;
        const radY = (p.rotY * Math.PI) / 180;
        const cosX = Math.cos(radX);
        const cosY = Math.cos(radY);

        const w = p.size * (0.6 + 0.4 * Math.abs(cosY));
        const h = p.size * (0.6 + 0.4 * Math.abs(cosX));

        // Cube Body
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.roundRect(-w / 2, -h / 2, w, h, 2);
        ctx.fill();

        // Top Highlight Face
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.beginPath();
        ctx.roundRect(-w / 2, -h / 2, w, h * 0.35, 1);
        ctx.fill();

        ctx.restore();

        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
        }
      }

      // 2. Render Floating Text Popups
      const texts = textPopupsRef.current;
      for (let i = texts.length - 1; i >= 0; i--) {
        const t = texts[i];
        t.life++;
        t.y += t.vy;
        t.vy *= 0.94; // friction
        t.scale += (t.targetScale - t.scale) * 0.2;
        if (t.life > t.maxLife * 0.5) {
          t.alpha = Math.max(0, 1 - (t.life - t.maxLife * 0.5) / (t.maxLife * 0.5));
        }

        ctx.save();
        ctx.translate(t.x, t.y);
        ctx.scale(t.scale, t.scale);
        ctx.globalAlpha = t.alpha;

        // Text Shadow Glow
        ctx.shadowColor = t.color;
        ctx.shadowBlur = 14;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Main Points Text
        ctx.font = '900 24px "Outfit", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(t.text, 0, 0);

        // Subtext (e.g. "COMBO x3!")
        if (t.subtext) {
          ctx.font = '800 14px "Space Grotesk", sans-serif';
          ctx.fillStyle = t.color;
          ctx.shadowBlur = 8;
          ctx.fillText(t.subtext, 0, 22);
        }

        ctx.restore();

        if (t.life >= t.maxLife) {
          texts.splice(i, 1);
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 50,
      }}
    />
  );
});

export default ParticleCanvas;
