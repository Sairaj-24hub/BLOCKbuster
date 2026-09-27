import React, { forwardRef } from 'react';
import { GAME_CONFIG } from '../constants/gameConfig';

/**
 * 10x10 3D Game Board Component
 * Features perspective depth, dynamic cell lighting, ghost block preview, and line clear animations.
 */
const GameBoard = forwardRef(
  (
    {
      board,
      clearingRows = [],
      clearingCols = [],
      ghostPosition = null, // { row, col, block, isValid }
      cellSize = 38,
      gap = 5,
      isShaking = false,
      perspective3D = true,
    },
    ref
  ) => {
    const size = GAME_CONFIG.BOARD_SIZE;

    // Check if cell is part of clearing lines
    const isCellClearing = (r, c) => {
      return clearingRows.includes(r) || clearingCols.includes(c);
    };

    // Check if cell is covered by the current ghost placement preview
    const getGhostCellInfo = (r, c) => {
      if (!ghostPosition || !ghostPosition.block) return null;
      const { row: gRow, col: gCol, block, isValid } = ghostPosition;
      const matrix = block.matrix;
      const bRows = matrix.length;
      const bCols = matrix[0].length;

      if (r >= gRow && r < gRow + bRows && c >= gCol && c < gCol + bCols) {
        const localR = r - gRow;
        const localC = c - gCol;
        if (matrix[localR][localC] === 1) {
          return {
            isValid,
            color: block.color,
            topColor: block.topColor,
            glow: block.glow,
          };
        }
      }
      return null;
    };

    return (
      <div
        ref={ref}
        id="game-board-container"
        className={`game-board-wrapper ${isShaking ? 'board-screen-shake' : ''}`}
        style={{
          perspective: perspective3D ? '1000px' : 'none',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          touchAction: 'none',
          userSelect: 'none',
        }}
      >
        <div
          className="game-board-surface"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${size}, ${cellSize}px)`,
            gridTemplateRows: `repeat(${size}, ${cellSize}px)`,
            gap: `${gap}px`,
            padding: '14px',
            borderRadius: '24px',
            background: 'linear-gradient(145deg, rgba(20, 24, 39, 0.92) 0%, rgba(10, 13, 24, 0.96) 100%)',
            boxShadow:
              '0 24px 50px -12px rgba(0, 0, 0, 0.7), inset 0 1px 1px 0 rgba(255, 255, 255, 0.1), inset 0 -4px 8px rgba(0, 0, 0, 0.8), 0 0 40px rgba(99, 102, 241, 0.12)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(20px)',
            transform: perspective3D ? 'rotateX(8deg) translateY(-4px)' : 'none',
            transformOrigin: 'center bottom',
            transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
            position: 'relative',
          }}
        >
          {/* Subtle grid line ambient glow */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '24px',
              background: 'radial-gradient(circle at 50% 30%, rgba(99, 102, 241, 0.15), transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          {board.map((rowArr, r) =>
            rowArr.map((cell, c) => {
              const clearing = isCellClearing(r, c);
              const ghost = getGhostCellInfo(r, c);
              const isOccupied = cell !== null;

              return (
                <div
                  key={`${r}-${c}`}
                  data-row={r}
                  data-col={c}
                  className={`board-cell ${clearing ? 'cell-clearing-anim' : ''}`}
                  style={{
                    width: `${cellSize}px`,
                    height: `${cellSize}px`,
                    borderRadius: `${Math.max(4, Math.floor(cellSize * 0.2))}px`,
                    position: 'relative',
                    transition: 'all 0.12s ease-out',
                    // Default empty cell styling
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.04)',
                    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.6)',
                  }}
                >
                  {/* Occupied 3D Block Cell */}
                  {isOccupied && (
                    <div
                      className="occupied-cube"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: `${Math.max(4, Math.floor(cellSize * 0.2))}px`,
                        backgroundColor: cell.color,
                        background: `linear-gradient(135deg, ${cell.topColor || '#fff'} 0%, ${cell.color} 50%, ${cell.frontColor || cell.color} 100%)`,
                        boxShadow: `0 4px 8px rgba(0, 0, 0, 0.5), inset 0 2px 3px rgba(255, 255, 255, 0.7), inset 0 -3px 4px rgba(0, 0, 0, 0.45)`,
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        transform: clearing ? 'scale(1.15)' : 'scale(1)',
                        filter: clearing
                          ? 'brightness(2.2) drop-shadow(0 0 16px #ffffff)'
                          : `drop-shadow(0 2px 6px ${cell.glow || 'rgba(0,0,0,0.3)'})`,
                        transition: 'all 0.15s ease-out',
                      }}
                    >
                      {/* Top Specular Reflection */}
                      <div
                        style={{
                          position: 'absolute',
                          top: '2px',
                          left: '3px',
                          right: '3px',
                          height: `${Math.floor(cellSize * 0.26)}px`,
                          borderRadius: `${Math.max(2, Math.floor(cellSize * 0.12))}px`,
                          background:
                            'linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.05) 100%)',
                          pointerEvents: 'none',
                        }}
                      />
                    </div>
                  )}

                  {/* Ghost Placement Highlight */}
                  {!isOccupied && ghost && (
                    <div
                      className="ghost-cell-preview"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: `${Math.max(4, Math.floor(cellSize * 0.2))}px`,
                        backgroundColor: ghost.isValid
                          ? 'rgba(16, 185, 129, 0.45)'
                          : 'rgba(239, 68, 68, 0.45)',
                        border: ghost.isValid
                          ? '2px solid #34d399'
                          : '2px solid #f87171',
                        boxShadow: ghost.isValid
                          ? '0 0 12px rgba(16, 185, 129, 0.6), inset 0 0 6px rgba(16, 185, 129, 0.4)'
                          : '0 0 12px rgba(239, 68, 68, 0.6), inset 0 0 6px rgba(239, 68, 68, 0.4)',
                        animation: 'pulsePreview 1.2s infinite ease-in-out',
                      }}
                    />
                  )}

                  {/* Line clear glowing beam effect */}
                  {clearing && (
                    <div
                      style={{
                        position: 'absolute',
                        inset: '-2px',
                        borderRadius: `${Math.max(4, Math.floor(cellSize * 0.2))}px`,
                        background: '#ffffff',
                        boxShadow: '0 0 20px #ffffff, 0 0 40px #60a5fa',
                        zIndex: 10,
                        animation: 'clearPulse 0.3s ease-out forwards',
                      }}
                    />
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  }
);

export default GameBoard;
