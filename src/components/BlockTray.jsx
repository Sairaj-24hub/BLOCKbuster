import React, { useRef, useState, useEffect, useCallback } from 'react';
import BlockPiece from './BlockPiece';
import { canPlaceBlock } from '../utils/boardLogic';
import { soundManager } from '../utils/audioSystem';

/**
 * 3-Slot Block Tray with Drag & Drop System
 * Supports both mouse drag and touch swipe with finger-offset ergonomics.
 */
export function BlockTray({
  availableBlocks, // array of 3 (or null if used)
  board,
  boardRef,
  boardCellSize,
  boardGap,
  onBlockPlaced,
  disabled = false,
  setGhostPosition,
}) {
  const [activeDragIndex, setActiveDragIndex] = useState(null);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const [originPos, setOriginPos] = useState({ x: 0, y: 0 });
  const [isReturning, setIsReturning] = useState(false);

  const dragRef = useRef({
    blockIndex: null,
    pointerId: null,
    startX: 0,
    startY: 0,
    currX: 0,
    currY: 0,
    isTouch: false,
    hoveredGridPos: null, // { row, col, isValid }
  });

  // Calculate board cell under cursor/touch
  const calculateBoardHover = useCallback(
    (clientX, clientY, block, isTouch) => {
      if (!boardRef.current || !block) return null;

      // For touch devices, offset cursor slightly upward so finger doesn't block the visual grid
      const touchOffsetY = isTouch ? -60 : 0;
      const targetY = clientY + touchOffsetY;

      const boardRect = boardRef.current.getBoundingClientRect();
      const padding = 14; // padding of .game-board-surface
      const totalCellStep = boardCellSize + boardGap;

      // Board inner boundaries
      const startX = boardRect.left + padding;
      const startY = boardRect.top + padding;

      // Center the block on the cursor
      const matrix = block.matrix;
      const blockWidthPx = (matrix[0].length * boardCellSize) + (matrix[0].length - 1) * boardGap;
      const blockHeightPx = (matrix.length * boardCellSize) + (matrix.length - 1) * boardGap;

      const blockLeft = clientX - blockWidthPx / 2;
      const blockTop = targetY - blockHeightPx / 2;

      // Calculate candidate grid row and col
      const col = Math.round((blockLeft - startX) / totalCellStep);
      const row = Math.round((blockTop - startY) / totalCellStep);

      const isValid = canPlaceBlock(board, block, row, col);

      return {
        row,
        col,
        isValid,
        block,
      };
    },
    [board, boardRef, boardCellSize, boardGap]
  );

  // Global Pointer Move
  const handlePointerMove = useCallback(
    e => {
      if (dragRef.current.blockIndex === null) return;
      if (dragRef.current.pointerId !== null && e.pointerId !== dragRef.current.pointerId) return;

      const clientX = e.clientX;
      const clientY = e.clientY;
      const isTouch = dragRef.current.isTouch;

      setDragPos({ x: clientX, y: clientY });

      const block = availableBlocks[dragRef.current.blockIndex];
      if (block) {
        const hoverResult = calculateBoardHover(clientX, clientY, block, isTouch);
        dragRef.current.hoveredGridPos = hoverResult;
        setGhostPosition(hoverResult);
      }
    },
    [availableBlocks, calculateBoardHover, setGhostPosition]
  );

  // Global Pointer Up / Cancel
  const handlePointerUp = useCallback(
    e => {
      if (dragRef.current.blockIndex === null) return;
      if (dragRef.current.pointerId !== null && e.pointerId !== dragRef.current.pointerId) return;

      const blockIdx = dragRef.current.blockIndex;
      const block = availableBlocks[blockIdx];
      const hover = dragRef.current.hoveredGridPos;

      // Reset ghost preview
      setGhostPosition(null);

      if (block && hover && hover.isValid) {
        // Successful drop!
        soundManager.playDrop();
        onBlockPlaced(blockIdx, block, hover.row, hover.col);
        setActiveDragIndex(null);
        dragRef.current.blockIndex = null;
      } else {
        // Invalid drop - return smoothly
        soundManager.playInvalid();
        setIsReturning(true);
        setTimeout(() => {
          setActiveDragIndex(null);
          setIsReturning(false);
          dragRef.current.blockIndex = null;
        }, 180);
      }

      dragRef.current.pointerId = null;
      dragRef.current.hoveredGridPos = null;
    },
    [availableBlocks, onBlockPlaced, setGhostPosition]
  );

  // Attach global pointer listeners when dragging
  useEffect(() => {
    if (activeDragIndex !== null) {
      window.addEventListener('pointermove', handlePointerMove, { passive: false });
      window.addEventListener('pointerup', handlePointerUp);
      window.addEventListener('pointercancel', handlePointerUp);
      return () => {
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
        window.removeEventListener('pointercancel', handlePointerUp);
      };
    }
  }, [activeDragIndex, handlePointerMove, handlePointerUp]);

  // Pointer Down on Tray Piece
  const handlePointerDown = (index, block, e) => {
    if (disabled || !block) return;

    // Start pickup
    soundManager.playPickup();

    const rect = e.currentTarget.getBoundingClientRect();
    setOriginPos({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });
    setDragPos({ x: e.clientX, y: e.clientY });

    const isTouch = e.pointerType === 'touch';
    dragRef.current = {
      blockIndex: index,
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      currX: e.clientX,
      currY: e.clientY,
      isTouch,
      hoveredGridPos: null,
    };

    setActiveDragIndex(index);
    setIsReturning(false);

    // Initial check
    const hoverResult = calculateBoardHover(e.clientX, e.clientY, block, isTouch);
    dragRef.current.hoveredGridPos = hoverResult;
    setGhostPosition(hoverResult);
  };

  const activeBlock = activeDragIndex !== null ? availableBlocks[activeDragIndex] : null;

  return (
    <div className="block-tray-container" style={{ width: '100%', position: 'relative' }}>
      <div
        className="block-tray-slots"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          padding: '12px',
          background: 'linear-gradient(180deg, rgba(17, 24, 39, 0.75) 0%, rgba(10, 13, 24, 0.9) 100%)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 12px 30px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(16px)',
          minHeight: '120px',
        }}
      >
        {availableBlocks.map((block, index) => {
          const isBeingDragged = activeDragIndex === index;

          return (
            <div
              key={block ? block.instanceId : `empty-slot-${index}`}
              className={`tray-slot ${block ? 'has-block' : 'slot-empty'}`}
              onPointerDown={e => block && handlePointerDown(index, block, e)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100px',
                borderRadius: '16px',
                background: block
                  ? 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.04) 0%, rgba(0, 0, 0, 0.25) 100%)'
                  : 'rgba(255, 255, 255, 0.015)',
                border: block
                  ? '1px solid rgba(255, 255, 255, 0.06)'
                  : '1px dashed rgba(255, 255, 255, 0.04)',
                cursor: block && !disabled ? 'grab' : 'default',
                touchAction: 'none',
                position: 'relative',
                transition: 'all 0.2s ease',
              }}
            >
              {block && (
                <div
                  style={{
                    opacity: isBeingDragged ? 0.25 : 1,
                    transform: 'scale(0.92)',
                    transition: 'opacity 0.15s ease',
                  }}
                >
                  <BlockPiece block={block} cellSize={24} gap={3} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Floating Drag Overlay */}
      {activeDragIndex !== null && activeBlock && (
        <div
          className="floating-drag-piece"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 9999,
            pointerEvents: 'none',
            transform: isReturning
              ? `translate3d(${originPos.x}px, ${originPos.y}px, 0) translate(-50%, -50%) scale(0.92)`
              : `translate3d(${dragPos.x}px, ${
                  dragPos.y + (dragRef.current.isTouch ? -60 : 0)
                }px, 0) translate(-50%, -50%) scale(1.1)`,
            transition: isReturning
              ? 'transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)'
              : 'none',
          }}
        >
          <BlockPiece
            block={activeBlock}
            cellSize={boardCellSize}
            gap={boardGap}
            isDragging={true}
          />
        </div>
      )}
    </div>
  );
}

export default BlockTray;
