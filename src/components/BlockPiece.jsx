import React from 'react';

/**
 * 3D Isometric Block Piece
 * Renders high-fidelity polyomino shapes with multi-layer depth, specular highlights, and ambient glow.
 */
export function BlockPiece({
  block,
  cellSize = 28,
  gap = 4,
  isDragging = false,
  isGhost = false,
  isValid = true,
  opacity = 1,
}) {
  if (!block || !block.matrix) return null;

  const matrix = block.matrix;
  const rows = matrix.length;
  const cols = matrix[0].length;
  const width = cols * cellSize + (cols - 1) * gap;
  const height = rows * cellSize + (rows - 1) * gap;

  // Color schemes for ghost/valid/invalid
  let baseColor = block.color;
  let topColor = block.topColor || '#fff';
  let glowColor = block.glow || 'rgba(56, 189, 248, 0.4)';

  if (isGhost) {
    if (isValid) {
      baseColor = '#10b981';
      topColor = '#6ee7b7';
      glowColor = 'rgba(16, 185, 129, 0.6)';
    } else {
      baseColor = '#ef4444';
      topColor = '#fca5a5';
      glowColor = 'rgba(239, 68, 68, 0.6)';
    }
  }

  return (
    <div
      className="block-piece-container"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        position: 'relative',
        opacity: isGhost ? 0.75 : opacity,
        transform: isDragging ? 'scale(1.08) translateY(-10px)' : 'scale(1)',
        transition: isDragging ? 'none' : 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
        filter: isDragging
          ? `drop-shadow(0 14px 22px rgba(0,0,0,0.65)) drop-shadow(0 0 16px ${glowColor})`
          : `drop-shadow(0 4px 10px rgba(0,0,0,0.4))`,
        userSelect: 'none',
        pointerEvents: 'none',
      }}
    >
      {matrix.map((row, rIdx) =>
        row.map((cell, cIdx) => {
          if (cell !== 1) return null;

          const top = rIdx * (cellSize + gap);
          const left = cIdx * (cellSize + gap);

          return (
            <div
              key={`${rIdx}-${cIdx}`}
              className="cube-3d-cell"
              style={{
                position: 'absolute',
                top: `${top}px`,
                left: `${left}px`,
                width: `${cellSize}px`,
                height: `${cellSize}px`,
                borderRadius: `${Math.max(4, Math.floor(cellSize * 0.2))}px`,
                backgroundColor: baseColor,
                background: `linear-gradient(135deg, ${topColor} 0%, ${baseColor} 55%, ${block.frontColor || baseColor} 100%)`,
                boxShadow: isGhost
                  ? `0 0 12px ${glowColor}, inset 0 2px 3px rgba(255,255,255,0.7)`
                  : `0 4px 6px -1px rgba(0, 0, 0, 0.5), inset 0 2px 4px rgba(255, 255, 255, 0.65), inset 0 -3px 4px rgba(0, 0, 0, 0.45)`,
                border: isGhost ? (isValid ? '2px solid #34d399' : '2px solid #f87171') : '1px solid rgba(255,255,255,0.25)',
                transition: 'all 0.15s ease-out',
              }}
            >
              {/* Top bevel highlight reflection */}
              <div
                style={{
                  position: 'absolute',
                  top: '2px',
                  left: '3px',
                  right: '3px',
                  height: `${Math.floor(cellSize * 0.28)}px`,
                  borderRadius: `${Math.max(2, Math.floor(cellSize * 0.12))}px`,
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.05) 100%)',
                  pointerEvents: 'none',
                }}
              />
            </div>
          );
        })
      )}
    </div>
  );
}

export default BlockPiece;
